import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";
import { PUBLIC_ROUTES } from "./lib/constants";

const intlMiddleware = createMiddleware(routing);

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.endsWith(route) ||
        pathname.includes(`${route}/`)
    ) ||
    pathname === "/" ||
    routing.locales.some((locale) => pathname === `/${locale}`)
  );
}

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first (handles locale routing)
  const intlResponse = intlMiddleware(request);

  // 2. Run Supabase session refresh on the intl response
  const { user, response } = await updateSession(request, intlResponse);

  const pathname = request.nextUrl.pathname;

  // 3. Auth guards
  if (!user && !isPublicRoute(pathname)) {
    const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
    const loginUrl = new URL(
      locale ? `/${locale}/login` : "/login",
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  const isLandingPage =
    pathname === "/" ||
    routing.locales.some((locale) => pathname === `/${locale}`);

  const isResetPassword = pathname.includes("/reset-password");

  if (user && isPublicRoute(pathname) && !isLandingPage && !isResetPassword) {
    const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
    const isClient = user.user_metadata?.role === "client";
    const homeUrl = new URL(
      locale
        ? `/${locale}/${isClient ? "my-routine" : "dashboard"}`
        : isClient
          ? "/my-routine"
          : "/dashboard",
      request.url
    );
    return NextResponse.redirect(homeUrl);
  }

  // 4. Role-based route protection
  if (user) {
    const role = user.user_metadata?.role;
    const isClient = role === "client";
    const isAdmin = role === "admin";
    const isAdminRoute = pathname.includes("/admin");
    const isTrainerRoute =
      pathname.includes("/dashboard") ||
      pathname.includes("/clients") ||
      pathname.includes("/exercises") ||
      pathname.includes("/routines") ||
      pathname.includes("/nutrition") ||
      pathname.includes("/messages") ||
      pathname.includes("/settings") ||
      pathname.includes("/templates") ||
      pathname.includes("/analytics") ||
      pathname.includes("/blocks") ||
      pathname.includes("/questionnaires") ||
      pathname.includes("/service-tiers") ||
      pathname.includes("/coaching-plans") ||
      pathname.includes("/calendar");
    const isClientRoute =
      pathname.includes("/my-routine") ||
      pathname.includes("/my-nutrition") ||
      pathname.includes("/my-progress") ||
      pathname.includes("/my-messages") ||
      pathname.includes("/my-profile") ||
      pathname.includes("/my-measurements");

    // Admin routes: only admins (admins can also access trainer routes)
    if (isAdminRoute && !isAdmin) {
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
      const redirect = isClient ? "my-routine" : "dashboard";
      return NextResponse.redirect(
        new URL(locale ? `/${locale}/${redirect}` : `/${redirect}`, request.url)
      );
    }

    if (isClient && isTrainerRoute) {
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
      return NextResponse.redirect(
        new URL(locale ? `/${locale}/my-routine` : "/my-routine", request.url)
      );
    }

    if (!isClient && isClientRoute) {
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}`));
      return NextResponse.redirect(
        new URL(locale ? `/${locale}/dashboard` : "/dashboard", request.url)
      );
    }
  }

  return response;
}

export const config = {
  // Excluye `auth` porque /auth/callback es un route handler fuera de [locale];
  // sin esto next-intl lo reescribe a /es/auth/callback (que no existe) y devuelve 404.
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
