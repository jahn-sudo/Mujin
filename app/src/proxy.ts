import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { Role } from "@/generated/prisma/enums";

// Route → minimum role required
const PROTECTED_ROUTES: Array<{ pattern: RegExp; roles: Role[] }> = [
  {
    pattern: /^\/api\/admin/,
    roles: [Role.STAFF, Role.ORG_ADMIN, Role.SUPER_ADMIN],
  },
  {
    pattern: /^\/api\/mentor/,
    roles: [Role.MENTOR, Role.STAFF, Role.ORG_ADMIN, Role.SUPER_ADMIN],
  },
  {
    pattern: /^\/api\/student/,
    roles: [Role.STUDENT, Role.STAFF, Role.ORG_ADMIN, Role.SUPER_ADMIN],
  },
];

// Routes that never require auth
const PUBLIC_ROUTES = [
  /^\/api\/auth\//,
  /^\/_next\//,
  /^\/favicon/,
  /^\/$/,
  /^\/login/,
  /^\/activate/,
  /^\/dashboard/, // page auth handled client-side
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((r) => r.test(pathname))) {
    return NextResponse.next();
  }

  const match = PROTECTED_ROUTES.find((r) => r.pattern.test(pathname));
  if (!match) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyAccessToken(token);

    if (!match.roles.includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Forward identity to route handlers via headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.sub);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-org-id", payload.orgId);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
