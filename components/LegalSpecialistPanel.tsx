"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Filter, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PhoneCall, 
  ExternalLink, 
  X,
  Sparkles,
  Layers,
  FileCheck2,
  Building2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  FileText
} from "lucide-react";
import { LegalAccount, StatusPhase } from "@/lib/mockData";
import { isShamsiDateInPeriod, getTodayShamsiString } from "@/lib/utils";
import LegalRegistrationModal from "./LegalRegistrationModal";

interface LegalSpecialistPanelProps {
  accounts: LegalAccount[];
  onUpdateAccounts: (updated: LegalAccount[]) => void;
  onBackToLanding: () => void;
  onSwitchRole: (role: "landing" | "specialist" | "supervisor" | "client") => void;
}

const EXPERTS = ["آیگین", "مریم", "لیلا", "سپهر", "فاطمه", "اسما", "غزل"];

export default function LegalSpecialistPanel({
  accounts,
  onUpdateAccounts,
  onBackToLanding,
  onSwitchRole,
}: LegalSpecialistPanelProps) {
  // Search and Filters
  const [search, setSearch] = useState("");
  const [filterExpert, setFilterExpert] = useState("");
  const [filterPhase, setFilterPhase] = useState<StatusPhase | "all">("all");
  const [filterTime, setFilterTime] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [filterCompletion, setFilterCompletion] = useState<"all" | "incomplete" | "complete">("all");
  const [sortBy, setSortBy] = useState<"date" | "company" | "status" | "completion">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal State for Legal Registration & KYC completion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"initial_only" | "full_kyc">("initial_only");
  const [selectedAccount, setSelectedAccount] = useState<LegalAccount | null>(null);

  // Quick Open Handlers
  const handleOpenInitialRegistration = () => {
    setSelectedAccount(null);
    setModalMode("initial_only");
    setIsModalOpen(true);
  };

  const handleOpenFullKyc = (acc?: LegalAccount) => {
    if (acc) {
      setSelectedAccount(acc);
    } else {
      setSelectedAccount(null);
    }
    setModalMode("full_kyc");
    setIsModalOpen(true);
  };

  // Save Account (Create or Update)
  const handleSaveAccount = (account: LegalAccount) => {
    let updatedList = [...accounts];
    const index = updatedList.findIndex(x => x.id === account.id);

    if (index !== -1) {
      updatedList[index] = account;
    } else {
      updatedList = [account, ...updatedList];
    }

    onUpdateAccounts(updatedList);
  };

  // Delete Account
  const handleDeleteAccount = (id: string) => {
    if (confirm("آیا از حذف این پرونده حقوقی اطمینان دارید؟")) {
      const updated = accounts.filter(x => x.id !== id);
      onUpdateAccounts(updated);
    }
  };

  // Export to Excel-compatible CSV
  const handleExportCSV = () => {
    const headers = [
      "تاریخ ثبت پرونده",
      "شناسه کاربری (UID)",
      "نام شرکت",
      "شناسه ملی",
      "نوع شرکت",
      "کارشناس مسئول",
      "آخرین وضعیت",
      "نام نماینده / ادمین",
      "صاحبین امضا",
      "درصد تکمیل فرم حقوقی",
      "تلفن شرکت",
      "شماره شبا حقوقی",
      "استعلام روزنامه رسمی",
      "پرووال",
      "دلیل عدم تایید یا توضیحات",
      "تعداد تماس‌های ثبت‌شده"
    ];

    const rows = accounts.map(acc => [
      acc.date,
      acc.id,
      acc.companyName,
      acc.nationalId || "",
      acc.companyType || "",
      acc.expert,
      acc.lastStatus,
      acc.adminName,
      acc.signers,
      `${acc.formCompletionPercentage || 0}%`,
      acc.companyPhone || "",
      acc.iban || "",
      acc.gazetteVerified ? "تایید شده" : "در انتظار",
      acc.prowal,
      acc.rejectionReason,
      acc.callLogs?.length || 0
    ]);

    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      const sanitized = row.map(v => {
        const str = String(v ?? "").replace(/"/g, '""');
        return str.includes(",") || str.includes("\n") ? `"${str}"` : str;
      });
      csvContent += sanitized.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Wallex-Legal-Accounts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering and Sorting
  const filteredAccounts = useMemo(() => {
    const today = getTodayShamsiString();
    return accounts.filter(acc => {
      const q = search.toLowerCase();
      const matchesSearch = 
        acc.id.toLowerCase().includes(q) ||
        (acc.companyName || "").toLowerCase().includes(q) ||
        (acc.nationalId || "").toLowerCase().includes(q) ||
        (acc.adminName || "").toLowerCase().includes(q) ||
        (acc.expert || "").toLowerCase().includes(q) ||
        (acc.lastStatus || "").toLowerCase().includes(q) ||
        (acc.signers || "").toLowerCase().includes(q) ||
        (acc.prowal || "").toLowerCase().includes(q) ||
        (acc.registrationNumber || "").toLowerCase().includes(q);

      const matchesExpert = filterExpert === "" || acc.expert === filterExpert;
      const matchesPhase = filterPhase === "all" || acc.phase === filterPhase;
      const matchesTime = isShamsiDateInPeriod(acc.date, filterTime, today);

      let matchesCompletion = true;
      const comp = acc.formCompletionPercentage || 0;
      if (filterCompletion === "incomplete") {
        matchesCompletion = comp < 70;
      } else if (filterCompletion === "complete") {
        matchesCompletion = comp >= 70;
      }

      return matchesSearch && matchesExpert && matchesPhase && matchesTime && matchesCompletion;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = a.date.localeCompare(b.date);
      } else if (sortBy === "company") {
        comparison = (a.companyName || "").localeCompare(b.companyName || "");
      } else if (sortBy === "status") {
        comparison = a.phase.localeCompare(b.phase);
      } else if (sortBy === "completion") {
        comparison = (a.formCompletionPercentage || 0) - (b.formCompletionPercentage || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [accounts, search, filterExpert, filterPhase, filterTime, filterCompletion, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = accounts.length;
    const initialCount = accounts.filter(x => x.phase === "initial").length;
    const processingCount = accounts.filter(x => x.phase === "processing").length;
    const approvedCount = accounts.filter(x => x.phase === "approved").length;
    const needsFormCompletion = accounts.filter(x => (x.formCompletionPercentage || 0) < 60).length;

    return {
      total,
      initialCount,
      processingCount,
      approvedCount,
      needsFormCompletion,
      initialPct: total ? Math.round((initialCount / total) * 100) : 0,
      approvedPct: total ? Math.round((approvedCount / total) * 100) : 0,
    };
  }, [accounts]);

  return (
    <div className="space-y-6">
      {/* Role Navigation & Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="بازگشت به صفحه اصلی"
          >
            <ArrowRight className="w-4 h-4" />
            <span>صفحه اصلی (لندینگ)</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              جایگاه فعال:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold">
              کارشناس حقوقی و پشتیبانی والکس
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">تغییر سریع جایگاه:</span>
          <button
            onClick={() => onSwitchRole("supervisor")}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            پنل سرپرست نظارت
          </button>
          <button
            onClick={() => onSwitchRole("client")}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            پرتال متقاضی شرکتی
          </button>
        </div>
      </div>

      {/* Primary Workflow Callouts: Registration & Form Completion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action Card 1: Initial Registration */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-lg shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دسترسی اول کارشناس حقوقی</span>
            </div>
            <h3 className="text-lg font-bold">ثبت اطلاعات اولیه حقوقی</h3>
            <p className="text-blue-100 text-xs leading-relaxed">
              تعریف شرکت جدید، ثبت شناسه کاربری والکس، شناسه ملی، نام نماینده و ثبت در پروسه احراز هویت.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={handleOpenInitialRegistration}
              className="w-full py-2.5 px-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ ثبت پرونده و اطلاعات اولیه</span>
            </button>
          </div>
        </div>

        {/* Action Card 2: Comprehensive Legal Form */}
        <div className="bg-gradient-to-br from-purple-700 to-indigo-900 text-white rounded-2xl p-5 shadow-lg shadow-purple-500/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>تکمیل و اعتبارسنجی کامل</span>
            </div>
            <h3 className="text-lg font-bold">تکمیل فرم حقوقی پیشرفته</h3>
            <p className="text-purple-100 text-xs leading-relaxed">
              ورود صاحبان امضا، استعلام روزنامه رسمی، ثبت شماره شبای شرکتی و تاریخچه تماس‌های پیگیری.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <button
              onClick={() => handleOpenFullKyc()}
              className="w-full py-2.5 px-4 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>تکمیل فرم حقوقی (فرم ۵ مرحله‌ای)</span>
            </button>
          </div>
        </div>

        {/* Action Card 3: Incomplete Forms Counter & Quick Filter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                وضعیت فرم‌های حقوقی
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold">
                نیازمند اقدام
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.needsFormCompletion}
              </span>
              <span className="text-xs text-slate-500">پرونده با فرم تکمیل‌نشده</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              پرونده‌هایی که نیازمند استعلام روزنامه رسمی، دریافت اساسنامه یا تکمیل شماره شبا می‌باشند.
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setFilterCompletion(prev => prev === "incomplete" ? "all" : "incomplete");
              }}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                filterCompletion === "incomplete"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{filterCompletion === "incomplete" ? "نمایش همه پرونده‌ها" : "فیلتر پرونده‌های نیازمند تکمیل فرم"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">کل پرونده‌های ثبت شده</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.total}</p>
          </div>
          <Building2 className="w-7 h-7 text-blue-500/40" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">اطلاعات اولیه / پیش‌نویس</p>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">{stats.initialCount}</p>
          </div>
          <AlertTriangle className="w-7 h-7 text-amber-500/40" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">در مرحله تایید و پیگیری</p>
            <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{stats.processingCount}</p>
          </div>
          <Clock className="w-7 h-7 text-purple-500/40" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">تایید نهایی شده (سبز)</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.approvedCount}</p>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500/40" />
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Live Search */}
        <div className="relative w-full lg:w-96 flex-shrink-0">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="جستجو در UID، شرکت، شناسه ملی، ادمین یا کارشناس..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 h-11 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 text-slate-850 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-sm focus:outline-none"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          {/* Expert Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 h-11 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={filterExpert}
              onChange={e => setFilterExpert(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer h-full"
            >
              <option value="">همه کارشناسان</option>
              {EXPERTS.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 h-11 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={filterPhase}
              onChange={e => setFilterPhase(e.target.value as StatusPhase | "all")}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer h-full"
            >
              <option value="all">همه مراحل پیشرفت</option>
              <option value="initial">اطلاعات اولیه / پیش‌نویس</option>
              <option value="processing">نزدیک تایید / پیگیری</option>
              <option value="approved">تایید نهایی شده (سطح ۲)</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 h-11 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={filterTime}
              onChange={e => setFilterTime(e.target.value as "all" | "today" | "week" | "month" | "year")}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer h-full"
            >
              <option value="all">همه زمان‌ها</option>
              <option value="today">امروز</option>
              <option value="week">هفته جاری</option>
              <option value="month">ماه جاری</option>
              <option value="year">سال جاری</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="h-11 px-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="خروجی فایل اکسل"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">خروجی اکسل</span>
          </button>

          {/* Reset Filters */}
          {(search || filterExpert || filterPhase !== "all" || filterTime !== "all" || filterCompletion !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterExpert("");
                setFilterPhase("all");
                setFilterTime("all");
                setFilterCompletion("all");
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer h-11 px-2"
            >
              <X className="w-3.5 h-3.5" />
              <span>پاک‌سازی</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-right border-collapse text-slate-800 dark:text-slate-200">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-5 py-3.5">شرکت و شناسه ملی</th>
                <th className="px-4 py-3.5">درصد تکمیل فرم حقوقی</th>
                <th className="px-4 py-3.5">اقدام: تکمیل / ویرایش فرم</th>
                <th className="px-4 py-3.5">آخرین وضعیت و علت رد</th>
                <th className="px-4 py-3.5">کارشناس مسئول</th>
                <th className="px-4 py-3.5">تاریخ پرونده</th>
                <th className="px-4 py-3.5 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">پرونده‌ای با فیلترهای مشخص‌شده یافت نشد.</p>
                    <button
                      onClick={handleOpenInitialRegistration}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ثبت پرونده حقوقی جدید</span>
                    </button>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredAccounts.map(acc => {
                    let cardBg = "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80";
                    let sideBorder = "border-r-4 border-r-slate-300 dark:border-r-slate-700";
                    let badgeColor = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";

                    if (acc.phase === "approved") {
                      cardBg = "bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20";
                      sideBorder = "border-r-4 border-r-emerald-500";
                      badgeColor = "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300";
                    } else if (acc.phase === "processing") {
                      cardBg = "bg-purple-50/20 dark:bg-purple-950/10 hover:bg-purple-50/50 dark:hover:bg-purple-950/20";
                      sideBorder = "border-r-4 border-r-purple-500";
                      badgeColor = "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300";
                    }

                    const completion = acc.formCompletionPercentage || 0;

                    return (
                      <motion.tr
                        key={acc.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`border-b dark:border-slate-800 last:border-none transition-colors ${cardBg} ${sideBorder}`}
                      >
                        {/* Company & National ID */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                              <span>{acc.companyName || "تکمیل نام شرکت"}</span>
                              {acc.companyType && (
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                  {acc.companyType}
                                </span>
                              )}
                              {acc.prowal && (
                                <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono px-1.5 py-0.5 rounded font-bold">
                                  P-{acc.prowal}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                              <span>نماینده: {acc.adminName || "ثبت نشده"}</span>
                              <span className="text-slate-300">|</span>
                              <span className="font-mono text-[11px] text-slate-400">UID: {acc.id}</span>
                              {acc.nationalId && (
                                <>
                                  <span className="text-slate-300">|</span>
                                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                    شناسه ملی: {acc.nationalId}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Form Completion Progress Bar */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-1 w-32">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">پیشرفت فرم:</span>
                              <span className="font-bold font-mono">{completion}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  completion >= 80 ? "bg-emerald-500" : completion >= 40 ? "bg-purple-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                            {acc.gazetteVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                <span>روزنامه رسمی تایید شد</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Direct Action: Complete Legal Form */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleOpenFullKyc(acc)}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>تکمیل فرم حقوقی</span>
                          </button>
                        </td>

                        {/* Last Status & Rejection Reason */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                            {acc.lastStatus}
                          </span>
                          {acc.rejectionReason && (
                            <p className="text-xs text-slate-500 mt-1 max-w-[220px] truncate" title={acc.rejectionReason}>
                              {acc.rejectionReason}
                            </p>
                          )}
                        </td>

                        {/* Expert */}
                        <td className="px-4 py-3.5 font-medium text-xs text-slate-700 dark:text-slate-300">
                          {acc.expert}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                          {acc.date}
                        </td>

                        {/* Operations */}
                        <td className="px-4 py-3.5 text-left">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedAccount(acc);
                                setModalMode("initial_only");
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="ویرایش اطلاعات اولیه"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteAccount(acc.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                              title="حذف پرونده"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legal Registration & KYC Completion Modal */}
      <LegalRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
        initialAccount={selectedAccount}
        experts={EXPERTS}
        initialMode={modalMode}
      />
    </div>
  );
}
