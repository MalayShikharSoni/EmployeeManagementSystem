import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { groupAPI } from '../services/api';
import type { ProjectGroup, ProjectTask, MemberProgress, GitHubStatsResult } from '../types';
import HeaderUser from './HeaderUser';
import AvatarUpload from '../components/AvatarUpload/AvatarUpload';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts';
import styles from './GroupDetailPage.module.css';

const priorityColors: Record<string, string> = {
  urgent: '#d62828',
  high: '#e07b39',
  medium: '#f4a261',
  low: '#8b6c3e',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className={styles.tooltipData}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

type TabType = 'progress' | 'tasks' | 'github';

const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [group, setGroup] = useState<ProjectGroup | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [progress, setProgress] = useState<MemberProgress[]>([]);
  const [githubStats, setGithubStats] = useState<GitHubStatsResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [isLoading, setIsLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState<number>(0);
  const [isAssigning, setIsAssigning] = useState(false);

  // GitHub URL edit
  const [editGithubUrl, setEditGithubUrl] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    if (groupId) fetchAll();
  }, [groupId]);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const gId = parseInt(groupId as string, 10);
      const [groupRes, tasksRes, progressRes] = await Promise.all([
        groupAPI.getGroupDetail(gId),
        groupAPI.getGroupTasks(gId),
        groupAPI.getGroupProgress(gId),
      ]);
      setGroup(groupRes.data.data);
      setTasks(tasksRes.data.data);
      setProgress(progressRes.data.data);
      setEditGithubUrl(groupRes.data.data.github_repo_url || '');
    } catch (err) {
      console.error('Failed to load group:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGithubStats = async () => {
    if (!groupId) return;
    try {
      setGithubLoading(true);
      const res = await groupAPI.getGithubStats(parseInt(groupId, 10));
      setGithubStats(res.data.data);
    } catch (err: any) {
      console.error('GitHub fetch failed:', err);
      alert(err.response?.data?.error || 'Failed to fetch GitHub stats.');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleAssignTask = async () => {
    if (!groupId || !taskTitle.trim() || !taskAssignee) return;
    try {
      setIsAssigning(true);
      await groupAPI.createGroupTask(parseInt(groupId, 10), {
        assignedTo: taskAssignee,
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        priority: taskPriority,
        dueDate: taskDueDate || undefined,
      });
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('medium');
      setTaskDueDate('');
      setTaskAssignee(0);
      await fetchAll();
    } catch (err) {
      console.error('Failed to assign task:', err);
      alert('Failed to assign task.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUpdateGithub = async () => {
    if (!groupId) return;
    try {
      await groupAPI.updateGithubUrl(parseInt(groupId, 10), editGithubUrl.trim());
      await fetchAll();
      setGithubStats(null);
    } catch (err) {
      console.error('Failed to update GitHub URL:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: string) => {
    if (!groupId) return;
    try {
      await groupAPI.updateTaskStatus(parseInt(groupId, 10), taskId, status);
      await fetchAll();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useGSAP(() => {
    if (!isLoading && containerRef.current) {
      gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.detail-anim', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)', delay: 0.2 });
    }
  }, [isLoading, activeTab]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div><div className={styles.spinner}></div><div className={styles.loadingText}>Loading Group...</div></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>Group not found</div>
      </div>
    );
  }

  const overallProgress = (group.task_count || 0) > 0
    ? Math.round(((group.completed_task_count || 0) / (group.task_count || 1)) * 100)
    : 0;

  return (
    <>
      <HeaderUser data={userData ? { ...userData, data: { ...userData.data, first_name: userData.data.firstName || userData.data.first_name } } as any : null} />

      <div className={styles.container} ref={containerRef}>
        {/* Header */}
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/groups')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Groups
          </button>
          <h1 className={styles.title}>{group.name}</h1>
          {group.description && <p className={styles.groupDesc}>{group.description}</p>}
          <div className={styles.headerMeta}>
            <span className={styles.statusBadge}>{group.status}</span>
            <span style={{ color: '#8b6c3e', fontWeight: 800 }}>{group.member_count} Members</span>
            <span style={{ color: '#8b6c3e', fontWeight: 800 }}>{overallProgress}% Complete</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === 'progress' ? styles.active : ''}`} onClick={() => setActiveTab('progress')}>Member Progress</button>
          <button className={`${styles.tabBtn} ${activeTab === 'tasks' ? styles.active : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
          {group.github_repo_url && (
            <button className={`${styles.tabBtn} ${activeTab === 'github' ? styles.active : ''}`} onClick={() => { setActiveTab('github'); if (!githubStats) fetchGithubStats(); }}>GitHub Stats</button>
          )}
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className={`detail-anim ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Per-Member Contribution</h3>
            <div className={styles.progressGrid}>
              {progress.map(member => (
                <div key={member.employee_id} className={styles.memberCard} onClick={() => navigate(`/employees/${member.employee_id}`)}>
                  <div className={styles.memberCardHeader}>
                    <AvatarUpload currentAvatarUrl={member.avatar_url || undefined} name={member.first_name || ''} size={45} readOnly />
                    <div>
                      <div className={styles.memberCardName}>{member.first_name}</div>
                      <div className={styles.memberCardEmail}>{member.email}</div>
                    </div>
                  </div>
                  <div className={styles.memberStatsRow}>
                    <div className={styles.memberStat}>Done: <span>{member.completed_tasks}</span></div>
                    <div className={styles.memberStat}>Active: <span>{member.active_tasks}</span></div>
                    <div className={styles.memberStat}>Total: <span>{member.total_tasks}</span></div>
                  </div>
                  <div className={styles.progressBarWrap}>
                    <div className={styles.progressBarFill} style={{ width: `${member.completion_rate}%` }} />
                  </div>
                  <div className={styles.progressLabel}>{member.completion_rate}%</div>
                </div>
              ))}
              {progress.length === 0 && <div className={styles.emptyText}>No members in this group yet.</div>}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className={`detail-anim ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Project Tasks</h3>

            {/* Assign task form (admin only) */}
            {isAdmin && group.members && group.members.length > 0 && (
              <div className={styles.taskForm}>
                <div className={styles.taskFormGroup}>
                  <label className={styles.taskFormLabel}>Task Title</label>
                  <input className={styles.taskFormInput} value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title" />
                </div>
                <div className={styles.taskFormGroup}>
                  <label className={styles.taskFormLabel}>Assign To</label>
                  <select className={styles.taskFormSelect} value={taskAssignee} onChange={e => setTaskAssignee(parseInt(e.target.value, 10))}>
                    <option value={0}>Select member...</option>
                    {group.members.map(m => (
                      <option key={m.employee_id} value={m.employee_id}>{m.first_name} ({m.email})</option>
                    ))}
                  </select>
                </div>
                <div className={styles.taskFormGroup}>
                  <label className={styles.taskFormLabel}>Priority</label>
                  <select className={styles.taskFormSelect} value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className={styles.taskFormGroup}>
                  <label className={styles.taskFormLabel}>Due Date</label>
                  <input className={styles.taskFormInput} type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
                </div>
                <div className={`${styles.taskFormGroup} ${styles.full}`}>
                  <label className={styles.taskFormLabel}>Description (optional)</label>
                  <textarea className={styles.taskFormTextarea} value={taskDesc} onChange={e => setTaskDesc(e.target.value)} placeholder="Task description..." />
                </div>
                <button className={styles.assignBtn} onClick={handleAssignTask} disabled={isAssigning || !taskTitle.trim() || !taskAssignee}>
                  {isAssigning ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            )}

            <div className={styles.tasksList}>
              {tasks.length === 0 ? (
                <div className={styles.emptyText}>No tasks have been assigned yet.</div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskLeft}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskAssignee}>{task.assignee_name}</span>
                      <span className={styles.priorityBadge} style={{ backgroundColor: priorityColors[task.priority] || '#8b6c3e' }}>{task.priority}</span>
                      <span className={styles.taskStatusBadge}>{task.status}</span>
                      {task.is_overdue && <span className={styles.overdueBadge}>OVERDUE</span>}
                    </div>
                    <div className={styles.taskRight}>
                      {task.due_date && <span className={styles.taskDue}>{new Date(task.due_date).toLocaleDateString()}</span>}
                      {task.status === 'new' && task.assigned_to === userData?.data.id && (
                        <button onClick={() => handleUpdateTaskStatus(task.id, 'active')} style={{ background: '#2a9d8f', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Accept</button>
                      )}
                      {task.status === 'active' && task.assigned_to === userData?.data.id && (
                        <>
                          <button onClick={() => handleUpdateTaskStatus(task.id, 'completed')} style={{ background: '#2a9d8f', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Complete</button>
                          <button onClick={() => handleUpdateTaskStatus(task.id, 'failed')} style={{ background: '#d62828', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Fail</button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* GitHub Tab */}
        {activeTab === 'github' && (
          <div className={`detail-anim ${styles.section}`}>
            {isAdmin && (
              <div className={styles.githubInputRow}>
                <input value={editGithubUrl} onChange={e => setEditGithubUrl(e.target.value)} placeholder="https://github.com/owner/repo" />
                <button onClick={handleUpdateGithub}>Update URL</button>
              </div>
            )}

            <div className={styles.githubHeader}>
              <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>GitHub Repository Stats</h3>
              <div>
                <button className={styles.refreshBtn} onClick={fetchGithubStats} disabled={githubLoading}>
                  {githubLoading ? 'Fetching...' : 'Refresh Stats'}
                </button>
                {githubStats && <div className={styles.lastFetched}>Last fetched: {new Date(githubStats.lastFetched).toLocaleString()}</div>}
              </div>
            </div>

            {githubLoading && !githubStats && (
              <div className={styles.emptyText}>Fetching GitHub data...</div>
            )}

            {githubStats && (
              <>
                {/* Commits per contributor */}
                <div className={styles.chartTitle}>Commits per Contributor</div>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={githubStats.contributors} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="username" axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="commits" radius={[4, 4, 0, 0]} barSize={40}>
                        {githubStats.contributors.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#f4a261' : '#ad9676'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Lines added/deleted */}
                <div className={styles.chartTitle}>Lines Added / Deleted per Contributor</div>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={githubStats.contributors} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="username" axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar dataKey="additions" name="Additions" fill="#2a9d8f" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="deletions" name="Deletions" fill="#d62828" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Commit timeline */}
                <div className={styles.chartTitle}>Commit Timeline (Last 30 Days)</div>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={githubStats.commitTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b6c3e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b6c3e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 10, fontWeight: 600 }} interval={4} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 600 }} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="commits" stroke="#8b6c3e" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" activeDot={{ r: 6, fill: '#3b3123', stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {!githubStats && !githubLoading && (
              <div className={styles.emptyText}>Click "Refresh Stats" to load GitHub data.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GroupDetailPage;
