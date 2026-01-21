import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const runtime = "nodejs";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export async function POST(req: NextRequest) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const otpSession = req.cookies.get("otp_session")?.value;
  const otpEmail = req.cookies.get("otp_email")?.value;

  if (!otpSession || !otpEmail) {
    return NextResponse.json({ error: "missing_otp_session" }, { status: 400 });
  }

  const clientId = process.env.COGNITO_CLIENT_ID!;
  const secure = process.env.NODE_ENV === "production";

  // Responde ao desafio EMAIL_OTP com o código recebido por e-mail
  const out = await client.send(
    new RespondToAuthChallengeCommand({
      ClientId: clientId,
      ChallengeName: "EMAIL_OTP",
      Session: otpSession,
      ChallengeResponses: {
        USERNAME: otpEmail,
        EMAIL_OTP_CODE: code, // chave do OTP por e-mail
      },
    })
  ); // :contentReference[oaicite:1]{index=1}

  const tokens = out.AuthenticationResult;

  if (!tokens?.AccessToken || !tokens?.IdToken) {
    return NextResponse.json({ error: "no_tokens_returned" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, redirectTo: "/feed" });

  res.cookies.set("access_token", tokens.AccessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.ExpiresIn ?? 3600,
  });

  res.cookies.set("id_token", tokens.IdToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: tokens.ExpiresIn ?? 3600,
  });

  if (tokens.RefreshToken) {
    res.cookies.set("refresh_token", tokens.RefreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 dias
    });
  }

  // limpa cookies temporários do OTP
  res.cookies.set("otp_session", "", { path: "/", maxAge: 0 });
  res.cookies.set("otp_email", "", { path: "/", maxAge: 0 });

  return res;
}
