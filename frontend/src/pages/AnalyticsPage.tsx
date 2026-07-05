import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { adminAPI } from '../services/api';
import type { AdminAnalytics } from '../types';
import HeaderUser from './HeaderUser';
import AvatarUpload from '../components/AvatarUpload/AvatarUpload';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import styles from './AnalyticsPage.module.css';

const statusColors: Record<string, string> = {
  new: '#8b6c3e',
  active: '#f4a261',
  completed: '#2a9d8f',
  failed: '#d62828',
};

const priorityColors: Record<string, string> = {
  low: '#8b6c3e',
  medium: '#f4a261',
  high: '#e07b39',
  urgent: '#d62828',
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

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useGSAP(() => {
    if (!isLoading && containerRef.current) {
      gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.analytics-anim', { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)', delay: 0.2 });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div><div className={styles.spinner}></div><div className={styles.loadingText}>Loading Analytics...</div></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Failed to load analytics.</div>
      </div>
    );
  }

  // Format chart dates to short form
  const chartData = analytics.completionsPerDay.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Completed: d.count,
  }));

  // Max tasks for scaling employee bars
  const maxEmployeeTasks = Math.max(...analytics.perEmployeeStats.map(e => e.total_tasks), 1);

  // Max status count for status bars
  const statusEntries = Object.entries(analytics.tasksByStatus);
  const maxStatusCount = Math.max(...statusEntries.map(([, count]) => count), 1);

  return (
    <>
      <HeaderUser data={userData ? { ...userData, data: { ...userData.data, first_name: userData.data.firstName || userData.data.first_name } } as any : null} />

      <div className={styles.container} ref={containerRef}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/admin-dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to Dashboard
          </button>
          <h1 className={styles.title}>Team Analytics</h1>
        </div>

        {/* Stat Cards */}
        <div className={styles.statCards}>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Total Tasks</div>
            <div className={styles.statValue}>{analytics.totalTasks}</div>
          </div>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Completion Rate</div>
            <div className={styles.statValue}>{analytics.completionRate}<span className={styles.statSuffix}>%</span></div>
          </div>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Overdue</div>
            <div className={styles.statValue} style={{ color: analytics.overdueCount > 0 ? '#d62828' : '#3b3123' }}>{analytics.overdueCount}</div>
          </div>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Avg Completion</div>
            <div className={styles.statValue}>{analytics.avgCompletionDays}<span className={styles.statSuffix}>days</span></div>
          </div>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Team Members</div>
            <div className={styles.statValue}>{analytics.totalTeamMembers}</div>
          </div>
          <div className={`analytics-anim ${styles.statCard}`}>
            <div className={styles.statLabel}>Assigned This Month</div>
            <div className={styles.statValue}>{analytics.tasksAssignedThisMonth}</div>
          </div>
        </div>

        {/* MVP of the Month */}
        {analytics.mostActiveEmployee && (
          <div className={`analytics-anim ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Most Active This Month</h3>
            <div className={styles.mvpCard} onClick={() => navigate(`/employees/${analytics.mostActiveEmployee!.id}`)} style={{ cursor: 'pointer' }}>
              <AvatarUpload currentAvatarUrl={analytics.mostActiveEmployee.avatar_url} name={analytics.mostActiveEmployee.first_name || ''} size={60} readOnly />
              <div className={styles.mvpInfo}>
                <span className={styles.mvpName}>{analytics.mostActiveEmployee.first_name}</span>
                <span className={styles.mvpEmail}>{analytics.mostActiveEmployee.email}</span>
                <span className={styles.mvpStat}>{analytics.mostActiveEmployee.completed_count} tasks completed</span>
              </div>
            </div>
          </div>
        )}

        {/* Completions Line Chart */}
        <div className={`analytics-anim ${styles.section}`}>
          <h3 className={styles.sectionTitle}>Task Completions (Last 30 Days)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b6c3e" />
                    <stop offset="100%" stopColor="#f4a261" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 10, fontWeight: 600 }} interval={3} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Completed" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: '#8b6c3e', stroke: '#fff', strokeWidth: 2, r: 4 }} activeDot={{ r: 7, fill: '#3b3123', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two-column: Status breakdown + Priority breakdown */}
        <div className={styles.twoCol}>
          <div className={`analytics-anim ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Tasks by Status</h3>
            <div className={styles.statusGrid}>
              {statusEntries.map(([status, count]) => (
                <div key={status} className={styles.statusRow}>
                  <span className={styles.statusLabel}>{status === 'new_tasks' ? 'new' : status}</span>
                  <div className={styles.statusBarTrack}>
                    <div className={styles.statusBarFill} style={{ width: `${(count / maxStatusCount) * 100}%`, backgroundColor: statusColors[status] || '#ad9676' }} />
                  </div>
                  <span className={styles.statusCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`analytics-anim ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Tasks by Priority</h3>
            {analytics.tasksByPriority.length > 0 ? (
              <div className={styles.chartWrapper} style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.tasksByPriority} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="priority" axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ad9676', fontSize: 12, fontWeight: 700 }} allowDecimals={false} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]} barSize={40}>
                      {analytics.tasksByPriority.map((entry, index) => (
                        <Cell key={`pri-${index}`} fill={priorityColors[entry.priority] || '#ad9676'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={styles.noData}>No task data yet.</div>
            )}
          </div>
        </div>

        {/* Per-Employee Completions */}
        <div className={`analytics-anim ${styles.section}`}>
          <h3 className={styles.sectionTitle}>Per-Employee Task Completions This Month</h3>
          {analytics.perEmployeeStats.length > 0 ? (
            analytics.perEmployeeStats.map((emp, idx) => (
              <div key={idx} className={styles.employeeRow}>
                <span className={styles.employeeName}>{emp.first_name}</span>
                <div className={styles.employeeBarTrack}>
                  <div
                    className={styles.employeeBarFill}
                    style={{
                      width: `${(emp.total_tasks / maxEmployeeTasks) * 100}%`,
                      background: `linear-gradient(90deg, #8b6c3e, #f4a261)`,
                    }}
                  >
                    {emp.completed}/{emp.total_tasks}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>No employee data this month.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
