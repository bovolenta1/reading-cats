import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function newState() {
  return crypto.randomBytes(16).toString("hex");
}

export async function GET() {
  const appUrl = process.env.APP_URL!;
  const domain = process.env.COGNITO_DOMAIN!;
  const clientId = process.env.COGNITO_CLIENT_ID!;

  // PKCE
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");

  const state = newState();

  const redirectUri = `${appUrl}/auth/callback`;

  const authorizeUrl = new URL(`https://${domain}/oauth2/authorize`);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);

  authorizeUrl.searchParams.set("identity_provider", "Google");

  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(authorizeUrl.toString());

  const cookieBase = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 10 * 60,
  };

  res.cookies.set("pkce_verifier", codeVerifier, cookieBase);
  res.cookies.set("oauth_state", state, cookieBase);

  return res;
}
