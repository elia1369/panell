"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Building2, 
  Users, 
  FileCheck2, 
  CreditCard, 
  PhoneCall, 
  Check, 
  AlertCircle, 
  Save, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileText
} from "lucide-react";
import { LegalAccount, CallLog, StatusPhase } from "@/lib/mockData";
import { getTodayShamsiString } from "@/lib/utils";

interface LegalRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: LegalAccount) => void;
  initialAccount?: LegalAccount | null;
  experts: string[];
  initialMode?: "initial_only" | "full_kyc";
}

const COMPANY_TYPES = [
  "سهامی خاص",
  "با مسئولیت محدود",
  "سهامی عام",
  "تضامنی",
  "دانش‌بنیان",
  "تعاونی",
  "موسسه غیرتجاری",
  "سایر"
];

const STATUS_PRESETS = [
  "در انتظار تکمیل فرم توسط کارشناس",
  "در انتظار تکمیل توسط کاربر",
  "ارسال ایمیل برای کاربر",
  "ارسال قرارداد نهایی برای کاربر",
  "سطح۲-ارسال برای خانم اسدی",
  "در پرروال ثبت شد",
  "تایید نهایی"
];

const CALL_OUTCOMES = [
  "پروفایل تکمیل می‌نماید",
  "درخواست تماس مجدد در زمانی دیگر",
  "انصراف از فعالیت در حوزه ارزدیجیتال",
  "تماس بی‌پاسخ",
  "خاموش / عدم دسترسی",
  "کاربر از طریق تماس ورودی/ چت راهنمایی شد"
];

const CALL_STATUSES = [
  "کاربر پاسخگو بود",
  "عدم پاسخگویی تماس",
  "دسترس نبودن / خاموش"
];

