"use client";

import { 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  Users, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Clock, 
  Layers, 
  Sun, 
  Moon, 
  HelpCircle,
  TrendingUp,
  FileSpreadsheet,
  Award,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { LegalAccount } from "@/lib/mockData";

interface LandingPageProps {
  onSelectRole: (role: "specialist" | "supervisor" | "client") => void;
  onOpenQuickRegistration: () => void;
  accounts: LegalAccount[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LandingPage({
  onSelectRole,
  onOpenQuickRegistration,
  accounts,
  isDarkMode,
  onToggleDarkMode
}: LandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const totalCount = accounts.length || 124;
  const approvedCount = accounts.filter(x => x.phase === "approved").length || 38;

  const faqs = [
    {
      q: "مدارک اولیه لازم جهت ثبت اطلاعات حقوقی در سامانه چیست؟",
      a: "اساسنامه شرکت، آخرین روزنامه رسمی حاوی آگهی تاسیس و آخرین تغییرات هیئت مدیره و صاحبان امضا، تصویر مدارک هویتی صاحبان امضا و شماره شبای حساب بانکی به نام شخص حقوقی."
    },
    {
      q: "فرآیند تایید پرونده توسط کارشناس حقوقی چگونه انجام می‌شود؟",
      a: "کارشناس حقوقی پس از بررسی صحت اطلاعات ثبتی در پایگاه روزنامه رسمی کشور و انطباق صاحبان امضا، فرم حقوقی را تکمیل کرده و قرارداد اختصاصی والکس را جهت امضا ارسال می‌نماید."
    },
    {
      q: "تفاوت دسترسی کارشناس حقوقی با سرپرست نظارت چیست؟",
      a: "کارشناس حقوقی مسئولیت ثبت اطلاعات اولیه، تکمیل فرم جامع، برقراری تماس و جمع‌آوری مدارک را دارد؛ در حالی که سرپرست نظارت (سطح ۲)، پرونده‌های تکمیل‌شده را بررسی و تایید نهایی را جهت آغاز معاملات سازمانی صادر می‌کند."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  سامانه احراز هویت حقوقی والکس
                </h1>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/50 dark:border-blue-800/40">
                  نسخه سازمانی B2B
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                درگاه یکپارچه ثبت، استعلام و تکمیل پرونده شرکت‌ها
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectRole("specialist")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ورود به پنل کارشناس حقوقی</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
              title={isDarkMode ? "پوسته روشن" : "پوسته تاریک"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 lg:py-20 px-6 border-b border-slate-200/70 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(0,0,0,0))] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>پلتفرم احراز هویت شرکت‌ها و اشخاص حقوقی در صرافی والکس</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            سامانه جامع مدیریت و بررسی <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              پرونده‌های حقوقی و شرکتی
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            فرآیند هوشمند ثبت مشخصات ثبتی، استعلام روزنامه رسمی، احراز صاحبان امضا، امضای قراردادهای اختصاصی شرکتی و کنترل ریسک بر اساس الزامات مبارزه با پولشویی (AML).
          </p>

          {/* Quick Hero Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>استعلام برخط شناسه ملی</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>تطبیق حساب شبا با نام شرکت</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>مدیریت یکپارچه تماس‌های پیگیری</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Role Selection Section */}
      <section className="py-12 lg:py-16 px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>انتخاب نقش سازمانی جهت ورود</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            جایگاه سازمانی خود را برای ورود به پنل انتخاب کنید
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            برای هر نقش، کارتابل و دسترسی‌های اختصاصی متناسب با گردش کار احراز هویت والکس فراهم شده است.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* ROLE 1: LEGAL SPECIALIST (PRIMARY HIGHLIGHTED ROLE) */}
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden group hover:border-blue-600 transition-all">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-2xl shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>مسیر اصلی فعال (رول ۱)</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="w-13 h-13 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <FileSpreadsheet className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">جایگاه اجرایی</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  کارشناس حقوقی و پشتیبانی
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  مسئول ثبت اولیه اطلاعات حقوقی شرکت‌ها، تکمیل فرم چندمرحله‌ای، اعتبارسنجی اسناد و پیگیری مداوم متقاضیان.
                </p>
              </div>

              {/* Explicit Highlight on User-Requested Access */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                <p className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>دسترسی‌های اول و کلیدی این نقش:</span>
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pr-4 list-disc">
                  <li>
                    <strong className="text-slate-900 dark:text-white">ثبت اطلاعات اولیه حقوقی:</strong> ورود نام شرکت، شناسه ملی، شماره ثبت و ایجاد کد کاربری والکس.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">تکمیل فرم حقوقی:</strong> استعلام روزنامه رسمی، ثبت صاحبان امضا، شماره شبا و پیگیری اسناد.
                  </li>
                  <li>
                    <strong>ثبت تاریخچه تماس‌ها:</strong> لاگ تماس‌های خروجی و زمان‌بندی یادآوری پیگیری.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => onSelectRole("specialist")}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
              >
                <span>ورود به پنل کارشناس حقوقی (ثبت و فرم)</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenQuickRegistration}
                className="w-full py-2 px-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                + ثبت مستقیم اطلاعات اولیه شرکت جدید
              </button>
            </div>
          </div>

          {/* ROLE 2: SUPERVISOR & COMPLIANCE LEAD */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition-all">
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">جایگاه نظارتی و تاییدات</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  مدیر ارشد تطبیق و نظارت (سطح ۲)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  بررسی نهایی پرونده‌های ارسال‌شده از سوی کارشناسان حقوقی، اعتبارسنجی ریسک و صدور تاییدیه نهایی معامله شرکتی.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2">
                <p className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>دسترسی‌های کلیدی این نقش:</span>
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pr-4 list-disc">
                  <li>بررسی کارتابل ارجاعات سطح ۲ (خانم اسدی / تطبیق)</li>
                  <li>تایید نهایی قرارداد و پرونده یا ارجاع جهت رفع نقص</li>
                  <li>داشبورد تحلیلی و رتبه‌بندی عملکرد کارشناسان</li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectRole("supervisor")}
                className="w-full py-3.5 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>ورود به کارتابل نظارت و تاییدات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ROLE 3: CORPORATE CLIENT / APPLICANT */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-800 transition-all">
            <div className="space-y-4">
              <div className="w-13 h-13 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">پرتال متقاضیان حقوقی</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  نماینده شخص حقوقی / شرکت
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  ویژه مدیران عامل و نمایندگان رسمی شرکت‌ها جهت پیگیری مرحله به مرحله احراز هویت و بارگذاری اسناد تکمیلی.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2">
                <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>دسترسی‌های کلیدی این نقش:</span>
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 pr-4 list-disc">
                  <li>استعلام برخط وضعیت پرونده احراز هویت با UID</li>
                  <li>بارگذاری مدارک درخواستی کارشناس (روزنامه، اساسنامه)</li>
                  <li>مشاهده وضعیت قرارداد امضا شده توسط والکس</li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectRole("client")}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>ورود به پرتال پیگیری مدارک شرکتی</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Platform Features Ribbon */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">فرم ۵ مرحله‌ای هوشمند</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  تفکیک اطلاعات ثبتی، صاحبان امضا، استعلام روزنامه رسمی و شبای بانکی.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">ثبت تاریخچه تماس‌ها</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  لاگ دقیق مکالمات تلفنی با متقاضیان حقوقی به همراه بازه یادآوری تماس بعدی.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">تطابق کامل AML</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  انطباق با ضوابط مبارزه با پولشویی و احراز اصالت نماینده قانونی شرکت.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white">گزارش‌گیری تحلیلی</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  خروجی اکسل کامل با استانداردهای سازمانی و نمودار پیشرفت ماهانه پرونده‌ها.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
            پرسش‌های متداول احراز هویت حقوقی
          </h4>
          <p className="text-xs text-slate-500">
            پاسخ به سوالات پرتکرار کارشناسان و نمایندگان شرکت‌ها
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-6 text-center text-xs text-slate-400">
        <p>
          سامانه اختصاصی احراز هویت اشخاص حقوقی صرافی والکس • کلیه حقوق محفوظ است © ۱۴۰۵
        </p>
      </footer>
    </div>
  );
}
