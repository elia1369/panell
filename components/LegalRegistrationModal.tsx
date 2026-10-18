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
  const [signersRules, setSignersRules] = useState("متفقاً همراه با مهر شرکت");

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
    const totalWeights = 10;
    if (companyName.trim()) score++;
    if (id.trim()) score++;
    if (nationalId.trim()) score++;
    if (registrationNumber.trim() || economicCode.trim()) score++;
    if (adminName.trim()) score++;
    if (companyPhone.trim() || companyAddress.trim()) score++;
    if (signers.trim()) score++;
    if (gazetteVerified || newspaperNumber.trim()) score++;
    if (iban.trim()) score++;
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
      setValidationError("لطفاً نام رسمی شرکت یا موسسه حقوقی را وارد نمایید.");
      setActiveStep(1);
      return;
    }
    if (!id.trim()) {
      setValidationError("لطفاً شناسه کاربری (UID) را وارد نمایید.");
      setActiveStep(1);
      return;
    }

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

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>شناسه کاربری (UID):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{id || "---"}</span>
          </div>
        </div>

        {/* Step Indicator (Visible in full_kyc mode) */}
        {mode === "full_kyc" && (
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between overflow-x-auto gap-2">
            {[
              { num: 1, label: "۱. مشخصات ثبتی", icon: Building2 },
              { num: 2, label: "۲. صاحبان امضا", icon: Users },
              { num: 3, label: "۳. استعلام روزنامه و اسناد", icon: FileCheck2 },
              { num: 4, label: "۴. شبا و حساب شرکتی", icon: CreditCard },
              { num: 5, label: "۵. قرارداد و پیگیری تماس", icon: PhoneCall },
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

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* INITIAL ONLY MODE */}
          {mode === "initial_only" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ثبت اولیه اطلاعات شخص حقوقی</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    این فرم برای ایجاد سریع پرونده و ثبت اطلاعات اولیه شخص حقوقی در سیستم طراحی شده است. پس از ثبت اولیه، می‌توانید فرم جامع حقوقی را نیز تکمیل فرمایید.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام رسمی شرکت / موسسه ثبتی *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شرکت تجارت الکترونیک نوین سهامی خاص"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه کاربری والکس (UID) *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 1247401530"
                    value={id}
                    onChange={e => handleIdChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه ملی ۱۱ رقمی شرکت
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
                    شماره ثبت شرکت
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
                    شماره تماس رابط یا شرکت
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 02188776655 یا 09123456789"
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
                    تاریخ ثبت پرونده (شمسی)
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

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setMode("full_kyc")}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <span>مایل به تکمیل بخش‌های بیشتر (صاحبان امضا، اسناد، شبا) هستید؟ ادامه به فرم کامل</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
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
                    نام کامل شرکت در اساسنامه / روزنامه رسمی *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شرکت فناوری پردازش نوین سهامی خاص"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه کاربری والکس (UID) *
                  </label>
                  <input
                    type="text"
                    value={id}
                    onChange={e => handleIdChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شناسه ملی ۱۱ رقمی اشخاص حقوقی
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
                    شماره ثبت در اداره ثبت شرکت‌ها
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
                    کد اقتصادی ۱۲ رقمی
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
                    شماره تلفن ثابت دفتر مرکزی
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
                    کد پستی ۱۰ رقمی اقامتگاه قانونی
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
                    نشانی ثبتی دقیق مطابق با آخرین روزنامه رسمی
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
                    اسامی صاحبان امضای مجاز و سمت‌ها
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
                  <select
                    value={signersRules}
                    onChange={e => setSignersRules(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="متفقاً همراه با مهر شرکت">متفقاً همراه با مهر شرکت (حداقل دو امضا)</option>
                    <option value="منفرداً توسط مدیرعامل با مهر شرکت">منفرداً توسط مدیرعامل با مهر شرکت</option>
                    <option value="امضای مدیرعامل به همراه یکی از اعضای هیئت مدیره">امضای مدیرعامل به همراه یکی از اعضای هیئت مدیره</option>
                    <option value="امضای کلیه صاحبان امضا">امضای کلیه صاحبان امضا</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">نکته احراز هویت والکس:</p>
                  <p className="mt-1">
                    صاحبان امضا باید دارای حساب کاربری تایید شده در والکس بوده یا مدارک شناسایی معتبر (کارت ملی هوشمند و شناسنامه) ارائه دهند.
                  </p>
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
                    شماره و تاریخ آخرین آگهی روزنامه رسمی
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

          {/* STEP 4: Banking & Financial */}
          {mode === "full_kyc" && activeStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>حساب بانکی و شماره شبای حقوقی شرکت</span>
              </h3>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <p className="font-bold">قانون تطابق نام بانکی:</p>
                <p className="mt-0.5">
                  واریز و برداشت ریالی تنها از طریق شماره شبایی امکان‌پذیر است که دقیقاً به نام شخصیت حقوقی (شرکت) افتتاح شده باشد. حساب‌های شخصی اعضا قابل پذیرش نیست.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره شبای حقوقی (IR)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={26}
                      placeholder="IR000000000000000000000000"
                      value={iban}
                      onChange={e => setIban(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-blue-500 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    بانک عامل
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: بانک ملت شعبه مرکزی"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    وضعیت استعلام شبا با شناسه ملی
                  </label>
                  <div className="flex items-center gap-2 h-11 px-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>تطبیق خودکار با شناسه ملی فعال است</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Contract Dates & Call Logs */}
          {mode === "full_kyc" && activeStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                <span>وضعیت قرارداد والکس، گردش کار و لاگ تماس‌ها</span>
              </h3>

              {/* Status and Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    آخرین وضعیت پرونده
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    فاز کلی پیشرفت
                  </label>
                  <select
                    value={phase}
                    onChange={e => setPhase(e.target.value as StatusPhase)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="initial">اطلاعات اولیه / پیش‌نویس</option>
                    <option value="processing">نزدیک تایید / در حال پیگیری</option>
                    <option value="approved">تایید نهایی شده (سطح ۲)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    توضیحات تکمیلی یا علت عدم تایید / نواقص
                  </label>
                  <textarea
                    rows={2}
                    placeholder="در صورت وجود نقص مدارک، علت دقیق را جهت اطلاع کاربر یا سایر کارشناسان یادداشت نمایید."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Contract dates */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>تاریخ‌های چرخه قرارداد حقوقی والکس</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      ارسال ایمیل جهت امضای قرارداد
                    </label>
                    <input
                      type="text"
                      placeholder="۱۴۰۲/۰۲/۱۵"
                      value={expertEmailSent}
                      onChange={e => setExpertEmailSent(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      دریافت ایمیل امضا شده از کاربر
                    </label>
                    <input
                      type="text"
                      placeholder="۱۴۰۲/۰۲/۱۸"
                      value={userSignedEmailRecv}
                      onChange={e => setUserSignedEmailRecv(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      ارسال نسخه قرارداد امضا شده والکس
                    </label>
                    <input
                      type="text"
                      placeholder="۱۴۰۲/۰۲/۲۰"
                      value={wallexSignedSent}
                      onChange={e => setWallexSignedSent(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Call Logs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    ثبت تماس جدید با کاربر / نماینده حقوقی:
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono">
                    تعداد کل تماس‌های ثبت‌شده: {callLogs.length}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">تاریخ تماس</label>
                    <input
                      type="text"
                      value={newCallDate}
                      onChange={e => setNewCallDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">کارشناس تماس</label>
                    <select
                      value={newCallExpert}
                      onChange={e => setNewCallExpert(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      {experts.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">وضعیت تماس</label>
                    <select
                      value={newCallStatus}
                      onChange={e => setNewCallStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      {CALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">نتیجه تماس</label>
                    <select
                      value={newCallOutcome}
                      onChange={e => setNewCallOutcome(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      {CALL_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCallLog}
                    className="h-8.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>افزودن تماس</span>
                  </button>
                </div>

                {/* Call Log List */}
                {callLogs.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {callLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500">{log.date}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{log.expert}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {log.status}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">{log.result}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCallLog(idx)}
                          className="text-red-500 hover:text-red-700 p-1 text-xs cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

            {mode === "full_kyc" && activeStep < 5 && (
              <button
                type="button"
                onClick={() => {
                  if (activeStep === 1 && !companyName.trim()) {
                    setValidationError("لطفاً نام شرکت را وارد فرمایید.");
                    return;
                  }
                  setValidationError("");
                  setActiveStep(prev => Math.min(5, prev + 1));
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
