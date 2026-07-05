# 08 — Known Gaps, TODOs, Dead Code & Performance

> The unflattering inventory: every TODO/FIXME, every `console.*`, commented-out code,
> missing error handling, the (total) absence of tests, and the concrete performance problems.

---

## 1. TODO / FIXME / HACK / XXX markers

A repo-wide search for `TODO|FIXME|XXX|HACK` (excluding `node_modules`) found:

- **Zero genuine markers in source code.** The only match is a false positive inside
  `backend/package-lock.json:2067` (the literal string `XXXevb5dJI7` inside an integrity hash).

So there are **no tracked TODOs/FIXMEs**. This is *not* a sign of completeness — it means
unfinished work is undocumented and lives as dead code, stubs, and stream-of-consciousness
comments instead (see below). The absence of markers makes the incomplete parts harder, not
easier, to find.

---

## 2. `console.*` statements (left in production code)

`console.log`/`error`/`warn`/`debug` are the app's actual logging strategy (winston is unused —
doc 07). Counts by file:

### Backend (~84 total; many legitimate, some debug noise)

| File | Count | Assessment |
|------|-------|------------|
| `config/migration.ts` | 22 | progress logs — acceptable for a manual script |
| `controllers/taskController.ts` | 12 | all `console.error` in catch blocks — operational, but unstructured |
| `controllers/groupController.ts` | 10 | catch-block errors |
| `controllers/authController.ts` | 8 | catch-block errors |
| `controllers/invitationController.ts` | 6 | catch-block errors |
| `cron/taskCron.ts` | 5 | job progress — acceptable |
| `controllers/notificationController.ts` | 4 | catch-block errors |
| `services/socketService.ts` | 3 | connect/disconnect + notif error |
| `controllers/commentController.ts` | 3 | errors |
| `controllers/leaderboardController.ts` | 3 | errors |
| `config/database.ts` | 2 | connect/error events |
| `middleware/errorHandler.ts` | 2 | the actual error logger |
| `controllers/analyticsController.ts`, `employeeController.ts`, `index.ts`, `routes/auth.ts` | 1 each | mixed |

The backend has **no log levels, no request IDs, no structured logging**. Every 500 is a bare
`console.error(err)`; in production the stack goes to stdout only.

### Frontend (~71 total; this is the real problem area)

| File | Count | Assessment |
|------|-------|------------|
| `context/AuthProvider.tsx` | **19** | ⚠️ Verbose debug logging shipped to prod: logs `[AUTH]` step-by-step, timestamps, and an **access-token preview** (`token.substring(0,30)`) to the console (`AuthProvider.tsx:32-36`). Minor token/info leak + noise. |
| `components/Dashboard/EmployeeDashboard.tsx` | 6 | includes `console.log('EmployeeDashboard RE-RENDERED')` and full task-object dumps (`:14,33,34`). |
| `components/other/CreateTask.tsx` | 5 | debug/errors |
| `pages/GroupDetailPage.tsx` | 5 | debug/errors |
| `components/TaskList/AcceptedTask.tsx` | 4 | debug/errors |
| `services/socket.ts`, `NewTask.tsx`, `TaskCommentsModal.tsx`, `hooks/useNotifications.ts` | 3 each | connect logs / errors |
| ~13 other files | 1–2 each | mostly `console.error` in catch |

**Bottom line:** ~155 `console.*` calls across the codebase, none behind a debug flag. The
`AuthProvider` and `EmployeeDashboard` logging is clearly leftover debugging.

---

## 3. Commented-out code & dead code

| Location | What |
|----------|------|
| `frontend/src/main.tsx:1` | `// import { StrictMode } from "react";` — StrictMode intentionally disabled and left commented. |
| `frontend/src/index.css:9` | commented-out `cursor: url(...)` rule. |
| `frontend-old/src/components/Dashboard/EmployeeDashboard.tsx:4` | `// import HeaderUser ...` (then re-imported on line 10). |
| `backend/src/models/leaderboardModel.ts:33-89` | **Entire dead `getLiveLeaderboard` method** — contains invalid SQL `Math.ROUND(...)` (would throw in Postgres) and a block of developer stream-of-consciousness comments (lines 80-83: *"We need to do the math.round in JS… Let's just fix it."*). Superseded by `getLiveLeaderboardSafe` (`:91`), which is what the controller calls. The broken version was never deleted. |
| `backend/src/middleware/errorHandler.ts:10-20` | `AppError` class defined/exported but never used anywhere. |
| `backend/src/services/socketService.ts:71` | `admin:<id>` room joined but never emitted to. |
| `backend/src/types/socketTypes.ts:63-68` | `ClientToServerEvents.'join:room'` and `InterServerEvents.ping` declared but never handled server-side. |
| `frontend-old/` (whole dir) | Dead single file. |
| `frontend-next/` (whole dir) | Abandoned migration. |
| `frontend-next/.../TeamManagement.jsx` **and** `.tsx` | duplicate. |

