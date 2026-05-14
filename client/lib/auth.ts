const ADMIN_AUTH_KEY = "admin-authenticated";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export function isAdminAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function loginAdmin(password: string) {
  if (password === adminPassword) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }

  return false;
}

export function logoutAdmin() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_AUTH_KEY);
}
