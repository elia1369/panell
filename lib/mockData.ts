import { RAW_WALLEX_CSV } from "./rawCsv";

export interface CallLog {
  date: string; // تاریخ تماس خروجی
  expert: string; // نام کارشناس تماس خروجی
  status: string; // وضعیت تماس (کاربر پاسخگو بود، عدم پاسخگویی و...)
  result: string; // نتیجه تماس
  recallInterval: string; // اعلام بازه زمانی برای تماس مجدد
}

export type StatusPhase = 'initial' | 'processing' | 'approved';

export interface LegalAccount {
  id: string; // شناسه یکتا یا کد کاربر از URL
  date: string; // تاریخ ثبت پرونده
  expert: string; // کارشناس پرونده
  lastStatus: string; // آخرین وضعیت
  phase: StatusPhase; // فاز رنگی محصول (سفید: اطلاعات اولیه، آبی: نزدیک تایید، سبز: تایید نهایی)
  profileUrl: string; // لینک پروفایل ادمین
  adminName: string; // نام ادمین
  companyName: string; // نام شرکت
  signers: string; // نام صاحبین امضا
  rejectionReason: string; // دلیل عدم تایید یا توضیحات تکمیلی
  prowal: string; // پرووال (شناسه تیکت یا بیزاجی)
  expertSignatureEmailSentDate: string; // تاریخ ارسال ایمیل جهت امضا قرارداد توسط کارشناس
  userSignedEmailReceivedDate: string; // تاریخ دریافت ایمیل امضا شده از طرف کاربر
  wallexSignedContractSentDate: string; // تاریخ ارسال نسخه قرارداد امضا شده (والکس) برای کاربر
  callLogs: CallLog[]; // لیست تماس‌های خروجی پیگیری
  // فیلدهای تکمیلی فرم احراز هویت حقوقی
  nationalId?: string; // شناسه ملی ۱۱ رقمی شرکت
  registrationNumber?: string; // شماره ثبت شرکت
  companyType?: string; // نوع شرکت: سهامی خاص، با مسئولیت محدود، سهامی عام، دانش‌بنیان، تعاونی، سایر
  postalCode?: string; // کد پستی ۱۰ رقمی
  companyPhone?: string; // شماره تماس ثابت شرکت
  companyAddress?: string; // آدرس رسمی ثبت شده در روزنامه رسمی
  iban?: string; // شماره شبای حساب حقوقی بانکی
  bankName?: string; // نام بانک عامل
  economicCode?: string; // کد اقتصادی
  newspaperNumber?: string; // شماره و تاریخ آخرین روزنامه رسمی
  gazetteVerified?: boolean; // استعلام روزنامه رسمی تایید شده
  formCompletionPercentage?: number; // درصد تکمیل فرم حقوقی
}

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function normalizeSolarDate(dateStr: string): string {
  if (!dateStr) return "";
  const cleaned = dateStr.trim().replace(/[\.\-]/g, "/");
  const parts = cleaned.split("/");
  if (parts.length !== 3) return cleaned;
  const y = parts[0];
  const m = parts[1].padStart(2, "0");
  const d = parts[2].padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export function parseWallexCsv(): LegalAccount[] {
  const lines = RAW_WALLEX_CSV.trim().split("\n");
  if (lines.length <= 1) return [];

  const accounts: LegalAccount[] = [];
  const seenIds = new Map<string, number>();

  // skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCsvLine(line);
    const date = normalizeSolarDate(row[0] || "");
    const expert = row[1]?.trim() || "آیگین";
    const lastStatus = row[2]?.trim() || "در انتظار تکمیل توسط کاربر";
    const profileUrl = row[3]?.trim() || "";
    const adminName = row[4]?.trim() || "";
    const companyName = row[5]?.trim() || "";
    const signers = row[6]?.trim() || "";
    const rejectionReason = row[7]?.trim() || "";
    const prowal = row[8]?.trim() || "";
    const expertSignatureEmailSentDate = normalizeSolarDate(row[9] || "");
    const userSignedEmailReceivedDate = normalizeSolarDate(row[10] || "");
    const wallexSignedContractSentDate = normalizeSolarDate(row[11] || "");

    const callLogs: CallLog[] = [];
    for (let j = 12; j < row.length; j += 5) {
      const logDateRaw = row[j];
      const logExpertRaw = row[j + 1];
      const logStatusRaw = row[j + 2];
      const logResultRaw = row[j + 3];
      const logRecallRaw = row[j + 4];

      if (logDateRaw || logStatusRaw || logResultRaw) {
        callLogs.push({
          date: normalizeSolarDate(logDateRaw || ""),
          expert: logExpertRaw?.trim() || "",
          status: logStatusRaw?.trim() || "",
          result: logResultRaw?.trim() || "",
          recallInterval: logRecallRaw?.trim() || ""
        });
      }
    }

    // Skip helper row if it has nothing meaningful
    if (!companyName && !adminName && !profileUrl && !lastStatus) {
      continue;
    }

    // Determine ID from URL: e.g. https://admin.wallex.ir/user/1247401530/legal-verification -> 1247401530
    let id = "";
    const match = profileUrl.match(/\/user\/(\d+)/);
    if (match) {
      id = match[1];
    } else if (prowal && /^\d+$/.test(prowal)) {
      id = prowal;
    } else {
      // Generate stable numeric ID fallback based on company name
      let hash = 0;
      const str = companyName || adminName || "user";
      for (let k = 0; k < str.length; k++) {
        hash = (hash << 5) - hash + str.charCodeAt(k);
        hash |= 0;
      }
      id = Math.abs(hash).toString();
    }

    // Resolve duplicates safely so every record has an absolutely unique react key
    if (seenIds.has(id)) {
      const count = seenIds.get(id)! + 1;
      seenIds.set(id, count);
      id = `${id}_${count}`;
    } else {
      seenIds.set(id, 1);
    }

    // Classify progress phases intelligently (سفید: اطلاعات اولیه، آبی: نزدیک تایید، سبز: تایید نهایی)
    let phase: StatusPhase = "initial";
    const statusLower = lastStatus.toLowerCase();
    
    if (
      statusLower.includes("تایید نهایی") || 
      statusLower.includes("سطح 2") || 
      statusLower.includes("سطح۲") || 
      statusLower.includes("اسدی") || 
      wallexSignedContractSentDate || 
      userSignedEmailReceivedDate
    ) {
      phase = "approved";
    } else if (
      statusLower.includes("ارسال ایمیل") || 
      statusLower.includes("ارسال قرارداد") || 
      statusLower.includes("پیگیری")
    ) {
      phase = "processing";
    }

    accounts.push({
      id,
      date,
      expert,
      lastStatus,
      phase,
      profileUrl,
      adminName,
      companyName,
      signers,
      rejectionReason,
      prowal,
      expertSignatureEmailSentDate,
      userSignedEmailReceivedDate,
      wallexSignedContractSentDate,
      callLogs
    });
  }

  return accounts;
}

export const INITIAL_LEGAL_ACCOUNTS: LegalAccount[] = parseWallexCsv();
