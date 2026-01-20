import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDesc = url.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}&desc=${encodeURIComponent(errorDesc ?? "")}`, url.origin)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const appUrl = process.env.APP_URL!;
  const domain = process.env.COGNITO_DOMAIN!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const redirectUri = `${appUrl}/auth/callback`;

  const cookieHeader = req.headers.get("cookie") ?? "";

  const getCookie = (name: string) => {
    const m = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  const expectedState = getCookie("oauth_state");
  const codeVerifier = getCookie("pkce_verifier");

  if (!expectedState || expectedState !== state || !codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=state_mismatch", url.origin));
  }

  const tokenUrl = `https://${domain}/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    const txt = await tokenRes.text();
    return NextResponse.redirect(
      new URL(`/login?error=token_exchange_failed&detail=${encodeURIComponent(txt)}`, url.origin)
    );
  }

  const tokens = (await tokenRes.json()) as {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  const res = NextResponse.redirect(new URL("/", url.origin));

  const secure = process.env.NODE_ENV === "production";

  if (tokens.access_token) {
    res.cookies.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in ?? 3600,
    });
  }

  if (tokens.id_token) {
    res.cookies.set("id_token", tokens.id_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in ?? 3600,
    });
  }

  if (tokens.refresh_token) {
    res.cookies.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
  }

  res.cookies.set("pkce_verifier", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });

  return res;
}