### Committed junk artifacts (also in doc 01 §6)
- `backend/ts-err.txt` — a captured ts-node compile-error dump.
- `frontend/h --force origin main` — a git-log capture created by a mistyped git command.

---

## 4. Tests — confirmed ZERO automated tests

**Confirmed: there are no automated tests anywhere in the repository.**

- No test runner in any `package.json` (no jest/vitest/mocha/supertest/RTL/cypress/playwright).
- No `test` script in any `package.json`.
- No `*.test.ts(x)` / `*.spec.ts(x)` files exist.
- The only test-like artifact is **`frontend/test-notifications.cjs`** — a **manual, hand-run
  Node script** (`node test-notifications.cjs`) that registers a throwaway admin+employee, opens
  a socket, sends an invitation, and `console.log`s whether a notification arrived. It:
  - hardcodes `password: 'password123'`,
  - hits a **live** backend on `localhost:5000` and writes real rows to the real DB,
  - has no assertions framework, no cleanup, and `process.exit()`s.
  It is smoke-testing scaffolding, not a test suite.

### Highest-risk modules to leave untested (prioritized)

1. **`middleware/auth.ts` + `authController.ts`** — token issuance/refresh/logout and role
   enforcement. Bugs here are security incidents. Untested.
2. **`taskController.ts` authorization** — already contains a real IDOR (`deleteTask` doesn't
   check ownership) and missing status-transition validation. No test would have caught it.
3. **`groupController.ts`** — multiple unauthenticated-access IDORs (`getGroupTasks`,
   `getGroupProgress`, `updateTaskStatus`, `getGithubStats`). Highest concentration of access-
   control bugs, zero tests.
4. **`leaderboardModel.ts`** — ships a dead method with invalid SQL; the "safe" scoring query is
   complex (weighted scoring) and untested; client-supplied score is trusted on archive.
5. **`invitationController.ts`** — the single-team invariant is enforced only in app code with a
   read-then-write race window; untested.
6. **`services/socket.ts` URL handling** — the `/api` misconfiguration (doc 04/05) would be
   caught by a single integration test of the socket connection.

---

## 5. Error-handling gaps

Nearly every controller *does* wrap its body in `try/catch`, so uncaught-exception crashes are
rare. The gaps are more subtle:

1. **`authController.uploadAvatar` can hang with no response** (`authController.ts:300-314`): the
   Cloudinary callback only responds inside `if (result && result.secure_url)`. If Cloudinary
   returns neither error nor `secure_url`, **no `res` is ever sent** → the client waits until its
   60s timeout. No `else`/timeout guard.
2. **Fire-and-forget async with swallowed failures:**
   - `socketService.emitTaskAssigned` / `emitInvitationReceived` / `emitInvitationResponded` call
     `createAndEmitNotification` **without `await`** (`socketService.ts:110,127,140,153`). A failed
     notification persist is only `console.error`'d; the HTTP handler already returned success, so
     the client believes the notification was delivered when it may not have been.
   - `commentController.createComment` emits sockets before the DB notification is confirmed.
3. **No transaction around multi-write flows** (doc 03 §13): create-task-with-attachments
   (`taskController.ts:52-110`) can partially succeed (task row created, some attachments failed,
   socket already emitted) with no rollback.
4. **The central `errorHandler` is effectively bypassed** because handlers catch locally and
   return generic 500s, so PG error codes that *would* map to 409/400 (`errorHandler.ts:44-51`)
   are reported as opaque 500s instead.
5. **GitHub service throws surface as 500 with raw messages** (`groupController.ts:203`
   `error.message`) — a rate-limit or 404 from GitHub is passed through as the error string.
6. **Frontend fetch failures often just `console.error` and leave stale/empty UI** (e.g.
   `AnalyticsPage.fetchAnalytics` catch only logs, `AnalyticsPage.tsx:60-64`; `fetchMyGroups`
   catch only logs, `EmployeeDashboard.tsx:54`) — no error state shown to the user for several
   views.

---

## 6. Performance problems

### 6.1 N+1 query — `GroupModel.getEmployeeGroupTasks` (`groupModel.ts:241-266`)

