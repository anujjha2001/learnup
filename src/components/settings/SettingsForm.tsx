import React from "react";

export default function SettingsForm() {
  return (
    <div className="space-y-6 animate-fadeIn bg-white p-8 rounded-2xl border border-[#c7c4d8]/20 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold">Account Profiles & Settings</h2>
        <p className="text-sm text-[#464555]">Manage your personal system preferences, platform notifications, and profile details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#c7c4d8]/10">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-[#712ae2] tracking-wider">Profile Information</h3>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#464555]">Full Name</label>
            <input className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/40 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#3525cd]" type="text" defaultValue="Anuj Jha" />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#464555]">Email Address</label>
            <input className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/40 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#3525cd]" type="email" defaultValue="anuj.jha@example.com" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-[#712ae2] tracking-wider">Dashboard Configurations</h3>
          <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl">
            <div>
              <p className="text-sm font-bold">Email Notifications</p>
              <p className="text-xs text-[#464555]">Receive direct updates on scheduled modular tracking tests.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-[#3525cd] focus:ring-[#3525cd]" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button className="bg-[#3525cd] text-white py-2 px-6 rounded-xl font-bold text-sm hover:bg-[#4d44e3] transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}