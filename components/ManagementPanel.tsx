"use client";

import { useState, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  Filter, 
  Calendar, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  PieChart, 
  FileSpreadsheet, 
  Search, 
  ExternalLink,
  Printer,
  ChevronDown,
  Layers,
  Sparkles,
  Award,
  KeyRound,
  LogOut,
  Edit3,
  PlusCircle,
  FileText
} from "lucide-react";
import { LegalAccount, StatusPhase } from "@/lib/mockData";
import { isShamsiDateInPeriod, getTodayShamsiString } from "@/lib/utils";
import { AuthUser } from "@/lib/auth";
import ManagementEditModal from "./ManagementEditModal";
import LegalRegistrationModal from "./LegalRegistrationModal";

interface ManagementPanelProps {
  accounts: LegalAccount[];
  onUpdateAccounts: (updated: LegalAccount[]) => void;
  onBackToLanding: () => void;
  onSwitchRole: (role: "landing" | "specialist" | "support" | "management" | "client") => void;
  currentUser?: AuthUser | null;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
}

const EXPERTS = ["آیگین صدیق", "غزل خدائی", "اسما فاضلی"];

export default function ManagementPanel({
  accounts,
  onUpdateAccounts,
  onBackToLanding,
  onSwitchRole,
  currentUser,
  onOpenChangePassword,
  onLogout,
}: ManagementPanelProps) {
  // Period & Filtering States
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [selectedExpert, setSelectedExpert] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<StatusPhase | "all">("all");
  const [selectedStatusPreset, setSelectedStatusPreset] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChartTab, setActiveChartTab] = useState<"status" | "trend" | "experts">("status");

  // Managerial Editing & Change Recording States
  const [editingAccount, setEditingAccount] = useState<LegalAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFullKycModalOpen, setIsFullKycModalOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [managerToast, setManagerToast] = useState<string | null>(null);

  const handleOpenEdit = (acc: LegalAccount) => {
    setEditingAccount(acc);
    setIsEditModalOpen(true);
  };

  const handleOpenFullKycFromEdit = (acc: LegalAccount) => {
    setEditingAccount(acc);
    setIsFullKycModalOpen(true);
  };

  const handleSaveManagerChanges = (updatedAccount: LegalAccount) => {
    const updatedList = accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a);
    onUpdateAccounts(updatedList);
    setManagerToast(`تغییرات مدیریتی برای شرکت «${updatedAccount.companyName}» با موفقیت ذخیره شد.`);
    setTimeout(() => setManagerToast(null), 4000);
  };

  const handleSaveFullKycAccount = (savedAccount: LegalAccount) => {
    let updatedList = [...accounts];
    const idx = updatedList.findIndex(a => a.id === savedAccount.id);
    if (idx >= 0) {
      updatedList[idx] = savedAccount;
    } else {
      updatedList = [savedAccount, ...updatedList];
    }
    onUpdateAccounts(updatedList);
    setIsFullKycModalOpen(false);
    setIsNewAccountModalOpen(false);
    setManagerToast(`اطلاعات حقوقی شرکت «${savedAccount.companyName}» با موفقیت ذخیره شد.`);
    setTimeout(() => setManagerToast(null), 4000);
  };

  // Filtered accounts for management reporting
  const filteredAccounts = useMemo(() => {
    const today = getTodayShamsiString();
    return accounts.filter(acc => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        acc.companyName.toLowerCase().includes(q) ||
        acc.id.toLowerCase().includes(q) ||
        (acc.nationalId || "").toLowerCase().includes(q) ||
        acc.expert.toLowerCase().includes(q) ||
        acc.lastStatus.toLowerCase().includes(q) ||
        (acc.adminName || "").toLowerCase().includes(q);

      const matchesExpert = selectedExpert === "all" || acc.expert === selectedExpert;
      const matchesPhase = selectedPhase === "all" || acc.phase === selectedPhase;
      const matchesTime = isShamsiDateInPeriod(acc.date, selectedPeriod, today);

      let matchesPreset = true;
      if (selectedStatusPreset !== "all") {
        matchesPreset = acc.lastStatus.includes(selectedStatusPreset);
      }

      return matchesSearch && matchesExpert && matchesPhase && matchesTime && matchesPreset;
    });
  }, [accounts, searchQuery, selectedExpert, selectedPhase, selectedPeriod, selectedStatusPreset]);

  // Comprehensive management calculations
  const analytics = useMemo(() => {
    const total = filteredAccounts.length;
    const approved = filteredAccounts.filter(x => x.phase === "approved").length;
    const processing = filteredAccounts.filter(x => x.phase === "processing").length;
    const initial = filteredAccounts.filter(x => x.phase === "initial").length;
    const withDefects = filteredAccounts.filter(x => x.rejectionReason && x.rejectionReason.length > 5).length;
    const totalCalls = filteredAccounts.reduce((sum, x) => sum + (x.callLogs?.length || 0), 0);

    const approvedRate = total ? Math.round((approved / total) * 100) : 0;
    const processingRate = total ? Math.round((processing / total) * 100) : 0;
    const initialRate = total ? Math.round((initial / total) * 100) : 0;

    // Detailed Status Frequency
    const statusCounts: Record<string, number> = {};
    filteredAccounts.forEach(acc => {
      const st = acc.lastStatus.trim() || "نامشخص";
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });
    const statusBreakdown = Object.entries(statusCounts)
      .map(([label, count]) => ({
        label,
        count,
        pct: total ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Monthly Timeline Trend
    const monthlyCounts: Record<string, number> = {};
    filteredAccounts.forEach(acc => {
      const parts = acc.date.replace(/\./g, "/").split("/");
      const key = `${parts[0] || "1402"}/${parts[1] || "01"}`;
      monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });
    const monthlyTrend = Object.entries(monthlyCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Maximum monthly count for SVG scaling
    const maxMonthCount = Math.max(...monthlyTrend.map(m => m.count), 1);

    // Expert Performance Matrix
    const expertStats: Record<string, { total: number; approved: number; calls: number }> = {};
    filteredAccounts.forEach(acc => {
      if (!expertStats[acc.expert]) {
        expertStats[acc.expert] = { total: 0, approved: 0, calls: 0 };
      }
      expertStats[acc.expert].total += 1;
      if (acc.phase === "approved") {
        expertStats[acc.expert].approved += 1;
      }
      expertStats[acc.expert].calls += (acc.callLogs?.length || 0);
    });

    const expertLeaderboard = Object.entries(expertStats)
      .map(([name, s]) => ({
        name,
        total: s.total,
        approved: s.approved,
        calls: s.calls,
        conversionPct: s.total ? Math.round((s.approved / s.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    return {
      total,
      approved,
      processing,
      initial,
      withDefects,
      totalCalls,
      approvedRate,
      processingRate,
      initialRate,
      statusBreakdown,
      monthlyTrend,
      maxMonthCount,
      expertLeaderboard
    };
  }, [filteredAccounts]);

  // Export Management Report to Excel CSV (UTF-8 BOM)
  const handleExportManagementReport = () => {
    const headers = [
      "تاریخ ثبت پرونده",
      "نام شرکت",
      "شناسه ملی",
      "کد کاربری (UID)",
      "کارشناس حقوقی",
      "آخرین وضعیت فرآیند",
      "فاز کلی",
      "نام نماینده / ادمین",
      "درصد تکمیل فرم",
      "تعداد تماس‌های پیگیری",
      "علت نقص یا توضیحات کارشناس"
    ];

    const rows = filteredAccounts.map(acc => [
      acc.date,
      acc.companyName,
      acc.nationalId || "",
      acc.id,
      acc.expert,
      acc.lastStatus,
      acc.phase === "approved" ? "تایید نهایی" : acc.phase === "processing" ? "در جریان" : "اطلاعات اولیه",
      acc.adminName || "",
      `${acc.formCompletionPercentage || 0}%`,
      acc.callLogs?.length || 0,
      acc.rejectionReason || "بدون نقص"
    ]);

    let csv = "\uFEFF";
    csv += headers.join(",") + "\n";
    rows.forEach(r => {
      const sanitized = r.map(v => {
        const str = String(v ?? "").replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") ? `"${str}"` : str;
      });
      csv += sanitized.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Wallex-Management-Audit-Report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Role Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white">
              سامانه احراز هویت حقوقی والکس
            </h1>
          </div>
        </div>

        {/* Actions & User Profile */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => {
              setEditingAccount(null);
              setIsNewAccountModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="ثبت مستقیم پرونده جدید حقوقی توسط مدیریت"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ ثبت پرونده جدید</span>
          </button>
          <button
            onClick={handleExportManagementReport}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>خروجی اکسل مدیریتی</span>
          </button>
          <button
            onClick={handlePrintSummary}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="چاپ یا ذخیره PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">چاپ</span>
          </button>

          {/* User Profile & Change Password */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-xl px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({currentUser.displayUsername || currentUser.username})
              </span>
            </div>
          )}

          {onOpenChangePassword && (
            <button
              onClick={onOpenChangePassword}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="تغییر رمز عبور ورود"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>تغییر رمز عبور</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
              title="خروج از حساب کاربری"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback */}
      {managerToast && (
        <div className="px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{managerToast}</span>
        </div>
      )}

      {/* KPI Cards: Executive High-Level Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>کل پرونده‌های ثبت‌شده</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{analytics.total}</p>
          <p className="text-[11px] text-slate-400">حساب‌های حقوقی تحت پوشش</p>
        </div>

        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs">
            <span>تأیید نهایی شده (سطح ۲)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-emerald-950 dark:text-emerald-300">{analytics.approved}</p>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">({analytics.approvedRate}%)</span>
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">آماده معامله و تسویه ریالی</p>
        </div>

        <div className="bg-purple-50/60 dark:bg-purple-950/20 p-5 rounded-2xl border border-purple-200 dark:border-purple-800/60 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-purple-800 dark:text-purple-300 text-xs">
            <span>در مرحله بررسی و قرارداد</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-purple-950 dark:text-purple-300">{analytics.processing}</p>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 font-mono">({analytics.processingRate}%)</span>
          </div>
          <p className="text-[11px] text-purple-700/80 dark:text-purple-400">در حال مکاتبه یا ارسال نسخه</p>
        </div>

        <div className="bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs">
            <span>اطلاعات اولیه / پیش‌نویس</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-amber-950 dark:text-amber-300">{analytics.initial}</p>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">({analytics.initialRate}%)</span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400">نیازمند تکمیل مدارک ثبتی</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>مجموع تماس‌های پیگیری</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{analytics.totalCalls}</p>
          <p className="text-[11px] text-slate-400">مکالمات تلفنی ثبت‌شده</p>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجوی شرکت، شناسه ملی، UID یا کارشناس..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Period Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="all">همه بازه‌های زمانی</option>
              <option value="today">امروز</option>
              <option value="week">۷ روز اخیر</option>
              <option value="month">ماه جاری</option>
              <option value="year">سال جاری</option>
            </select>
          </div>

          {/* Expert Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedExpert}
              onChange={e => setSelectedExpert(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="all">همه کارشناسان حقوقی</option>
              {EXPERTS.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPhase}
              onChange={e => setSelectedPhase(e.target.value as any)}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="all">همه فازها</option>
              <option value="approved">تأیید نهایی شده (سبز)</option>
              <option value="processing">در مرحله تایید و قرارداد (بنفش)</option>
              <option value="initial">اطلاعات اولیه / نیازمند اقدام</option>
            </select>
          </div>

          {/* Reset button */}
          {(searchQuery || selectedPeriod !== "all" || selectedExpert !== "all" || selectedPhase !== "all" || selectedStatusPreset !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPeriod("all");
                setSelectedExpert("all");
                setSelectedPhase("all");
                setSelectedStatusPreset("all");
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 cursor-pointer"
            >
              پاک‌سازی
            </button>
          )}
        </div>
      </div>

      {/* Management Reporting Charts Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Chart Header & Tab Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>نمودارهای تحلیلی و گزارش‌گیری وضعیت احراز هویت</span>
            </h3>
            <p className="text-xs text-slate-500">
              نمایش داده‌محور وضعیت پرونده‌ها، روند زمانی و عملکرد کارشناسان
            </p>
          </div>

          {/* Chart View Toggles */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex text-xs font-bold">
            <button
              onClick={() => setActiveChartTab("status")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === "status"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              توزیع وضعیت‌ها
            </button>

            <button
              onClick={() => setActiveChartTab("trend")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === "trend"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              روند ماهانه ثبت
            </button>

            <button
              onClick={() => setActiveChartTab("experts")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === "experts"
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              عملکرد کارشناسان
            </button>
          </div>
        </div>

        {/* CHART 1: STATUS DISTRIBUTION BREAKDOWN */}
        {activeChartTab === "status" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600" />
                <span>نمودار تعیین وضعیت‌ها و تحلیل آماری مراحل احراز هویت حقوقی</span>
              </h4>
              {selectedStatusPreset !== "all" && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">فیلتر وضعیت فعال: {selectedStatusPreset}</span>
                  <button
                    onClick={() => setSelectedStatusPreset("all")}
                    className="text-[11px] text-rose-600 hover:underline font-bold"
                  >
                    (حذف فیلتر)
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Macro Phase Progress Bars */}
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    آمار و درصد فازهای کلان احراز هویت:
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    مجموع: {analytics.total} پرونده
                  </span>
                </div>

                {/* 1. Approved */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      تأیید نهایی شده (سطح ۲)
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {analytics.approved} شرکت ({analytics.approvedRate}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${analytics.approvedRate}%` }} />
                  </div>
                </div>

                {/* 2. Processing */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                      در مرحله تایید و تبادل قرارداد
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {analytics.processing} شرکت ({analytics.processingRate}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${analytics.processingRate}%` }} />
                  </div>
                </div>

                {/* 3. Initial */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                      اطلاعات اولیه / پیش‌نویس
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {analytics.initial} شرکت ({analytics.initialRate}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${analytics.initialRate}%` }} />
                  </div>
                </div>

                {/* 4. Defects */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-750">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      دارای نقص مدارک / نیازمند اقدام
                    </span>
                    <span className="font-mono text-amber-700 dark:text-amber-300">
                      {analytics.withDefects} شرکت ({analytics.total ? Math.round((analytics.withDefects / analytics.total) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${analytics.total ? Math.round((analytics.withDefects / analytics.total) * 100) : 0}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Detailed Status Frequency List with Visual Bars */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    فراوانی مراحل تفصیلی تعیین وضعیت (کلیک جهت فیلتر جدول):
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {analytics.statusBreakdown.length} عنوان وضعیت
                  </span>
                </div>

                {analytics.statusBreakdown.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                    هنوز پرونده‌ای جهت نمایش فراوانی وضعیت ثبت نشده است.
                  </div>
                ) : (
                  analytics.statusBreakdown.map((st, idx) => {
                    const isSelected = selectedStatusPreset === st.label;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedStatusPreset(isSelected ? "all" : st.label);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? "border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700"
                        }`}
                        title="برای فیلتر کردن این وضعیت در جدول کلیک کنید"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5 relative z-10">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-mono text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{st.label}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-600 dark:text-slate-400 font-bold text-xs">{st.count} شرکت</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-[11px]">
                              {st.pct}%
                            </span>
                          </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(st.pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* CHART 2: MONTHLY TREND (SVG Chart) */}
        {activeChartTab === "trend" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  نمودار ستونی تعداد ثبت پرونده‌ها به تفکیک ماه‌های سال (شمسی):
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  بیشترین ثبت در یک ماه: {analytics.maxMonthCount} پرونده
                </span>
              </div>

              {/* Responsive SVG Chart */}
              {analytics.monthlyTrend.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                  هنوز پرونده حقوقی در سیستم ثبت نشده است.
                </div>
              ) : (
                <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                  {analytics.monthlyTrend.map((m, idx) => {
                    const heightPct = Math.round((m.count / analytics.maxMonthCount) * 100);
                    return (
                      <div key={idx} className="flex-1 min-w-[40px] flex flex-col items-center gap-1 group h-full justify-end">
                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                          {m.count}
                        </span>
                        <div
                          className="w-full max-w-[32px] bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-md hover:from-purple-700 hover:to-indigo-600 transition-all cursor-pointer shadow-xs"
                          style={{ height: `${Math.max(8, heightPct)}%` }}
                          title={`${m.month}: ${m.count} پرونده`}
                        />
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors rotate-45 sm:rotate-0 mt-1 whitespace-nowrap">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHART 3: EXPERTS PERFORMANCE LEADERBOARD */}
        {activeChartTab === "experts" && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ماتریس عملکرد کارشناسان حقوقی والکس:
            </h4>

            {analytics.expertLeaderboard.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
                هنوز پرونده‌ای جهت ارزیابی کارشناسان ثبت نشده است.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {analytics.expertLeaderboard.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{exp.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold">
                      {exp.conversionPct}% تایید
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">کل پرونده</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{exp.total}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-emerald-600 block">تایید شده</span>
                      <strong className="text-emerald-600 font-mono">{exp.approved}</strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-indigo-500 block">تماس‌ها</span>
                      <strong className="text-indigo-600 font-mono">{exp.calls}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
      </div>

      {/* Main Management Records Audit Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>فهرست تفصیلی پرونده‌های حقوقی جهت بررسی مدیریتی</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              نمایش {filteredAccounts.length} پرونده فیلترشده از مجموع {accounts.length} حساب حقوقی
            </p>
          </div>

          <button
            onClick={handleExportManagementReport}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود کل این گزارش (CSV)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-4">شرکت و شناسه ملی</th>
                <th className="p-4">کارشناس مسئول</th>
                <th className="p-4">وضعیت احراز هویت</th>
                <th className="p-4">فاز پیشرفت</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4">نواقص مدارک / توضیحات</th>
                <th className="p-4">تماس‌های پیگیری</th>
                <th className="p-4 text-center">عملیات و ثبت تغییرات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    پرونده‌ای با فیلترهای مشخص‌شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredAccounts.slice(0, 50).map(acc => (
                  <tr key={acc.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{acc.companyName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">UID: {acc.id}</span>
                        {acc.nationalId && (
                          <>
                            <span>|</span>
                            <span className="font-mono text-purple-600 dark:text-purple-400">شناسه ملی: {acc.nationalId}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {acc.expert}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {acc.lastStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        acc.phase === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : acc.phase === "processing"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-200 text-slate-700"
                      }`}>
                        {acc.phase === "approved" ? "تایید نهایی" : acc.phase === "processing" ? "در جریان" : "اطلاعات اولیه"}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-slate-500">
                      {acc.date}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={acc.rejectionReason || "بدون نقص"}>
                      {acc.rejectionReason || <span className="text-emerald-600 font-medium">بدون نقص</span>}
                    </td>

                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {acc.callLogs?.length || 0} تماس
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(acc)}
                        className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mx-auto"
                        title="بررسی، ویرایش و ثبت تغییرات مدیریتی"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ثبت تغییرات</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Quick Status / Edit Modal */}
      <ManagementEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        account={editingAccount}
        onSave={handleSaveManagerChanges}
        onOpenFullKyc={handleOpenFullKycFromEdit}
        experts={EXPERTS}
      />

      {/* Full KYC / New Account Modal for Management */}
      <LegalRegistrationModal
        isOpen={isFullKycModalOpen || isNewAccountModalOpen}
        onClose={() => {
          setIsFullKycModalOpen(false);
          setIsNewAccountModalOpen(false);
        }}
        onSave={handleSaveFullKycAccount}
        initialAccount={editingAccount}
        experts={EXPERTS}
        initialMode="full_kyc"
      />
    </div>
  );
}
