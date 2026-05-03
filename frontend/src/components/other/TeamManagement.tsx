import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { invitationAPI } from "../../services/api";
import type { TeamMember, Employee, PendingInvitation } from "../../types";
import styles from "./TeamManagement.module.css";

const TeamManagement: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [teamRes, availableRes, pendingRes] = await Promise.all([
                invitationAPI.getTeamMembers(), invitationAPI.getAvailableEmployees(), invitationAPI.getPendingInvitations(),
            ]);
            setTeamMembers(teamRes.data.data); setAvailableEmployees(availableRes.data.data); setPendingInvitations(pendingRes.data.data);
        } catch (err) { console.error("Failed to fetch team data:", err); setError("Failed to load team data."); }
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) { setIsSearchFocused(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredEmployees = useMemo(() => {
        if (!searchQuery.trim()) return availableEmployees;
        const q = searchQuery.toLowerCase();
        return availableEmployees.filter((emp) => emp.first_name?.toLowerCase().includes(q) || emp.email?.toLowerCase().includes(q));
    }, [searchQuery, availableEmployees]);

    const handleSelectEmployee = (emp: Employee) => { setSelectedEmployee(emp); setSearchQuery(""); setIsSearchFocused(false); };
    const handleClearSelection = () => { setSelectedEmployee(null); setSearchQuery(""); };

    const handleSendInvitation = async () => {
        if (!selectedEmployee) return;
        setIsSending(true); setError(""); setSuccessMsg("");
        try {
            const res = await invitationAPI.sendInvitation(selectedEmployee.id);
            setSuccessMsg(res.data.message || "Invitation sent!"); setSelectedEmployee(null); setSearchQuery(""); await fetchData();
        } catch (err: unknown) {
            const e = err as { response?: { data?: { error?: string } } };
            setError(e.response?.data?.error || "Failed to send invitation");
        } finally { setIsSending(false); setTimeout(() => setSuccessMsg(""), 3000); setTimeout(() => setError(""), 5000); }
    };

    if (isLoading) {
        return (<div className={styles.loadingContainer}><div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading team data...</p></div></div>);
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Your Team</div>
            <div className={styles.content}>
                {error && (<div className={styles.errorMsg}>{error}</div>)}
                {successMsg && (<div className={styles.successMsg}>{successMsg}</div>)}
                <div className={styles.inviteBox}>
                    <div className={styles.inviteTitle}>Invite an Employee</div>
                    {availableEmployees.length === 0 ? (
                        <p className={styles.noEmployees}>No available employees to invite right now.</p>
                    ) : (
                        <div className={styles.inviteContent}>
                            {selectedEmployee && (
                                <div className={styles.selectedRow}>
                                    <div className={styles.selectedInfo}>
                                        <div className={styles.avatar}>
                                            {selectedEmployee.first_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.selectedDetails}>
                                            <span className={styles.selectedName}>{selectedEmployee.first_name}</span>
                                            <span className={styles.selectedEmail}>{selectedEmployee.email}</span>
                                        </div>
                                        <button onClick={handleClearSelection} className={styles.clearBtn} title="Clear selection">×</button>
                                    </div>
                                    <button onClick={handleSendInvitation} disabled={isSending} className={styles.sendBtn}>
                                        {isSending ? "Sending..." : "Send Invite"}
                                    </button>
                                </div>
                            )}
                            {!selectedEmployee && (
                                <div ref={searchContainerRef} className={styles.searchContainer}>
                                    <div className={styles.searchWrap}>
                                        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9c815a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)}
                                            placeholder="Search by name or email..." disabled={isSending}
                                            className={styles.searchInput} />
                                    </div>
                                    {isSearchFocused && searchQuery.trim().length > 0 && (
                                        <div className={styles.dropdown}
                                             style={{ scrollbarWidth: 'thin', scrollbarColor: '#ad9676 #cec0ad' }}>
                                            {filteredEmployees.length === 0 ? (
                                                <div className={styles.noResults}>No employees match your search</div>
                                            ) : (
                                                filteredEmployees.map((emp) => (
                                                    <button key={emp.id} onClick={() => handleSelectEmployee(emp)}
                                                        className={styles.dropdownItem}>
                                                        <div className={styles.avatar}>
                                                            {emp.first_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className={styles.selectedDetails}>
                                                            <span className={styles.dropdownName}>{emp.first_name}</span>
                                                            <span className={styles.dropdownEmail}>{emp.email}</span>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {pendingInvitations.length > 0 && (
                    <div className={styles.pendingSection}>
                        <div className={styles.sectionTitle}>Pending Invitations</div>
                        <div className={styles.pendingList}>
                            {pendingInvitations.map((inv) => (
                                <div key={inv.id} className={styles.pendingCard}>
                                    <div className={styles.pendingInfo}>
                                        <span className={styles.pendingName}>{inv.first_name}</span>
                                        <span className={styles.pendingEmail}>{inv.email}</span>
                                    </div>
                                    <span className={styles.pendingBadge}>⏳ Pending</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className={styles.teamSection}>
                    <div className={styles.sectionTitle}>Team Members ({teamMembers.length})</div>
                    {teamMembers.length === 0 ? (
                        <div className={styles.emptyTeam}>
                            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emptyTeamIcon}>
                                <circle cx="60" cy="60" r="56" stroke="#ad9676" strokeWidth="2.5" strokeDasharray="8 6" opacity="0.5" />
                                <circle cx="60" cy="44" r="14" fill="#ad9676" opacity="0.7" />
                                <path d="M36 82c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="#ad9676" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
                                <circle cx="32" cy="54" r="8" fill="#9c815a" opacity="0.4" />
                                <path d="M20 72c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#9c815a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
                                <circle cx="88" cy="54" r="8" fill="#9c815a" opacity="0.4" />
                                <path d="M76 72c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#9c815a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
                                <line x1="60" y1="90" x2="60" y2="106" stroke="#8b6c3e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                                <line x1="52" y1="98" x2="68" y2="98" stroke="#8b6c3e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                            </svg>
                            <p className={styles.emptyTeamText}>No team members yet. Send invitations to employees to build your team!</p>
                        </div>
                    ) : (
                        <div className={styles.memberList}>
                            {teamMembers.map((member) => (
                                <div key={member.id} className={styles.memberCard}>
                                    <div className={styles.memberInfo}>
                                        <span className={styles.memberName}>{member.first_name}</span>
                                        <span className={styles.memberEmail}>{member.email}</span>
                                    </div>
                                    <span className={styles.activeBadge}>✓ Active</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
