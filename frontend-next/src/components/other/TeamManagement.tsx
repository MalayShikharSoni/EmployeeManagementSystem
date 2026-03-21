'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { invitationAPI } from "@/services/api";

interface Employee {
  id: number;
  first_name: string;
  email: string;
}

interface TeamMember {
  id: number;
  first_name: string;
  email: string;
}

interface PendingInvitation {
  id: number;
  first_name: string;
  email: string;
}

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
        invitationAPI.getTeamMembers(),
        invitationAPI.getAvailableEmployees(),
        invitationAPI.getPendingInvitations(),
      ]);
      setTeamMembers(teamRes.data.data);
      setAvailableEmployees(availableRes.data.data);
      setPendingInvitations(pendingRes.data.data);
    } catch {
      setError("Failed to load team data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return availableEmployees;
    const q = searchQuery.toLowerCase();
    return availableEmployees.filter(
      (emp) => emp.first_name?.toLowerCase().includes(q) || emp.email?.toLowerCase().includes(q)
    );
  }, [searchQuery, availableEmployees]);

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleClearSelection = () => { setSelectedEmployee(null); setSearchQuery(""); };

  const handleSendInvitation = async () => {
    if (!selectedEmployee) return;
    setIsSending(true); setError(""); setSuccessMsg("");
    try {
      const res = await invitationAPI.sendInvitation(selectedEmployee.id);
      setSuccessMsg(res.data.message || "Invitation sent!");
      setSelectedEmployee(null); setSearchQuery("");
      await fetchData();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to send invitation");
    } finally {
      setIsSending(false);
      setTimeout(() => setSuccessMsg(""), 3000);
      setTimeout(() => setError(""), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[20vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#ad9676] mb-4"></div>
          <p className="text-lg font-semibold text-[#9c815a]">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#cec0ad] pt-[24vh]">
      <div className="bg-transparent text-[#9c815a] mb-[6vh] text-7xl font-black ml-[3vw] max-sm:text-[40px]">Your Team</div>
      <div className="ml-[3vw] mr-[3vw] flex flex-col gap-6 bg-transparent max-sm:ml-[4vw] max-sm:mr-[4vw]">
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] text-center font-bold">{error}</div>}
        {successMsg && <div className="p-3 bg-green-100 border border-green-500 text-green-700 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] text-center font-bold">{successMsg}</div>}

        <div className="bg-[#ad9676] rounded-se-[20px] rounded-es-[20px] rounded-ee-[20px] p-6 max-sm:p-4">
          <div className="text-[#cec0ad] font-black text-2xl mb-4 bg-transparent max-sm:text-xl">Invite an Employee</div>
          {availableEmployees.length === 0 ? (
            <p className="text-[#cec0ad] font-bold bg-transparent opacity-80">No available employees to invite right now.</p>
          ) : (
            <div className="flex flex-col gap-3 bg-transparent">
              {selectedEmployee && (
                <div className="flex flex-row items-center gap-3 bg-transparent max-sm:flex-col max-sm:items-stretch">
                  <div className="flex-1 flex items-center gap-3 bg-[#cec0ad] px-4 py-3 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px]">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ad9676] text-[#cec0ad] font-black text-sm flex-shrink-0" style={{ minWidth: '2.25rem' }}>
                      {selectedEmployee.first_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col bg-transparent min-w-0">
                      <span className="text-[#8b6c3e] font-black text-base bg-transparent truncate">{selectedEmployee.first_name}</span>
                      <span className="text-[#9c815a] font-semibold text-sm bg-transparent truncate">{selectedEmployee.email}</span>
                    </div>
                    <button onClick={handleClearSelection} className="ml-auto text-[#9c815a] hover:text-[#8b6c3e] font-black text-xl bg-transparent transition-colors flex-shrink-0" title="Clear selection">×</button>
                  </div>
                  <button onClick={handleSendInvitation} disabled={isSending} className="bg-[#8b6c3e] text-[#cec0ad] font-bold text-lg px-6 py-3 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] hover:bg-[#7a5622] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSending ? "Sending..." : "Send Invite"}
                  </button>
                </div>
              )}
              {!selectedEmployee && (
                <div ref={searchContainerRef} className="relative bg-transparent">
                  <div className="relative bg-transparent">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9c815a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)}
                      placeholder="Search by name or email..." disabled={isSending}
                      className="w-full bg-[#cec0ad] pl-11 pr-4 py-3 rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] text-[#8b6c3e] font-bold text-lg outline-none placeholder:text-[#b3a28b] placeholder:font-semibold disabled:opacity-50" />
                  </div>
                  {isSearchFocused && searchQuery.trim().length > 0 && (
                    <div className="absolute z-10 left-0 right-0 mt-2 max-h-[240px] overflow-y-auto bg-[#cec0ad] rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] shadow-lg border-2 border-[#c4b49c]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ad9676 #cec0ad' }}>
                      {filteredEmployees.length === 0 ? (
                        <div className="px-4 py-4 text-center text-[#9c815a] font-semibold bg-transparent">No employees match your search</div>
                      ) : (
                        filteredEmployees.map((emp) => (
                          <button key={emp.id} onClick={() => handleSelectEmployee(emp)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#c4b49c] transition-colors first:rounded-se-[13px] last:rounded-es-[13px] last:rounded-ee-[13px] bg-transparent">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ad9676] text-[#cec0ad] font-black text-sm flex-shrink-0" style={{ minWidth: '2.25rem' }}>
                              {emp.first_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col bg-transparent min-w-0">
                              <span className="text-[#8b6c3e] font-black text-base bg-transparent truncate">{emp.first_name}</span>
                              <span className="text-[#9c815a] font-semibold text-sm bg-transparent truncate">{emp.email}</span>
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
          <div className="bg-transparent">
            <div className="text-[#9c815a] font-black text-2xl mb-3 bg-transparent max-sm:text-xl">Pending Invitations</div>
            <div className="flex flex-col gap-2 bg-transparent">
              {pendingInvitations.map((inv) => (
                <div key={inv.id} className="bg-[#ad9676] bg-opacity-60 border-[3px] border-[#ad9676] rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] p-4 flex flex-row items-center justify-between max-sm:flex-col max-sm:gap-2">
                  <div className="bg-transparent">
                    <span className="text-[#8b6c3e] font-black text-lg bg-transparent">{inv.first_name}</span>
                    <span className="text-[#9c815a] font-bold text-sm ml-2 bg-transparent max-sm:block max-sm:ml-0">{inv.email}</span>
                  </div>
                  <span className="bg-[#cec0ad] text-[#9c815a] font-bold text-sm px-4 py-1 rounded-full">⏳ Pending</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-transparent mb-[8vh]">
          <div className="text-[#9c815a] font-black text-2xl mb-3 bg-transparent max-sm:text-xl">Team Members ({teamMembers.length})</div>
          {teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-transparent">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5">
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
              <p className="text-[#9c815a] font-bold text-lg bg-transparent text-center max-w-[340px]">No team members yet. Send invitations to employees to build your team!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 bg-transparent">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-[#ad9676] rounded-se-[15px] rounded-es-[15px] rounded-ee-[15px] p-4 flex flex-row items-center justify-between max-sm:flex-col max-sm:gap-2">
                  <div className="bg-transparent">
                    <span className="text-[#cec0ad] font-black text-lg bg-transparent">{member.first_name}</span>
                    <span className="text-[#cec0ad] font-bold text-sm ml-2 opacity-80 bg-transparent max-sm:block max-sm:ml-0">{member.email}</span>
                  </div>
                  <span className="bg-[#cec0ad] text-[#8b6c3e] font-bold text-sm px-4 py-1 rounded-full">✓ Active</span>
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
