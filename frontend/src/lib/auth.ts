import { User } from "@/types/user";

export const saveSession = (token: string, user: User) => {
  localStorage.setItem("lms_token", token);
  localStorage.setItem("lms_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("lms_token");
  localStorage.removeItem("lms_user");
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("lms_user");
  return raw ? JSON.parse(raw) : null;
};
