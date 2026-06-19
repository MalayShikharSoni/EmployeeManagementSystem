import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { leaderboardAPI } from '../services/api';
import type { LeaderboardEntry, EomRecord } from '../types';
import HeaderUser from './HeaderUser';
import AvatarUpload from '../components/AvatarUpload/AvatarUpload';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './LeaderboardPage.module.css';

const ScoreTooltip = ({ entry }: { entry: LeaderboardEntry }) => (
  <div className={styles.scoreTooltip}>
    <div className={styles.tooltipRow}>
      <span>Tasks Completed:</span>
      <span>{entry.tasks_completed_this_month} × 10 = {entry.tasks_completed_this_month * 10}</span>
    </div>
    <div className={styles.tooltipRow}>
      <span>On-Time:</span>
      <span>{entry.on_time_completions} × 15 = {entry.on_time_completions * 15}</span>
    </div>
    <div className={styles.tooltipRow}>
      <span>High Priority:</span>
      <span>{entry.high_priority_completions} × 20 = {entry.high_priority_completions * 20}</span>
    </div>
    <div className={styles.tooltipRow}>
      <span>Urgent Priority:</span>
      <span>{entry.urgent_priority_completions} × 30 = {entry.urgent_priority_completions * 30}</span>
    </div>
    <div className={styles.tooltipRow}>
      <span>Overdue Penalty:</span>
      <span style={{ color: '#d62828' }}>{entry.overdue_tasks} × -10 = {entry.overdue_tasks * -10}</span>
    </div>
    <div className={`${styles.tooltipRow} ${styles.total}`}>
      <span>Total Score:</span>
      <span>{entry.score} pts</span>
    </div>
  </div>
);

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<EomRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCrowning, setIsCrowning] = useState(false);
  const [error, setError] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');
      if (activeTab === 'current') {
        const res = await leaderboardAPI.getLiveLeaderboard();
        setLeaderboard(res.data.data);
      } else {
        const res = await leaderboardAPI.getHistory();
        setHistory(res.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch leaderboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrownWinner = async () => {
    if (leaderboard.length === 0) return;
    const winner = leaderboard[0];
    
    if (!window.confirm(`Are you sure you want to crown ${winner.first_name} as the Employee of the Month? This will save their current score to history.`)) {
      return;
    }

    try {
      setIsCrowning(true);
      await leaderboardAPI.archiveWinner(winner.employee_id, winner);
      alert('Winner successfully crowned!');
      setActiveTab('history');
    } catch (err: any) {
      alert('Failed to crown winner.');
      console.error(err);
    } finally {
      setIsCrowning(false);
    }
  };

  useGSAP(() => {
    if (!isLoading && containerRef.current) {
      gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      
      if (activeTab === 'current') {
        gsap.from('.podium-anim', { y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)', delay: 0.2 });
        gsap.from('.rank-row-anim', { x: -50, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.6 });
      } else {
        gsap.from('.history-card-anim', { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' });
      }
    }
  }, [isLoading, activeTab]);

  if (isLoading && leaderboard.length === 0 && history.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div><div className={styles.spinner}></div><div className={styles.loadingText}>Loading Leaderboard...</div></div>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Rearrange top 3 for podium: 2nd, 1st, 3rd
  const podiumSpots = [];
  if (top3[1]) podiumSpots.push({ ...top3[1], rank: 2, place: 'second' });
  if (top3[0]) podiumSpots.push({ ...top3[0], rank: 1, place: 'first' });
  if (top3[2]) podiumSpots.push({ ...top3[2], rank: 3, place: 'third' });

  return (
    <>
      <HeaderUser data={userData ? { ...userData, data: { ...userData.data, first_name: userData.data.firstName || userData.data.first_name } } as any : null} />
      
      <div className={styles.container} ref={containerRef}>
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          {activeTab === 'current' && leaderboard.length > 0 && (
            <button className={styles.crownBtn} onClick={handleCrownWinner} disabled={isCrowning}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Crown Winner
            </button>
          )}
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === 'current' ? styles.active : ''}`} onClick={() => setActiveTab('current')}>Current Month Live</button>
          <button className={`${styles.tabBtn} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}>EOM History</button>
        </div>

        {error && <div className={styles.errorText} style={{ marginBottom: '2rem' }}>{error}</div>}

        {activeTab === 'current' ? (
          <>
            {leaderboard.length === 0 ? (
              <div className={styles.rankingsSection} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h3 className={styles.sectionTitle}>No Data Available</h3>
                <p>There are no team members or completed tasks to rank yet.</p>
              </div>
            ) : (
              <>
                {/* Podium */}
                <div className={styles.podiumSection}>
                  {podiumSpots.map(spot => (
                    <div key={spot.employee_id} className={`podium-anim ${styles.podiumSpot}`}>
                      <div className={styles.podiumAvatar} onClick={() => navigate(`/employees/${spot.employee_id}`)}>
                        <AvatarUpload currentAvatarUrl={spot.avatar_url} name={spot.first_name || ''} size={spot.rank === 1 ? 120 : 90} readOnly />
                        <div className={`${styles.podiumRank} ${styles[`rank${spot.rank}`]}`}>{spot.rank}</div>
                      </div>
                      <div className={`${styles.podiumBase} ${styles[spot.place]}`}>
                        <ScoreTooltip entry={spot} />
                        <div className={styles.podiumName}>{spot.first_name}</div>
                        <div className={styles.podiumScore}>{spot.score}</div>
                        <div className={styles.podiumLabel}>Points</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rankings List */}
                {rest.length > 0 && (
                  <div className={styles.rankingsSection}>
                    <h3 className={styles.sectionTitle}>Rankings</h3>
                    <div className={styles.rankingsList}>
                      {rest.map((entry, idx) => (
                        <div key={entry.employee_id} className={`rank-row-anim ${styles.rankRow}`} onClick={() => navigate(`/employees/${entry.employee_id}`)}>
                          <ScoreTooltip entry={entry} />
                          <div className={styles.rowRank}>#{idx + 4}</div>
                          <div className={styles.rowAvatar}>
                            <AvatarUpload currentAvatarUrl={entry.avatar_url} name={entry.first_name || ''} size={50} readOnly />
                          </div>
                          <div className={styles.rowInfo}>
                            <div className={styles.rowName}>{entry.first_name}</div>
                            <div className={styles.rowStats}>{entry.completion_rate}% Completion Rate • {entry.tasks_completed_this_month} Tasks</div>
                          </div>
                          <div className={styles.rowScoreWrap}>
                            <div className={styles.rowScore}>{entry.score}</div>
                            <div className={styles.rowLabel}>Points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className={styles.historyGrid}>
            {history.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#8b6c3e', fontWeight: 800, fontSize: '1.2rem' }}>
                No past winners have been crowned yet.
              </div>
            ) : (
              history.map(record => (
                <div key={record.id} className={`history-card-anim ${styles.historyCard}`} onClick={() => navigate(`/employees/${record.employee_id}`)}>
                  <AvatarUpload currentAvatarUrl={record.avatar_url} name={record.first_name || ''} size={60} readOnly />
                  <div>
                    <div className={styles.historyMonth}>{new Date(record.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    <div className={styles.historyName}>{record.first_name}</div>
                    <div className={styles.historyScore}>{record.score} Points</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default LeaderboardPage;
