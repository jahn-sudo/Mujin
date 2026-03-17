export interface AuthSession {
  userId: string;
  orgId: string;
  role: string;
  token: string;
}

const KEY = "mujin_session";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  session?: AuthSession | null
): Promise<Response> {
  const s = session ?? loadSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (s?.token) {
    headers["Authorization"] = `Bearer ${s.token}`;
  }
  return fetch(path, { ...options, headers });
}