export default function LegalRegistrationModal({
  isOpen,
  onClose,
  onSave,
  initialAccount,
  experts,
  initialMode = "initial_only"
}: LegalRegistrationModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [mode, setMode] = useState<"initial_only" | "full_kyc">(initialMode);
  const [validationError, setValidationError] = useState<string>("");

  // Form Fields
  const [id, setId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState(COMPANY_TYPES[0]);
  const [nationalId, setNationalId] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [economicCode, setEconomicCode] = useState("");
  const [adminName, setAdminName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [expert, setExpert] = useState(experts[0] || "آیگین");
  const [prowal, setProwal] = useState("");
  const [date, setDate] = useState("1405/03/04");
  const [lastStatus, setLastStatus] = useState(STATUS_PRESETS[0]);
  const [phase, setPhase] = useState<StatusPhase>("initial");
  const [rejectionReason, setRejectionReason] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  // Signers & Governance
  const [signers, setSigners] = useState("");
  const [signersRules, setSignersRules] = useState("");

  // Legal Documents & Gazette
  const [newspaperNumber, setNewspaperNumber] = useState("");
  const [gazetteVerified, setGazetteVerified] = useState(false);
  const [hasStatute, setHasStatute] = useState(false);
  const [hasEstablishmentAd, setHasEstablishmentAd] = useState(false);
  const [hasBoardChanges, setHasBoardChanges] = useState(false);

  // Financial & Banking
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("بانک ملی ایران");

  // Wallex Contract Dates
  const [expertEmailSent, setExpertEmailSent] = useState("");
  const [userSignedEmailRecv, setUserSignedEmailRecv] = useState("");
  const [wallexSignedSent, setWallexSignedSent] = useState("");

  // Call Logs
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [newCallDate, setNewCallDate] = useState("1405/03/04");
  const [newCallExpert, setNewCallExpert] = useState(experts[0] || "آیگین");
  const [newCallStatus, setNewCallStatus] = useState(CALL_STATUSES[0]);
  const [newCallOutcome, setNewCallOutcome] = useState(CALL_OUTCOMES[0]);
  const [newCallInterval, setNewCallInterval] = useState("");

  // Auto-fill from initialAccount when opened
  useEffect(() => {
    if (!isOpen) return;

    const today = getTodayShamsiString() || "1405/03/04";
    setValidationError("");

    if (initialAccount) {
      setId(initialAccount.id || "");
      setCompanyName(initialAccount.companyName || "");
      setCompanyType(initialAccount.companyType || COMPANY_TYPES[0]);
      setNationalId(initialAccount.nationalId || "");
      setRegistrationNumber(initialAccount.registrationNumber || "");
      setEconomicCode(initialAccount.economicCode || "");
      setAdminName(initialAccount.adminName || "");
      setCompanyPhone(initialAccount.companyPhone || "");
      setCompanyAddress(initialAccount.companyAddress || "");
      setPostalCode(initialAccount.postalCode || "");
      setExpert(initialAccount.expert || experts[0]);
      setProwal(initialAccount.prowal || "");
      setDate(initialAccount.date || today);
      setLastStatus(initialAccount.lastStatus || STATUS_PRESETS[0]);
      setPhase(initialAccount.phase || "initial");
      setRejectionReason(initialAccount.rejectionReason || "");
      setProfileUrl(initialAccount.profileUrl || `https://admin.wallex.ir/user/${initialAccount.id}/legal-verification`);
      setSigners(initialAccount.signers || "");
      setSignersRules(initialAccount.signersRules || "");
      setNewspaperNumber(initialAccount.newspaperNumber || "");
      setGazetteVerified(!!initialAccount.gazetteVerified);
      setIban(initialAccount.iban || "");
      setBankName(initialAccount.bankName || "بانک ملی ایران");
      setExpertEmailSent(initialAccount.expertSignatureEmailSentDate || "");
      setUserSignedEmailRecv(initialAccount.userSignedEmailReceivedDate || "");
      setWallexSignedSent(initialAccount.wallexSignedContractSentDate || "");
      setCallLogs(initialAccount.callLogs || []);
      setMode(initialMode || "full_kyc");
      setActiveStep(1);
    } else {
      // New account defaults
      const randomUid = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setId(randomUid);
      setCompanyName("");
      setCompanyType(COMPANY_TYPES[0]);
      setNationalId("");
      setRegistrationNumber("");
      setEconomicCode("");
      setAdminName("");
      setCompanyPhone("");
      setCompanyAddress("");
      setPostalCode("");
      setExpert(experts[0] || "آیگین");
      setProwal("");
      setDate(today);
      setLastStatus("در انتظار تکمیل فرم توسط کارشناس");
      setPhase("initial");
      setRejectionReason("");
      setProfileUrl(`https://admin.wallex.ir/user/${randomUid}/legal-verification`);
      setSigners("");
      setSignersRules("");
      setNewspaperNumber("");
      setGazetteVerified(false);
      setHasStatute(false);
      setHasEstablishmentAd(false);
      setHasBoardChanges(false);
      setIban("");
      setBankName("بانک پاسارگاد");
      setExpertEmailSent("");
      setUserSignedEmailRecv("");
      setWallexSignedSent("");
      setCallLogs([]);
      setNewCallDate(today);
      setMode(initialMode);
      setActiveStep(1);
    }
  }, [isOpen, initialAccount, experts, initialMode]);

  // Sync profileUrl with ID
  const handleIdChange = (newId: string) => {
    setId(newId);
    if (newId.trim()) {
      setProfileUrl(`https://admin.wallex.ir/user/${newId.trim()}/legal-verification`);
    }
  };

  // Calculate KYC form completion percentage
  const calculateCompletion = () => {
    let score = 0;
    const totalWeights = 9;
    if (companyName.trim()) score++;
    if (id.trim()) score++;
    if (nationalId.trim()) score++;
    if (registrationNumber.trim() || economicCode.trim()) score++;
    if (adminName.trim()) score++;
    if (companyPhone.trim() || companyAddress.trim()) score++;
    if (signers.trim()) score++;
    if (gazetteVerified || newspaperNumber.trim()) score++;
    if (callLogs.length > 0 || expertEmailSent.trim() || phase === "approved") score++;
    return Math.round((score / totalWeights) * 100);
  };

  const handleAddCallLog = () => {
    if (!newCallOutcome.trim()) return;
    const newLog: CallLog = {
      date: newCallDate,
      expert: newCallExpert,
      status: newCallStatus,
      result: newCallOutcome,
      recallInterval: newCallInterval
    };
    setCallLogs([newLog, ...callLogs]);
    setNewCallInterval("");
  };

  const handleRemoveCallLog = (index: number) => {
    setCallLogs(callLogs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    if (!companyName.trim()) {
      setValidationError("لطفاً نام شرکت را وارد نمایید.");
      setActiveStep(1);
      return;
    }

    const finalId = id.trim() || (nationalId.trim() ? nationalId.trim() : String(Math.floor(1000000000 + Math.random() * 9000000000)));

    const completion = calculateCompletion();
    
    // Auto-derive phase if appropriate
    let calculatedPhase: StatusPhase = phase;
    if (wallexSignedSent.trim() || lastStatus.includes("تایید نهایی") || lastStatus.includes("سطح۲")) {
      calculatedPhase = "approved";
    } else if (completion > 60 || expertEmailSent.trim() || userSignedEmailRecv.trim()) {
      calculatedPhase = phase === "approved" ? "approved" : "processing";
    }

    const account: LegalAccount = {
      id: id.trim(),
      date,
      expert,
      lastStatus,
      phase: calculatedPhase,
      profileUrl: profileUrl.trim() || `https://admin.wallex.ir/user/${id.trim()}/legal-verification`,
      adminName: adminName.trim(),
      companyName: companyName.trim(),
      signers: signers.trim(),
      signersRules: signersRules.trim(),
      rejectionReason: rejectionReason.trim(),
      prowal: prowal.trim(),
      expertSignatureEmailSentDate: expertEmailSent,
      userSignedEmailReceivedDate: userSignedEmailRecv,
      wallexSignedContractSentDate: wallexSignedSent,
      callLogs,
      nationalId: nationalId.trim(),
      registrationNumber: registrationNumber.trim(),
      companyType,
      postalCode: postalCode.trim(),
      companyPhone: companyPhone.trim(),
      companyAddress: companyAddress.trim(),
      iban: iban.trim(),
      bankName: bankName.trim(),
      economicCode: economicCode.trim(),
      newspaperNumber: newspaperNumber.trim(),
      gazetteVerified,
      formCompletionPercentage: completion
    };

    onSave(account);
    onClose();
  };

  if (!isOpen) return null;

  const completionPct = calculateCompletion();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100 overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {initialAccount ? "تکمیل و ویرایش فرم حقوقی" : "ثبت اطلاعات اولیه حقوقی و ایجاد پرونده"}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                  دسترسی کارشناس حقوقی
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ورود اطلاعات ثبتی، استعلام صاحبان امضا و اعتبارسنجی احراز هویت شرکتی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Toggle Button */}
            <div className="hidden sm:flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("initial_only")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === "initial_only" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                ثبت اطلاعات اولیه
              </button>
              <button
                type="button"
                onClick={() => setMode("full_kyc")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  mode === "full_kyc" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs" 
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                تکمیل فرم کامل حقوقی (چندمرحله‌ای)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="بستن پنجره"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress & Completion Bar */}
        <div className="px-6 py-2.5 bg-slate-100/60 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">میزان تکمیل فرم حقوقی:</span>
            <div className="w-32 sm:w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  completionPct >= 80 ? "bg-emerald-500" : completionPct >= 40 ? "bg-purple-500" : "bg-blue-500"
                }`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="font-bold font-mono text-slate-700 dark:text-slate-300">{completionPct}%</span>
          </div>
        </div>

        {/* Step Indicator (Visible in full_kyc mode) */}
        {mode === "full_kyc" && (
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between overflow-x-auto gap-2">
            {[
              { num: 1, label: "۱. مشخصات ثبتی", icon: Building2 },
              { num: 2, label: "۲. صاحبان امضا", icon: Users },
              { num: 3, label: "۳. استعلام روزنامه و اسناد", icon: FileCheck2 },
            ].map(step => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-xs" 
                      : isPast
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                  {isPast && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* INITIAL ONLY MODE */}
          {mode === "initial_only" && (
            <div className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام شرکت *
                  </label>
                  <input
                    type="text"
                    placeholder="نام شرکت"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه ملی 11 رقمی
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="مثال: 14008923451"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نوع شرکت
                  </label>
                  <select
                    value={companyType}
                    onChange={e => setCompanyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {COMPANY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره ثبت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 543210"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام نماینده / ادمین اکانت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: علیرضا محمدی"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره موبایل شرکت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 09123456789"
                    value={companyPhone}
                    onChange={e => setCompanyPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کد پرووال (شناسه بیزاجی / تیکت)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 60234"
                    value={prowal}
                    onChange={e => setProwal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کارشناس حقوقی مسئول
                  </label>
                  <select
                    value={expert}
                    onChange={e => setExpert(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {experts.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاریخ ثبت شرکت
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وضعیت جاری پرونده
                </label>
                <select
                  value={lastStatus}
                  onChange={e => setLastStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {STATUS_PRESETS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 1: Company Profile & Registry */}
          {mode === "full_kyc" && activeStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>مشخصات پایه ثبتی و هویتی شرکت</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام شرکت *
                  </label>
                  <input
                    type="text"
                    placeholder="نام شرکت"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه ملی 11 رقمی
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="مثال: 10101234567"
                    value={nationalId}
                    onChange={e => setNationalId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نوع شرکت
                  </label>
                  <select
                    value={companyType}
                    onChange={e => setCompanyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {COMPANY_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره ثبت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 458921"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کد اقتصادی
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 411589234123"
                    value={economicCode}
                    onChange={e => setEconomicCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره ارتباطی شرکت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 021-88990011"
                    value={companyPhone}
                    onChange={e => setCompanyPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کدپستی
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="مثال: 1987654321"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    آدرس شرکت
                  </label>
                  <textarea
                    rows={2}
                    placeholder="استان، شهر، خیابان، پلاک، طبقه و واحد ثبتی"
                    value={companyAddress}
                    onChange={e => setCompanyAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Signers & Representatives */}
          {mode === "full_kyc" && activeStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>صاحبان امضای مجاز، مدیران و نماینده رابط</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام ادمین / نماینده رابط والکس *
                  </label>
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی نماینده ثبت‌نام کننده"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسامی صاحبان امضا  و سمت ها و کدملی
                  </label>
                  <textarea
                    rows={3}
                    placeholder="مثال: آقای حسین حسینی (مدیرعامل) و خانم فاطمه رضایی (رئیس هیئت مدیره)"
                    value={signers}
                    onChange={e => setSigners(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نحوه حق امضای تعهدآور شرکت
                  </label>
                  <input
                    type="text"
                    placeholder="نحوه حق امضای تعهدآور را تایپ کنید (مثال: متفقاً همراه با مهر شرکت)"
                    value={signersRules}
                    onChange={e => setSignersRules(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: Gazette & Documents */}
          {mode === "full_kyc" && activeStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>بررسی اسناد ثبتی و استعلام روزنامه رسمی</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاریخ آگهی آخرین روزنامه رسمی
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: روزنامه شماره ۲۲۳۴۵ مورخ ۱۴۰۲/۰۶/۱۵"
                    value={newspaperNumber}
                    onChange={e => setNewspaperNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2.5">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    وضعیت اسناد و استعلام‌های قانونی:
                  </p>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gazetteVerified}
                      onChange={e => setGazetteVerified(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">استعلام برخط روزنامه رسمی تایید شد</span>
                      <p className="text-slate-500 dark:text-slate-400">انطباق مشخصات شرکت با سامانه ثبت شرکت‌ها و روزنامه رسمی کشور</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasStatute}
                      onChange={e => setHasStatute(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">اساسنامه شرکت دریافت شد</span>
                      <p className="text-slate-500 dark:text-slate-400">بررسی موضوع فعالیت و صلاحیت قانونی شرکت</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBoardChanges}
                      onChange={e => setHasBoardChanges(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">آگهی آخرین تغییرات هیئت مدیره و حق امضا معتبر است</span>
                      <p className="text-slate-500 dark:text-slate-400">تاریخ اعتبار مدیریت هیئت مدیره منقضی نشده باشد</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation & Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>مشاهده پرونده در ادمین والکس</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {mode === "full_kyc" && activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>مرحله قبل</span>
              </button>
            )}

            {mode === "full_kyc" && activeStep < 3 && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 1 && !companyName.trim()) {
                    setValidationError("لطفاً نام شرکت را وارد فرمایید.");
                    return;
                  }
                  setValidationError("");
                  setActiveStep(prev => Math.min(3, prev + 1));
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>مرحله بعد</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{initialAccount ? "ذخیره تغییرات فرم حقوقی" : "تأیید و ثبت پرونده حقوقی"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
