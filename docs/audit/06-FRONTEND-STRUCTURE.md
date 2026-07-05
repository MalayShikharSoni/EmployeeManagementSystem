# 06 — Frontend Structure

> Scope: the **active** app in `frontend/` (Vite + React 18 + TypeScript). The abandoned
> `frontend-next/` and dead `frontend-old/` are covered only where relevant (see doc 01 §0).

---

## 1. Bootstrapping & provider tree

`frontend/src/main.tsx`:

```tsx
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>,
);
```

- **`<StrictMode>` is disabled** — commented out at `main.tsx:1`. So double-invoke dev checks are
  off (arguably intentional because of GSAP, but it hides effect bugs).
- Provider order matters: `SocketProvider` depends on `useAuth()`, so it must be inside
  `AuthProvider`.

---

## 2. Routing structure (`frontend/src/App.tsx`)

```tsx
<BrowserRouter>
  <CustomCursor {...cursorProps} />
  <div onMouseMove={...}>
    <Routes>
      <Route path="/" Component={LandingPage} />
      <Route path="/login" Component={Login} />
      <Route path="/signup" Component={Signup} />
      <Route path="/main" Component={MainPage} />
      <Route path="/admin-dashboard" Component={AdminDashboard} />
      <Route path="/employee-dashboard" Component={EmployeeDashboard} />
      <Route path="/profile" Component={ProfilePage} />
      <Route path="/employees/:id" Component={EmployeeProfilePage} />
      <Route path="/leaderboard" Component={LeaderboardPage} />
      <Route path="/groups" Component={ProjectGroupsPage} />
      <Route path="/groups/:groupId" Component={GroupDetailPage} />
      <Route path="/analytics" Component={AnalyticsPage} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Footer />
  </div>
  <TVStaticEffect />
</BrowserRouter>
```

**Findings:**
- ❌ **There is no `ProtectedRoute` / route guard.** Every route renders unconditionally. Auth is
  enforced **inside each page/dashboard component** (e.g. `AdminDashboard.tsx:42` and
  `EmployeeDashboard.tsx:80` do `if (!userData || userData.role !== 'x') return <Navigate to="/login"/>`).
  Pages like `ProfilePage`, `AnalyticsPage`, `LeaderboardPage`, `ProjectGroupsPage`,
  `GroupDetailPage` each must remember to guard themselves; the pattern is copy-pasted, not
  centralized, so it's easy to ship a page with no guard. (The real access control is server-side
  anyway; this is a UX/consistency issue.)
- Uses the React Router v7 `Component={X}` prop form (not `element={<X/>}`) for most routes but
  `element=` for the catch-all — mixed API usage in the same file.
- `<Footer/>`, `<CustomCursor/>`, `<TVStaticEffect/>` render on **every** route including
  login/landing — global chrome.
- `App` tracks mouse position in state (`xAxis`/`yAxis`, `App.tsx:22-23`) and re-renders on every
  `mousemove` (throttled only by `useMemo`), feeding `CustomCursor`. This is a per-pixel
  setState on the root component — a notable render-churn source.

### `MainPage` — the redirect hub (`MainPage.tsx`)

```tsx
if (isLoading) return <Spinner/>;
if (!isAuthenticated) return <Navigate to="/login" replace />;
if (userData?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
return <Navigate to="/employee-dashboard" replace />;
```

Login/Signup send the user to `/main`, which bounces them to the correct dashboard by role.

---

## 3. State management approach

**No Redux / Zustand / Jotai / React Query.** State is managed with:

1. **React Context ×2** (the only global state):
   - `AuthProvider` (`context/AuthProvider.tsx`) — holds `userData`, `isLoading`,
     `isAuthenticated`; exposes `login`, `register`, `logout`, `checkAuth`. Everything memoized
     with `useCallback`/`useMemo`. On mount it calls `checkAuth()` → `GET /auth/me`.
   - `SocketProvider` (`context/SocketProvider.tsx`) — holds the live `socket` and a numeric
     `refreshTrigger`. Registers global socket listeners that fire toasts and bump
     `refreshTrigger`.
2. **Local component state** (`useState`) everywhere else. Each page/component fetches its own
   data in `useEffect` and stores it locally.
3. **A custom hook** `useNotifications` (`hooks/useNotifications.ts`) — the only reusable data
   hook. Does REST fetch + optimistic mark-as-read + socket-driven prepend.
4. **`refreshTrigger` as a pub/sub bus.** The single most important pattern: components subscribe
   to `refreshTrigger` in their `useEffect` deps; whenever any socket event arrives, the number
   increments and every subscribed component re-fetches. Simple, but it means **every live event
   triggers a full refetch of every mounted data view** (over-fetching), and the actual event
   payloads are mostly discarded.

