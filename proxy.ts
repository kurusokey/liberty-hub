import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === "dca.sampapaya.com") {
    const url = request.nextUrl.clone();
    if (!url.pathname.startsWith("/dca")) {
      url.pathname = `/dca${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