```ts
const groupsResult = await pool.query(`SELECT pg.id, pg.name FROM project_groups pg
  JOIN project_group_members pgm ON ... WHERE pgm.employee_id = $1 ...`);

for (const group of groupsResult.rows) {
  const tasksResult = await pool.query(
    `SELECT * FROM project_tasks WHERE group_id = $1 AND assigned_to = $2 AND status != 'completed' ...`,
    [group.id, employeeId]
  );
  groups.push({ ... tasks: tasksResult.rows });
}
```

Classic **N+1**: one query for the groups, then **one query per group** in a loop. Backing the
employee dashboard's "My Groups" section. Should be a single JOIN.

### 6.2 Per-row correlated subqueries (N+1 inside a single statement)

`taskModel.getByUserId` (`:74-91`), `taskModel.getAll` (`:94-111`), and
`taskModel.getGroupedByEmployee` (`:160-198`) each compute `attachment_count` and `comment_count`
via **correlated subqueries evaluated per task row**:

```sql
(SELECT COUNT(*)::int FROM task_attachments ta WHERE ta.task_id = t.id) as attachment_count,
(SELECT COUNT(*)::int FROM task_comments tc WHERE tc.task_id = t.id) as comment_count
```

For an admin with many tasks, `getAll` runs 2 subqueries × N rows. Should be `LEFT JOIN … GROUP
BY` or lateral aggregates. `getAll` also has **no LIMIT** (see 6.4).

### 6.3 Analytics does 7 sequential round-trips per request

`analyticsController.getAnalytics` (`analyticsController.ts:16-128`) issues **7 separate
`await pool.query` calls in sequence** (team count, tasks-this-month, overall stats, by-priority,
most-active, `generate_series` daily completions, per-employee, avg time — actually 8). No
`Promise.all`, no caching, no materialized view. Every load of the admin analytics page pays all
of them serially.

### 6.4 Missing pagination / unbounded result sets

- **`GET /api/tasks/all`** (`taskModel.getAll`, `:94`) — returns **every task in the entire
  database**, no `WHERE`, no `LIMIT`. Grows without bound; also a data-scoping bug (doc 02/04).
- **`GET /api/tasks/my-tasks`**, **`/tasks/by-employee`**, **`/invitations/*`**,
  **`/leaderboard`**, **`/groups`**, **group tasks/progress** — none paginate. They return full
  result sets.
- **The only paginated endpoint is `/api/notifications`** (`limit`/`offset`).

### 6.5 Leaderboard scans the whole `tasks` table

`getLiveLeaderboardSafe` (`leaderboardModel.ts:91-142`) builds a `task_stats` CTE that aggregates
**the entire `tasks` table** (`GROUP BY t.assigned_to` with no admin scoping in the CTE) on every
leaderboard load, then joins to the admin's team members. With no index on `assigned_to`/`status`
(doc 03), this is a full scan + aggregate per request.

### 6.6 Frontend over-fetching via `refreshTrigger`

Any single socket event bumps `refreshTrigger`, causing **every mounted subscriber** to re-fetch
its full dataset (doc 06 §3). A burst of task updates triggers a burst of full refetches. The
socket payloads that could have surgically updated state are discarded.

### 6.7 Root-level mousemove setState

`App.tsx:32-35` calls `setXAxis/setYAxis` on **every `mousemove`**, re-rendering the root `App`
(and reconciling the whole route tree) continuously while the mouse moves, purely to drive the
custom cursor. `useMemo` on the props helps a little but the root state churn remains.

---

## 7. Feature/functional gaps

- **`project_tasks.is_overdue` is never set** — the overdue cron only touches `tasks`
  (`taskCron.ts`), so the project-groups feature has a dead overdue flag.
- **No Cloudinary cleanup** on task/attachment/user deletion — orphaned blobs accumulate
  (doc 03 §5).
- **No task status state machine** — employees can complete un-accepted tasks, fail completed
  ones, etc. (doc 02 §2).
- **`comment:new` socket event has no client listener** — real-time comments rely on the
  side-channel notification refresh (doc 05 §4).
- **Real-time is likely broken in production** due to the socket `/api` URL bug (doc 04 §9).
- **No email**, no invitation email, no password reset, no email verification — invitations are
  in-app only.
- **`refresh_tokens` table is never pruned** — unbounded growth (doc 03 §3).
- **Single-team invariant and email-uniqueness rely on app-level checks with race windows**, not
  DB constraints (doc 03 §1, §4).
