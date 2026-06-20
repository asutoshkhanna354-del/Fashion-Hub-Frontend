"use client";

import { useState, useEffect } from "react";

export default function MaintenanceOverlay({
  children,
  isMaintenance,
  logoUrl,
}: {
  children: React.ReactNode;
  isMaintenance: boolean;
  logoUrl: string;
}) {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      let isMaint = isMaintenance;
      try {
        const API_URL = "https://fashion-hub-backend-13eb.onrender.com";
        const res = await fetch(`${API_URL}/api/settings/public`);
        if (res.ok) {
          const data = await res.json();
          isMaint = data.settings?.maintenance_mode === "true";
        }
      } catch (e: any) {}

      const bypassed = localStorage.getItem("devBypass") === "true";
      setIsBypassed(bypassed);

      if (isMaint && !bypassed) {
        setShowMaintenance(true);
      } else {
        setShowMaintenance(false);
      }
    };

    checkStatus();
  }, [isMaintenance]);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime > 1000) {
      setClicks(1);
    } else {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      if (newClicks >= 3) {
        localStorage.setItem("devBypass", "true");
        setIsBypassed(true);
        setShowMaintenance(false);
      }
    }
    setLastClickTime(now);
  };

  const clearBypass = () => {
    localStorage.removeItem("devBypass");
    setIsBypassed(false);
    window.location.reload();
  };

  if (!showMaintenance) {
    return (
      <>
        {children}
        {isBypassed && (
          <div className="fixed bottom-4 left-4 z-[99999] bg-[#111111] text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold flex items-center gap-2 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Maintenance Bypassed
            <button onClick={clearBypass} className="ml-2 hover:text-amber-400 underline opacity-70 hover:opacity-100">Restore</button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <img 
          src={logoUrl || "/favicon.ico"} 
          alt="Store Logo" 
          className="w-20 h-20 object-contain mb-8 cursor-pointer grayscale opacity-80"
          onClick={handleLogoClick}
        />
        <h1 className="text-4xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
          We'll be back.
        </h1>
        <p className="text-[#86868b] text-lg leading-relaxed mb-12">
          We're busy updating the Solanki Vastra Bhandar for you. <br />
          Please check back soon.
        </p>
        <p className="text-[#86868b] text-xs">
          Copyright © 2017 Solanki Vastra Bhandar. All rights reserved
        </p>
      </div>
    </div>
  );
}
