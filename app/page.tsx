"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_LEGAL_ACCOUNTS, LegalAccount } from "@/lib/mockData";
import LandingPage from "@/components/LandingPage";
import LegalSpecialistPanel from "@/components/LegalSpecialistPanel";
import SupervisorPanel from "@/components/SupervisorPanel";
import CorporateClientPortal from "@/components/CorporateClientPortal";
import LegalRegistrationModal from "@/components/LegalRegistrationModal";

const EXPERTS = ["آیگین", "مریم", "لیلا", "سپهر", "فاطمه", "اسما", "غزل"];

export default function Home() {
  const [currentRole, setCurrentRole] = useState<"landing" | "specialist" | "supervisor" | "client">("landing");
  const [accounts, setAccounts] = useState<LegalAccount[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Quick Direct Registration modal trigger from landing page
  const [isQuickRegistrationOpen, setIsQuickRegistrationOpen] = useState(false);

  useEffect(() => {
    // 1. Dark Mode initialization
    const storedDark = localStorage.getItem("wallex_dark_mode");
    const isDark = storedDark === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setIsDarkMode(isDark);

    // 2. Accounts initialization
    const stored = localStorage.getItem("wallex_legal_accounts_v3");
    let loadedAccounts: LegalAccount[] = INITIAL_LEGAL_ACCOUNTS;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedAccounts = parsed;
        } else {
          loadedAccounts = INITIAL_LEGAL_ACCOUNTS;
          localStorage.setItem("wallex_legal_accounts_v3", JSON.stringify(INITIAL_LEGAL_ACCOUNTS));
        }
      } catch (e) {
        loadedAccounts = INITIAL_LEGAL_ACCOUNTS;
      }
    } else {
      localStorage.setItem("wallex_legal_accounts_v3", JSON.stringify(INITIAL_LEGAL_ACCOUNTS));
    }

    // Ensure all accounts have non-empty unique IDs and reasonable default values
    const seenIds = new Set<string>();
    const sanitized = loadedAccounts.map(acc => {
      let uId = acc.id || "account";
      let count = 1;
      while (seenIds.has(uId)) {
        uId = `${acc.id || "account"}_${count}`;
        count++;
      }
      seenIds.add(uId);

      // Estimate initial form completion percentage if missing
      let comp = acc.formCompletionPercentage;
      if (comp === undefined) {
        let score = 3;
        if (acc.companyName) score++;
        if (acc.adminName) score++;
        if (acc.signers) score += 2;
        if (acc.phase === "approved") score += 3;
        comp = Math.min(100, score * 10);
      }

      return {
        ...acc,
        id: uId,
        formCompletionPercentage: comp
      };
    });

    setAccounts(sanitized);
    setIsClient(true);
  }, []);

  const saveToStorage = (updatedList: LegalAccount[]) => {
    setAccounts(updatedList);
    localStorage.setItem("wallex_legal_accounts_v3", JSON.stringify(updatedList));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const nextVal = !prev;
      localStorage.setItem("wallex_dark_mode", String(nextVal));
      if (nextVal) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return nextVal;
    });
  };

  // Handler when quick registration is completed from landing page
  const handleQuickRegistrationSave = (newAccount: LegalAccount) => {
    const updated = [newAccount, ...accounts];
    saveToStorage(updated);
    // Automatically navigate to specialist panel so they can see their new record
    setCurrentRole("specialist");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center text-slate-800 dark:text-slate-100 p-8 transition-colors duration-200">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-sans text-base font-semibold">در حال بارگزاری سامانه احراز هویت حقوقی والکس...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <AnimatePresence mode="wait">
        {currentRole === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <LandingPage
              onSelectRole={(role) => setCurrentRole(role)}
              onOpenQuickRegistration={() => setIsQuickRegistrationOpen(true)}
              accounts={accounts}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          </motion.div>
        )}

        {currentRole === "specialist" && (
          <motion.div
            key="specialist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6"
          >
            <LegalSpecialistPanel
              accounts={accounts}
              onUpdateAccounts={saveToStorage}
              onBackToLanding={() => setCurrentRole("landing")}
              onSwitchRole={(role) => setCurrentRole(role)}
            />
          </motion.div>
        )}

        {currentRole === "supervisor" && (
          <motion.div
            key="supervisor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6"
          >
            <SupervisorPanel
              accounts={accounts}
              onUpdateAccounts={saveToStorage}
              onBackToLanding={() => setCurrentRole("landing")}
              onSwitchRole={(role) => setCurrentRole(role)}
            />
          </motion.div>
        )}

        {currentRole === "client" && (
          <motion.div
            key="client"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6"
          >
            <CorporateClientPortal
              accounts={accounts}
              onBackToLanding={() => setCurrentRole("landing")}
              onSwitchRole={(role) => setCurrentRole(role)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Direct Registration from Landing Page */}
      <LegalRegistrationModal
        isOpen={isQuickRegistrationOpen}
        onClose={() => setIsQuickRegistrationOpen(false)}
        onSave={handleQuickRegistrationSave}
        experts={EXPERTS}
        initialMode="initial_only"
      />
    </div>
  );
}
