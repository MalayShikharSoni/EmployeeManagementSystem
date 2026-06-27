import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { groupAPI, invitationAPI } from '../services/api';
import type { ProjectGroup, TeamMember } from '../types';
import HeaderUser from './HeaderUser';
import AvatarUpload from '../components/AvatarUpload/AvatarUpload';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './ProjectGroupsPage.module.css';

const ProjectGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [groups, setGroups] = useState<ProjectGroup[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [groupsRes, teamRes] = await Promise.all([
        groupAPI.getGroups(),
        invitationAPI.getTeamMembers(),
      ]);
      setGroups(groupsRes.data.data);
      setTeamMembers(teamRes.data.data);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formName.trim() || selectedMembers.length === 0) return;
    try {
      setIsCreating(true);
      await groupAPI.createGroup({
        name: formName.trim(),
        description: formDesc.trim() || undefined,
        memberIds: selectedMembers,
        githubRepoUrl: formGithub.trim() || undefined,
      });
      setFormName('');
      setFormDesc('');
      setFormGithub('');
      setSelectedMembers([]);
      setShowCreate(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to create group:', err);
      alert('Failed to create group.');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  useGSAP(() => {
    if (!isLoading && containerRef.current) {
      gsap.to(containerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.group-card-anim', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)', delay: 0.3 });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div><div className={styles.spinner}></div><div className={styles.loadingText}>Loading Groups...</div></div>
      </div>
    );
  }

  const isAdmin = userData?.role === 'admin';

  return (
    <>
      <HeaderUser data={userData ? { ...userData, data: { ...userData.data, first_name: userData.data.firstName || userData.data.first_name } } as any : null} />

      <div className={styles.container} ref={containerRef}>
        <div className={styles.header}>
          <h1 className={styles.title}>Project Groups</h1>
          {isAdmin && (
            <button className={styles.toggleBtn} onClick={() => setShowCreate(!showCreate)}>
              {showCreate ? 'Cancel' : '+ Create Group'}
            </button>
          )}
        </div>

        {/* Create Form */}
        {showCreate && isAdmin && (
          <div className={styles.createSection}>
            <h3 className={styles.sectionTitle}>New Project Group</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Group Name</label>
                <input className={styles.formInput} value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Q3 Marketing Campaign" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>GitHub Repo URL (optional)</label>
                <input className={styles.formInput} value={formGithub} onChange={e => setFormGithub(e.target.value)} placeholder="https://github.com/owner/repo" />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Description</label>
                <textarea className={styles.formTextarea} value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What is this project about?" />
              </div>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Select Members ({selectedMembers.length} selected)</label>
                <div className={styles.memberSelector}>
                  {teamMembers.map(member => (
                    <div
                      key={member.id}
                      className={`${styles.memberChip} ${selectedMembers.includes(member.id) ? styles.selected : ''}`}
                      onClick={() => toggleMember(member.id)}
                    >
                      <AvatarUpload currentAvatarUrl={member.avatar_url} name={member.first_name || ''} size={28} readOnly />
                      <div>
                        <div className={styles.memberChipName}>{member.first_name}</div>
                        <div className={styles.memberChipEmail}>{member.email}</div>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <div style={{ color: '#8b6c3e', fontWeight: 700 }}>No team members available. Invite employees first.</div>
                  )}
                </div>
              </div>
            </div>
            <button className={styles.createBtn} onClick={handleCreate} disabled={isCreating || !formName.trim() || selectedMembers.length === 0}>
              {isCreating ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        )}

        {/* Groups Grid */}
        <div className={styles.groupsGrid}>
          {groups.length === 0 ? (
            <div className={styles.emptyText}>
              {isAdmin ? 'No project groups yet. Create one to get started!' : 'You are not part of any project groups yet.'}
            </div>
          ) : (
            groups.map(group => {
              const progress = group.task_count && group.task_count > 0
                ? Math.round(((group.completed_task_count || 0) / group.task_count) * 100)
                : 0;
              return (
                <div
                  key={group.id}
                  className={`group-card-anim ${styles.groupCard}`}
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  <div className={styles.groupName}>{group.name}</div>
                  {group.description && <div className={styles.groupDesc}>{group.description}</div>}
                  <div className={styles.groupMeta}>
                    <span className={`${styles.statusBadge} ${styles[group.status]}`}>{group.status}</span>
                    <span className={styles.metaItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {group.member_count || 0} Members
                    </span>
                    <span className={styles.metaItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      {group.completed_task_count || 0}/{group.task_count || 0} Tasks
                    </span>
                    {group.github_repo_url && (
                      <span className={styles.githubBadge}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        Linked
                      </span>
                    )}
                  </div>
                  {(group.task_count || 0) > 0 && (
                    <>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                      </div>
                      <div className={styles.progressLabel}>{progress}% Complete</div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectGroupsPage;