**Auth state persistence:** `userData` is not persisted; on reload, `AuthProvider` re-derives it
from `localStorage` tokens via `GET /auth/me`. Tokens live in `localStorage` (see doc 04 §5).

### Notable state/UX smells
- **`window.location.href` used for navigation** inside React Router app
  (`EmployeeDashboard.tsx:128` → `window.location.href = '/groups/${id}'`) — full page reload
  instead of `navigate()`.
- **`alert()` used for user feedback** (`EmployeeDashboard.tsx:62,65`) alongside the toast system
  — inconsistent feedback UX.
- **Heavy inline styles** in `EmployeeDashboard.tsx:120-158` (the "My Groups" section is styled
  entirely with inline `style={{...}}` objects, including hardcoded hex colors), while the rest of
  the app uses CSS Modules. Inconsistent styling strategy within a single component.
- **`changeUser = useCallback(() => {}, [])`** — a no-op callback defined and passed as a prop in
  `MainPage.tsx:9`, `AdminDashboard.tsx:27`, `EmployeeDashboard.tsx:26`. Dead prop plumbing.
- Debug `console.log('EmployeeDashboard RE-RENDERED')` and task dumps left in production code
  (`EmployeeDashboard.tsx:14,33,34`).

---

## 4. How API calls are made — central client vs scattered fetch

✅ **There is a central API client**: `frontend/src/services/api.ts`. It exports one configured
Axios instance plus **typed API modules**: `authAPI`, `taskAPI`, `invitationAPI`,
`notificationAPI`, `commentAPI`, `employeeAPI`, `leaderboardAPI`, `groupAPI`, `adminAPI`.

- Request interceptor injects the Bearer token (`api.ts:15-24`).
- Response interceptor handles 401 → refresh → retry (`api.ts:27-63`).
- Base URL from `import.meta.env.VITE_API_URL` (fallback `http://localhost:5000/api`,
  `api.ts:4`).
- Timeout `60000` ms, with a code comment explaining it was raised from 10s "to allow Render
  backend to wake up from sleep" (`api.ts:11`) — i.e. accommodating cold starts on Render's free
  tier.

**Are there scattered raw fetch/axios calls?** Almost none:
- ✅ Components consistently import the typed API modules — no stray `fetch()` calls were found in
  `frontend/src`.
- ⚠️ **One exception:** the 401-refresh handler uses a **bare `axios.post`** (not the `api`
  instance) to hit `/auth/refresh` (`api.ts:46`) — deliberate, to avoid interceptor recursion.
  Acceptable.
- So the client layer is one of the cleaner parts of the frontend: single client, typed methods,
  centralized auth/refresh.

**Type duplication:** `frontend/src/types/index.ts` re-declares interfaces that mirror the
backend's row shapes (Task, User, LeaderboardEntry, ProjectGroup, etc.). These are hand-kept in
sync — there is no shared/generated types package, so backend and frontend types can drift (and
already differ subtly, e.g. `User.firstName` vs `first_name` both optionally present,
`types/index.ts:7-8`).

---

## 5. Component tree (active app)

```
main.tsx
└─ AuthProvider (context)
   └─ SocketProvider (context)  ── ToastContainer (react-toastify)
      └─ App (BrowserRouter)
         ├─ CustomCursor            (GSAP cursor, all routes)
         ├─ TVStaticEffect          (GSAP overlay, all routes)
         ├─ Footer                  (all routes)
         └─ Routes
            ├─ "/"                 LandingPage ── HeaderHomePage, LoadingScreen (GSAP + ScrollTrigger)
            ├─ "/login"            Login (Auth/)
            ├─ "/signup"           Signup (Auth/)
            ├─ "/main"             MainPage (role redirect)
            ├─ "/admin-dashboard"  AdminDashboard
            │     ├─ HeaderUser
            │     ├─ TeamManagement  (invite flow; AvatarUpload)
            │     ├─ CreateTask      (task form + file upload)
            │     └─ AllTasks        (grouped-by-employee view; GSAP)
            ├─ "/employee-dashboard" EmployeeDashboard
            │     ├─ HeaderUser
            │     ├─ (invitations inline)
            │     ├─ TaskList
            │     │     ├─ NewTask / AcceptedTask / CompletedTask / FailedTask (each GSAP)
            │     │     ├─ TaskCommentsModal (comment thread)
            │     │     └─ TaskAttachments
            │     └─ (My Project Groups inline, inline-styled)
            ├─ "/profile"          ProfilePage (edit profile; AvatarUpload; GSAP)
            ├─ "/employees/:id"    EmployeeProfilePage (Recharts stats)
            ├─ "/leaderboard"      LeaderboardPage (EOM; GSAP)
            ├─ "/groups"           ProjectGroupsPage (GSAP)
            ├─ "/groups/:groupId"  GroupDetailPage (Recharts + GitHub stats)
            └─ "/analytics"        AnalyticsPage (Recharts admin dashboard)
```

