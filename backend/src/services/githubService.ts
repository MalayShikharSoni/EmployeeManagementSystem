// GitHub REST API integration service with in-memory caching

interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

interface GitHubContributorStats {
  author: {
    login: string;
    avatar_url: string;
  };
  total: number;
  weeks: {
    w: number;
    a: number; // additions
    d: number; // deletions
    c: number; // commits
  }[];
}

export interface ContributorData {
  username: string;
  avatar_url: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface CommitTimelineEntry {
  date: string;
  commits: number;
}

export interface GitHubStatsResult {
  contributors: ContributorData[];
  commitTimeline: CommitTimelineEntry[];
  totalCommits: number;
  lastFetched: string;
  repoUrl: string;
}

// In-memory cache
const cache = new Map<string, { data: GitHubStatsResult; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Handle formats:
    // https://github.com/owner/repo
    // https://github.com/owner/repo.git
    // github.com/owner/repo
    const cleaned = url.replace(/\.git$/, '').replace(/\/$/, '');
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchGitHubAPI(endpoint: string): Promise<Response> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'WorkWave-EMS',
  };

  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`https://api.github.com${endpoint}`, { headers });
}

export async function getGitHubStats(repoUrl: string): Promise<GitHubStatsResult> {
  // Check cache first
  const cached = cache.get(repoUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL');
  }

  const { owner, repo } = parsed;

  // Fetch commits (last 100)
  const commitsResponse = await fetchGitHubAPI(`/repos/${owner}/${repo}/commits?per_page=100`);
  if (!commitsResponse.ok) {
    if (commitsResponse.status === 404) {
      throw new Error('Repository not found. Make sure the URL is correct and the repo is accessible.');
    }
    if (commitsResponse.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Try again later or add a GITHUB_PERSONAL_ACCESS_TOKEN.');
    }
    throw new Error(`GitHub API error: ${commitsResponse.status}`);
  }
  const commits: GitHubCommit[] = await commitsResponse.json() as GitHubCommit[];

  // Fetch contributor stats
  let contributorStats: GitHubContributorStats[] = [];
  const statsResponse = await fetchGitHubAPI(`/repos/${owner}/${repo}/stats/contributors`);
  if (statsResponse.ok) {
    contributorStats = await statsResponse.json() as GitHubContributorStats[];
  }
  // GitHub sometimes returns 202 (computing) — we just use what we have from commits

  // Process commits per author
  const authorMap = new Map<string, ContributorData>();

  for (const commit of commits) {
    const username = commit.author?.login || commit.commit.author.name;
    const avatarUrl = commit.author?.avatar_url || '';
    
    if (!authorMap.has(username)) {
      authorMap.set(username, {
        username,
        avatar_url: avatarUrl,
        commits: 0,
        additions: 0,
        deletions: 0,
      });
    }
    const entry = authorMap.get(username)!;
    entry.commits += 1;
  }

  // Merge contributor stats for additions/deletions
  for (const stat of contributorStats) {
    const username = stat.author.login;
    const existing = authorMap.get(username);
    if (existing) {
      existing.additions = stat.weeks.reduce((sum, w) => sum + w.a, 0);
      existing.deletions = stat.weeks.reduce((sum, w) => sum + w.d, 0);
    } else {
      authorMap.set(username, {
        username,
        avatar_url: stat.author.avatar_url,
        commits: stat.total,
        additions: stat.weeks.reduce((sum, w) => sum + w.a, 0),
        deletions: stat.weeks.reduce((sum, w) => sum + w.d, 0),
      });
    }
  }

  // Build commit timeline (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailyMap = new Map<string, number>();

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    dailyMap.set(d.toISOString().split('T')[0], 0);
  }

  for (const commit of commits) {
    const date = commit.commit.author.date.split('T')[0];
    if (dailyMap.has(date)) {
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    }
  }

  const commitTimeline: CommitTimelineEntry[] = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    commits: count,
  }));

  const contributors = Array.from(authorMap.values()).sort((a, b) => b.commits - a.commits);

  const result: GitHubStatsResult = {
    contributors,
    commitTimeline,
    totalCommits: commits.length,
    lastFetched: new Date().toISOString(),
    repoUrl,
  };

  // Cache the result
  cache.set(repoUrl, { data: result, timestamp: Date.now() });

  return result;
}

export function clearGitHubCache(repoUrl?: string): void {
  if (repoUrl) {
    cache.delete(repoUrl);
  } else {
    cache.clear();
  }
}
