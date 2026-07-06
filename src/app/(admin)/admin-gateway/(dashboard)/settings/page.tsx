"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  History, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  User, 
  ShieldCheck,
  RefreshCw
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminSettingsPage() {
  const [savingShare, setSavingShare] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shareInput, setShareInput] = useState<number | "">(20);

  // SWR for settings
  const { data: settingsData, mutate: mutateSettings } = useSWR("/api/admin/settings", fetcher, {
    onSuccess: (data) => {
      if (data && typeof data.revenueShare === "number" && shareInput === 20) {
        setShareInput(data.revenueShare);
      }
    }
  });

  // SWR for transactions telemetry, polling every 3 seconds for real-time vibe
  const { data: telemetryData, mutate: mutateTelemetry, isValidating } = useSWR("/api/admin/transactions", fetcher, {
    refreshInterval: 3000,
  });

  const revenueShare = settingsData?.revenueShare ?? 20;
  const transactions = telemetryData?.transactions ?? [];
  const metrics = telemetryData?.metrics ?? {
    totalRevenue: 0,
    adminEarnings: 0,
    instructorEarnings: 0,
    count: 0
  };

  const handleSaveShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shareInput === "" || isNaN(Number(shareInput))) {
      setErrorMsg("Please enter a valid percentage.");
      return;
    }
    const val = Number(shareInput);
    if (val < 0 || val > 100) {
      setErrorMsg("Revenue share must be between 0% and 100%.");
      return;
    }

    setSavingShare(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revenueShare: val }),
      });
      if (res.ok) {
        const data = await res.json();
        mutateSettings({ revenueShare: data.revenueShare }, false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to save settings.");
      }
    } catch (err) {
      setErrorMsg("Connection failure while updating settings.");
    } finally {
      setSavingShare(false);
    }
  };

  const handleSimulateSale = async () => {
    setSimulating(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
      });
      if (res.ok) {
        // Trigger mutate to update both telemetry metrics and transaction list instantly
        await mutateTelemetry();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to simulate transaction.");
      }
    } catch (err) {
      setErrorMsg("Connection error during sale simulation.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="lu-page-header">
        <div className="lu-page-header-eyebrow">
          <span className="material-symbols-outlined select-none text-base">settings</span>
          Global Configurations
        </div>
        <h1 className="lu-heading">Admin Settings &amp; Payouts</h1>
        <p className="lu-caption mt-1">
          Configure platform fee rates, manage split ledgers, and track financial telemetry in real-time.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: Settings Form & Simulator */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section: Revenue Split Config */}
          <div className="lu-card-static p-6 space-y-6">
            <div className="flex items-center gap-3 text-purple-400">
              <Percent className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-100">Revenue Allocation</h3>
            </div>

            <p className="lu-caption leading-relaxed">
              Define the percentage of course revenue allocated directly to the platform administration.
              The remaining share is credited to the course instructor automatically upon enrollment.
            </p>

            <form onSubmit={handleSaveShare} className="space-y-4">
              <div>
                <label className="lu-label block mb-2">Admin Share Percentage (%)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={shareInput}
                    onChange={(e) => setShareInput(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="lu-input flex-1 font-extrabold"
                    placeholder="20"
                  />
                  <span className="text-slate-300 font-extrabold text-sm">%</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={shareInput === "" ? 20 : shareInput}
                onChange={(e) => setShareInput(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>0% (All to Instructor)</span>
                <span>100% (All to Admin)</span>
              </div>

              {errorMsg && (
                <div className="lu-badge lu-badge-danger w-full justify-start gap-2 text-xs font-semibold bg-red-500/8 p-3 rounded-xl border border-red-500/12">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="lu-badge lu-badge-success w-full justify-start gap-2 text-xs font-semibold bg-emerald-500/8 p-3 rounded-xl border border-emerald-500/12">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Settings updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingShare}
                className="lu-btn lu-btn-primary w-full uppercase tracking-wider"
              >
                {savingShare ? "Saving..." : "Apply Configurations"}
              </button>
            </form>
          </div>

          {/* Section: Sandbox Sales Simulator */}
          <div className="lu-card-static p-6 space-y-5">
            <div className="flex items-center gap-3 text-teal-400">
              <Play className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-100">Telemetry Sandbox</h3>
            </div>

            <p className="lu-caption leading-relaxed">
              Trigger a simulated paid course purchase transaction inside the sandbox database.
              Use this to instantly evaluate real-time telemetry pipelines and revenue split calculations.
            </p>

            <button
              onClick={handleSimulateSale}
              disabled={simulating}
              className="lu-btn lu-btn-ghost w-full"
            >
              <RefreshCw className={`w-4 h-4 text-teal-400 ${simulating ? "animate-spin" : ""}`} />
              <span>{simulating ? "Simulating Sale..." : "Simulate Random Sale"}</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Live Global Telemetry & Ledger */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Volume", value: `INR ${metrics.totalRevenue.toLocaleString()}`, sub: "Gross Telemetry", icon: DollarSign, iconCls: "text-purple-400", accent: "purple" },
              { label: `Admin Share (${revenueShare}%)`, value: `INR ${metrics.adminEarnings.toLocaleString()}`, sub: "Platform Earnings", icon: ShieldCheck, iconCls: "text-teal-400", accent: "teal" },
              { label: "Educator Settlements", value: `INR ${metrics.instructorEarnings.toLocaleString()}`, sub: "Instructor Share", icon: User, iconCls: "text-indigo-400", accent: "indigo" },
              { label: "Total Settlements", value: `${metrics.count} Txns`, sub: "Completed sales", icon: BookOpen, iconCls: "text-emerald-400", accent: "emerald" },
            ].map(({ label, value, sub, icon: Icon, iconCls }) => (
              <div key={label} className="lu-card-static p-5 relative overflow-hidden">
                <div className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-white/4 flex items-center justify-center border border-white/6">
                  <Icon className={`w-4 h-4 ${iconCls}`} />
                </div>
                <p className="lu-stat-label">{label}</p>
                <p className="lu-stat-value mt-2 text-xl">{value}</p>
                <p className={`text-[10px] font-bold mt-1.5 ${iconCls} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" /> {sub}
                </p>
              </div>
            ))}
          </div>

          {/* Ledger History List */}
          <div className="lu-card-static p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-purple-400">
                <History className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-100">Global Sales Split Ledger</h3>
              </div>
              {isValidating && (
                <span className="lu-badge lu-badge-teal animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Syncing
                </span>
              )}
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border border-dashed border-white/8 rounded-2xl">
                <DollarSign className="w-12 h-12 text-slate-600" />
                <div>
                  <h4 className="text-slate-200 font-bold">Ledger is Empty</h4>
                  <p className="lu-caption mt-1">No course purchase transactions have been recorded yet.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/6 bg-black/40">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/8 bg-white/4">
                      <th className="lu-table-head p-4">Transaction / Date</th>
                      <th className="lu-table-head p-4">Course</th>
                      <th className="lu-table-head p-4">Student</th>
                      <th className="lu-table-head p-4">Instructor</th>
                      <th className="lu-table-head p-4 text-right">Price</th>
                      <th className="lu-table-head p-4 text-right">Admin Split</th>
                      <th className="lu-table-head p-4 text-right text-teal-300">Inst. Split</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((txn: any) => (
                      <tr key={txn.id} className="lu-table-row">
                        <td className="p-4">
                          <span className="font-mono text-purple-300 font-semibold block">{txn.id.substring(0, 8)}...</span>
                          <span className="lu-caption block mt-0.5">{new Date(txn.createdAt).toLocaleString()}</span>
                        </td>
                        <td className="lu-table-cell p-4 font-semibold">
                          {txn.course?.title || "Unknown Course"}
                        </td>
                        <td className="p-4">
                          <span className="lu-table-cell block font-semibold">{txn.student?.name}</span>
                          <span className="lu-caption">{txn.student?.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="lu-table-cell block font-semibold">{txn.instructor?.name}</span>
                          <span className="lu-caption">{txn.instructor?.email}</span>
                        </td>
                        <td className="p-4 text-right font-bold text-slate-100">INR {txn.amount.toFixed(2)}</td>
                        <td className="p-4 text-right font-semibold text-slate-300">INR {txn.adminShare.toFixed(2)}</td>
                        <td className="p-4 text-right font-bold text-teal-300 bg-teal-500/5">INR {txn.instShare.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