`NotificationPanel` (`components/Notifications/`) is rendered from the header area and driven by
`useNotifications`. `HoverEffect`, `NameForm`, `TaskListNumbers` are smaller helpers.

---

## 6. Recharts usage (exactly 3 files)

Recharts is imported in **3** components:

1. **`pages/AnalyticsPage.tsx`** (`import { LineChart, Line, XAxis, YAxis, CartesianGrid,
   Tooltip, ResponsiveContainer, BarChart, Bar, Cell }`, lines 10-13). Renders the admin
   analytics dashboard: a **LineChart** of completions-per-day (last 30 days) and a **BarChart**
   of tasks-by-priority (colored via `Cell`), plus a custom tooltip (`AnalyticsPage.tsx:30-42`).
   Data from `GET /api/admin/analytics`.
2. **`pages/GroupDetailPage.tsx`** (`BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
   ResponsiveContainer, AreaChart, Area, Cell`, lines 10-13). Renders per-member **BarChart** of
   group progress and an **AreaChart** commit timeline from the GitHub stats endpoint.
3. **`pages/EmployeeProfilePage.tsx`** (recharts import at lines ~11-15). Renders the employee
   performance profile — monthly-trend and priority-breakdown charts from
   `GET /api/employees/:id/stats`.

All three define a near-identical `CustomTooltip` component locally (duplicated code, e.g.
`AnalyticsPage.tsx:30` and `GroupDetailPage.tsx:23`).

---

## 7. GSAP usage (18 files)

GSAP + `@gsap/react`'s `useGSAP` are used pervasively for animation. Locations and what they
animate:

| File | What GSAP does |
|------|----------------|
| `components/CustomCursor.tsx` | The custom cursor follow animation (app-wide; `cursor:none` set globally in `index.css`). |
| `pages/LandingPage.tsx` | Scroll-driven landing animations via `ScrollTrigger` (the only `ScrollTrigger` user). |
| `pages/Footer.tsx` | Footer entrance animation. |
| `components/Dashboard/AdminDashboard.tsx` / `EmployeeDashboard.tsx` | Parallax wave transforms tied to `scrollTrigger` on `.employeeDashboard`. |
| `components/TaskList/TaskList.tsx` | Bubble/pulse timelines + task-count bubble intro. |
| `components/TaskList/{New,Accepted,Completed,Failed}Task.tsx` | Card entrance/hover animations. |
| `components/other/{AllTasks,CreateTask}.tsx` | List/form animations. |
| `pages/{ProfilePage,EmployeeProfilePage,LeaderboardPage,ProjectGroupsPage,GroupDetailPage,AnalyticsPage}.tsx` | Fade/stagger entrance animations (`gsap.from('.x-anim', {stagger})`). |

Observations:
- `CustomCursor` + the global `cursor: none` rule (`index.css:8`) mean **the native cursor is
  hidden site-wide** and replaced by a GSAP element. If GSAP fails to load or the element
  unmounts, the user could be left with no visible cursor.
- Animation selectors mix CSS-module class refs and plain global class strings (e.g.
  `.employeeDashboard`, `.popupBubble` in `TaskList.tsx:33-38`), coupling JS animation code to
  global class names.

---

## 8. `frontend-next/` (abandoned migration) — brief

- Next.js 16 App Router (`src/app/*/page.tsx`). Only Landing, Login, Signup, and the two
  dashboards are partially ported; `services/api.ts` there implements **only** auth/task/invitation
  APIs (no notifications, comments, groups, leaderboard, analytics) and uses `NEXT_PUBLIC_API_URL`.
- Contains a duplicate `TeamManagement.jsx` **and** `TeamManagement.tsx`.
- Not wired to Socket.io at all (no socket provider). This app cannot deliver the real-time or
  analytics features the root README advertises. It is not deployed (`vercel.json` lives in
  `frontend/`, not here).

## 9. `frontend-old/` — dead

- A single file: `src/components/Dashboard/EmployeeDashboard.tsx`, an older Tailwind-utility
  version of the employee dashboard (with emoji strings and `console.log('🔄 …')`). No entry
  point, no build config. Pure leftover; should be deleted.
