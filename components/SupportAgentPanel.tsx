"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  MessageSquare, 
  PhoneCall, 
  ArrowRight, 
  FileText, 
  ShieldAlert, 
  Users, 
  CreditCard, 
  Sparkles,
  ExternalLink,
  HelpCircle,
  KeyRound,
  LogOut
} from "lucide-react";
import { LegalAccount } from "@/lib/mockData";
import { AuthUser } from "@/lib/auth";

interface SupportAgentPanelProps {
  accounts: LegalAccount[];
  onBackToLanding: () => void;
  onSwitchRole: (role: "landing" | "specialist" | "support" | "management" | "supervisor" | "client") => void;
  currentUser?: AuthUser | null;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
}

export default function SupportAgentPanel({
  accounts,
  onBackToLanding,
  onSwitchRole,
  currentUser,
  onOpenChangePassword,
  onLogout,
}: SupportAgentPanelProps) {
  const [nationalIdInput, setNationalIdInput] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sample quick chips with realistic test cases
  const sampleCompanies = useMemo(() => {
    // Pick 1 with rejection/incomplete reason, 1 approved, 1 processing, 1 pending
    const incomplete = accounts.find(a => a.rejectionReason && a.rejectionReason.length > 5) || accounts[0];
    const approved = accounts.find(a => a.phase === "approved") || accounts[1];
    const processing = accounts.find(a => a.phase === "processing" && a.id !== incomplete?.id) || accounts[2];
    const initial = accounts.find(a => a.phase === "initial" && a.id !== incomplete?.id) || accounts[3];

    return [
      { label: "نمونه ۱: شرکت با نقص مدارک (نیاز به راهنمایی در چت)", account: incomplete },
      { label: "نمونه ۲: شرکت تایید نهایی شده (سطح ۲)", account: approved },
      { label: "نمونه ۳: در حال پیگیری و ارسال قرارداد", account: processing },
      { label: "نمونه ۴: اطلاعات اولیه و در انتظار مدارک", account: initial },
    ].filter(s => s.account && s.account.nationalId);
  }, [accounts]);

  // Find matching account based on nationalId (or UID as fallback)
  const matchedAccount = useMemo(() => {
    if (!searchedId) return null;
    const cleanQuery = searchedId.trim().replace(/\D/g, "");
    if (!cleanQuery) return null;

    return accounts.find(acc => {
      const accNationalId = (acc.nationalId || "").replace(/\D/g, "");
      const accUid = (acc.id || "").replace(/\D/g, "");
      return accNationalId === cleanQuery || accUid === cleanQuery || (acc.nationalId && acc.nationalId.includes(cleanQuery));
    }) || null;
  }, [accounts, searchedId]);

  const handleSearch = (customQuery?: string) => {
    const query = customQuery !== undefined ? customQuery : nationalIdInput;
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchedId(trimmed);
    setHasSearched(true);
    setCopied(false);
  };

  const handleChipClick = (id: string) => {
    setNationalIdInput(id);
    handleSearch(id);
  };

  // Generate polite support script to send to user in live chat
  const generateChatScript = (acc: LegalAccount) => {
    const company = acc.companyName || "شخص حقوقی";
    if (acc.phase === "approved") {
      return `کاربر گرامی والکس، با سلام. پرونده احراز هویت شرکت «${company}» با شناسه ملی ${acc.nationalId} در سامانه والکس با موفقیت تایید نهایی گردیده است و دسترسی معاملات و واریز/برداشت شرکتی برای شما فعال می‌باشد.`;
    }

    if (acc.rejectionReason) {
      return `کاربر گرامی والکس، با سلام. وضعیت پرونده حقوقی شرکت «${company}» توسط کارشناس حقوقی بررسی گردیده است. طبق یادداشت کارشناس: «${acc.rejectionReason}». خواهشمند است نسبت به رفع این موارد و ارسال مجدد مدارک اصلاح‌شده اقدام فرمایید تا فرآیند فعال‌سازی حساب تکمیل گردد.`;
    }

    return `کاربر گرامی والکس، با سلام. پرونده حقوقی شرکت «${company}» در وضعیت «${acc.lastStatus}» قرار دارد و توسط کارشناس حقوقی (${acc.expert}) در حال بررسی و تکمیل است. نتیجه بررسی به زودی از طریق پیامک به اطلاع شما خواهد رسید.`;
  };

  const handleCopyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Role Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>صفحه اصلی (لندینگ)</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              جایگاه فعال:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
              کارشناس پشتیبانی مشتریان (پاسخگویی آنلاین چت و تماس)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium hidden lg:inline">تغییر جایگاه:</span>
          <button
            onClick={() => onSwitchRole("specialist")}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            پنل کارشناس حقوقی (ثبت و فرم)
          </button>
          <button
            onClick={() => onSwitchRole("management")}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            پنل مدیریت و گزارش‌گیری
          </button>

          {/* User Profile & Change Password */}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          {currentUser && (
            <div className="hidden xl:flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800/60 rounded-xl px-2.5 py-1 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({currentUser.username})
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
              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
              title="خروج از حساب"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Support Agent Lookup Card */}
      <div className="bg-gradient-to-b from-white to-slate-50/70 dark:from-slate-900 dark:to-slate-900/60 border-2 border-amber-300/80 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl mx-auto space-y-5 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>کادر استعلام آنی وضعیت و نواقص مدارک حقوقی</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              استعلام وضعیت حساب حقوقی با شناسه ملی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl mx-auto leading-relaxed">
              هنگام ارتباط کاربر در چت آنلاین یا تماس تلفنی، شناسه ملی شرکت را وارد نمایید تا وضعیت دقیق پرونده، یادداشت کارشناس حقوقی و متن راهنمای پاسخ به کاربر برای شما نمایش داده شود.
            </p>
          </div>

          {/* Prominent Search Input Box */}
          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto pt-2">
            <div className="relative w-full flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="شناسه ملی ۱۱ رقمی شرکت را وارد کنید (مثال: 14007401530)..."
                value={nationalIdInput}
                onChange={e => setNationalIdInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 dark:focus:border-amber-500 rounded-2xl text-sm font-mono tracking-wider text-slate-900 dark:text-white focus:outline-none shadow-sm transition-all"
                dir="ltr"
              />
            </div>

            <button
              onClick={() => handleSearch()}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>استعلام پرونده</span>
            </button>
          </div>

          {/* Quick Clickable Sample Chips if available */}
          {sampleCompanies.length > 0 ? (
            <div className="pt-2 text-right">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                نمونه‌های ثبت‌شده جهت بررسی سریع کارشناس پشتیبانی:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleCompanies.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => s.account.nationalId && handleChipClick(s.account.nationalId)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-500 dark:hover:border-amber-500 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{s.account.nationalId}</span>
                    <span className="text-slate-400">|</span>
                    <span>{s.account.companyName}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2 text-center text-xs text-slate-400">
              هنوز پرونده حقوقی ثبت نشده است. ثبت پرونده جدید از طریق پنل کارشناس حقوقی انجام می‌شود.
            </div>
          )}
        </div>
      </div>

      {/* SEARCH RESULT DETAILS */}
      {hasSearched && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {matchedAccount ? (
            <div className="space-y-5">
              {/* Card 1: Main Status Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {matchedAccount.companyName}
                      </h3>
                      {matchedAccount.companyType && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {matchedAccount.companyType}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>شناسه ملی: <strong className="font-mono text-slate-800 dark:text-slate-200">{matchedAccount.nationalId}</strong></span>
                      <span>|</span>
                      <span>کد کاربری والکس: <strong className="font-mono text-slate-800 dark:text-slate-200">{matchedAccount.id}</strong></span>
                      <span>|</span>
                      <span>نماینده ثبت‌نامی: <strong className="text-slate-800 dark:text-slate-200">{matchedAccount.adminName || "مشخص نشده"}</strong></span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">وضعیت احراز هویت:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-2xs ${
                      matchedAccount.phase === "approved"
                        ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : matchedAccount.rejectionReason
                          ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          : matchedAccount.phase === "processing"
                            ? "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                            : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                    }`}>
                      {matchedAccount.phase === "approved" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : matchedAccount.rejectionReason ? (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-purple-600" />
                      )}
                      <span>{matchedAccount.lastStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Card 2: KEY HIGHLIGHT - Missing Documents & Legal Expert Comments */}
                <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                  matchedAccount.rejectionReason 
                    ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                    : matchedAccount.phase === "approved"
                      ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60"
                      : "bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className={`w-5 h-5 ${
                        matchedAccount.rejectionReason ? "text-rose-600" : matchedAccount.phase === "approved" ? "text-emerald-600" : "text-blue-600"
                      }`} />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {matchedAccount.rejectionReason ? "علت نقص مدارک و یادداشت کارشناس حقوقی:" : "وضعیت بررسی مدارک توسط کارشناس حقوقی:"}
                      </h4>
                    </div>

                    <span className="text-xs text-slate-500 font-medium">
                      کارشناس مسئول: <strong className="text-slate-800 dark:text-slate-200">{matchedAccount.expert}</strong>
                    </span>
                  </div>

                  {/* Comment Body */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {matchedAccount.rejectionReason ? (
                      <p className="text-rose-900 dark:text-rose-200 font-semibold">
                        {matchedAccount.rejectionReason}
                      </p>
                    ) : matchedAccount.phase === "approved" ? (
                      <p className="text-emerald-800 dark:text-emerald-300 font-semibold">
                        تمامی اسناد، روزنامه رسمی، احراز صاحبان امضا و شماره شبای شرکتی تایید گردیده و هیچ‌گونه نقصی در پرونده وجود ندارد.
                      </p>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300">
                        پرونده در مرحله بررسی مقدماتی کارشناس حقوقی است. تاکنون نقص مدارکی ثبت نشده است.
                      </p>
                    )}
                  </div>

                  {/* Ready-to-copy chat response for user */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>متن آماده جهت پاسخگویی به کاربر در چت / تماس:</span>
                      </span>

                      <button
                        onClick={() => handleCopyScript(generateChatScript(matchedAccount))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          copied
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>کپی متن جهت ارسال در چت</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                      {generateChatScript(matchedAccount)}
                    </div>
                  </div>
                </div>

                {/* Card 3: Document Status Checklist */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    وضعیت اسناد و استعلام‌های ثبتی جهت راهنمایی دقیق‌تر:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">روزنامه رسمی و تغییرات</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {matchedAccount.gazetteVerified ? "استعلام تایید شد" : "در انتظار استعلام / بارگذاری"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">صاحبان امضای مجاز</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={matchedAccount.signers}>
                        {matchedAccount.signers || "مشخص شده در روزنامه"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">شماره شبای حقوقی</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {matchedAccount.iban ? "ثبت شده به نام شرکت" : "ثبت نشده"}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">قرارداد شرکتی والکس</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {matchedAccount.wallexSignedContractSentDate ? "امضا و ارسال شد" : "در جریان ارسال"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Previous Call Logs History (if user already had calls) */}
                {matchedAccount.callLogs && matchedAccount.callLogs.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>تاریخچه آخرین مکالمات کارشناسان حقوقی با متقاضی:</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        تعداد تماس‌ها: {matchedAccount.callLogs.length}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {matchedAccount.callLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-slate-400">{log.date || "---"}</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{log.expert}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {log.status}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{log.result}</span>
                          </div>

                          {log.recallInterval && (
                            <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px] whitespace-nowrap">
                              توضیح: {log.recallInterval}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                هیچ حساب حقوقی با شناسه ملی «{searchedId}» یافت نشد
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                لطفاً صحت شناسه ملی ۱۱ رقمی اعلام‌شده توسط کاربر را مجدداً بررسی فرمایید. در صورتی که کاربر هنوز اقدام به ایجاد پرونده نکرده است، ایشان را به صفحه اصلی والکس جهت ارسال مدارک شرکتی هدایت فرمایید.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial state guide banner */}
      {!hasSearched && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              در انتظار ورود شناسه ملی شرکت
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              با وارد کردن شناسه ملی یا کلیک روی نمونه‌های بالا، اطلاعات پرونده، کامنت‌های نقص مدارک و متن آماده چت به سرعت برای شما آماده می‌شود.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
