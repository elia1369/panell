"use client";

export type RoleType = "specialist" | "management";

export interface AuthUser {
  username: string; // e.g. "a.sedigh", "q.khodaei", "h.jaliliani"
  displayUsername: string; // e.g. "a.sedigh", "Q.Khodaei", "H.Jaliliani"
  aliases?: string[]; // e.g. ["q.khodayi"]
  password: string; // default "wallex"
  fullName: string;
  role: RoleType;
  title: string;
  avatarInitial: string;
  lastPasswordChange?: string;
  mustChangePassword?: boolean;
}

// Exactly matching the user's requested staff members and tasks:
export const DEFAULT_USERS: AuthUser[] = [
  // 1. کارشناس حقوقی (Legal Specialists)
  {
    username: "a.sedigh",
    displayUsername: "a.sedigh",
    password: "wallex",
    fullName: "آیگین صدیق",
    role: "specialist",
    title: "کارشناس حقوقی",
    avatarInitial: "ص",
    mustChangePassword: true,
  },
  {
    username: "q.khodaei",
    displayUsername: "Q.Khodaei",
    aliases: ["q.khodayi", "Q.Khodayi"],
    password: "wallex",
    fullName: "غزل خدائی",
    role: "specialist",
    title: "کارشناس حقوقی",
    avatarInitial: "خ",
    mustChangePassword: true,
  },
  {
    username: "a.fazeli",
    displayUsername: "a.fazeli",
    password: "wallex",
    fullName: "اسما فاضلی",
    role: "specialist",
    title: "کارشناس حقوقی",
    avatarInitial: "ف",
    mustChangePassword: true,
  },

  // 2. بررسی و نظارت مدیریت (Management & Oversight)
  {
    username: "h.jaliliani",
    displayUsername: "H.Jaliliani",
    password: "wallex",
    fullName: "حامد جلیلیانی",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ج",
    mustChangePassword: true,
  },
  {
    username: "m.jafari",
    displayUsername: "M.Jafari",
    password: "wallex",
    fullName: "مهدیه جعفری",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ج",
    mustChangePassword: true,
  },
  {
    username: "h.ebadi",
    displayUsername: "H.Ebadi",
    password: "wallex",
    fullName: "حامد عبادی",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ع",
    mustChangePassword: true,
  },
  {
    username: "d.eskandari",
    displayUsername: "D.Eskandari",
    aliases: ["d. eskandari", "D. Eskandari"],
    password: "wallex",
    fullName: "دریا اسکندری",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ا",
    mustChangePassword: true,
  },
  {
    username: "s.maleki",
    displayUsername: "S.Maleki",
    password: "wallex",
    fullName: "سعید ملکی",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "م",
    mustChangePassword: true,
  },
  {
    username: "r.yousefi",
    displayUsername: "R.Yousefi",
    password: "wallex",
    fullName: "رضا یوسفی",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ی",
    mustChangePassword: true,
  },
  {
    username: "s.rouzbehi",
    displayUsername: "S.Rouzbehi",
    password: "wallex",
    fullName: "سبحان روزبهی",
    role: "management",
    title: "بررسی و نظارت مدیریت",
    avatarInitial: "ر",
    mustChangePassword: true,
  },
];

const STORAGE_USERS_KEY = "wallex_auth_users_v4_rbac";
const STORAGE_CURRENT_USER_KEY = "wallex_auth_current_user_v4_rbac";

function normalizeUsername(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, "");
}

function matchesUser(u: AuthUser, cleanInput: string): boolean {
  if (normalizeUsername(u.username) === cleanInput) return true;
  if (normalizeUsername(u.displayUsername) === cleanInput) return true;
  if (u.aliases && u.aliases.some(a => normalizeUsername(a) === cleanInput)) return true;
  return false;
}

export function getStoredUsers(): AuthUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  } else {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function authenticateUser(usernameInput: string, passwordInput: string): { success: boolean; user?: AuthUser; error?: string } {
  const users = getStoredUsers();
  const cleanInput = normalizeUsername(usernameInput);

  const user = users.find(u => matchesUser(u, cleanInput));
  if (!user) {
    return { success: false, error: "نام کاربری وارد شده در سامانه وجود ندارد." };
  }

  if (user.password !== passwordInput) {
    return { success: false, error: "رمز عبور وارد شده نادرست است." };
  }

  saveCurrentUser(user);
  return { success: true, user };
}

export function changeUserPassword(username: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const cleanInput = normalizeUsername(username);
  const userIndex = users.findIndex(u => matchesUser(u, cleanInput));

  if (userIndex === -1) {
    return { success: false, error: "کاربر مورد نظر یافت نشد." };
  }

  const user = users[userIndex];
  if (user.password !== currentPassword) {
    return { success: false, error: "رمز عبور فعلی وارد شده نادرست است." };
  }

  if (newPassword.length < 4) {
    return { success: false, error: "رمز عبور جدید باید حداقل ۴ کاراکتر باشد." };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: "رمز عبور جدید نمی‌تواند مشابه رمز عبور فعلی باشد." };
  }

  const updatedUser: AuthUser = {
    ...user,
    password: newPassword,
    lastPasswordChange: new Date().toLocaleDateString("fa-IR"),
    mustChangePassword: false,
  };

  users[userIndex] = updatedUser;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }
  saveCurrentUser(updatedUser);

  return { success: true };
}

export function logoutUser() {
  saveCurrentUser(null);
}
