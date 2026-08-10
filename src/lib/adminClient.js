import { base44 } from "@/api/base44Client";

const ADMIN_PWD_KEY = "admin_pwd";

// sessionStorage keeps the unlock for the tab session (survives refresh,
// clears when the tab closes).
export function getAdminPwd() {
  try {
    return sessionStorage.getItem(ADMIN_PWD_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminPwd(pwd) {
  try {
    sessionStorage.setItem(ADMIN_PWD_KEY, pwd);
  } catch {
    /* ignore */
  }
}

export function clearAdminPwd() {
  try {
    sessionStorage.removeItem(ADMIN_PWD_KEY);
  } catch {
    /* ignore */
  }
}

// Routes admin create/update/delete through the password-protected backend
// function (service role), so RLS stays intact and the password never ships
// to the client.
export async function adminMutate(payload) {
  const res = await base44.functions.invoke("adminMutate", payload);
  if (res?.data?.error) throw new Error(res.data.error);
  return res?.data;
}