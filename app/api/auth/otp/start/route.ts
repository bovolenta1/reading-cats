import { NextRequest, NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const runtime = "nodejs";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
  }

  const clientId = process.env.COGNITO_CLIENT_ID!;
  const secure = process.env.NODE_ENV === "production";

  // 1) Inicia o flow choice-based (USER_AUTH)
  const init = await client.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
      },
    })
  );

  // 2) Pede pra usar EMAIL_OTP
  const selected = await client.send(
    new RespondToAuthChallengeCommand({
      ClientId: clientId,
      ChallengeName: "SELECT_CHALLENGE",
      Session: init.Session,
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: "EMAIL_OTP",
      },
    })
  );

  // Guardar session + email por poucos minutos
  const res = NextResponse.json({ ok: true });

  res.cookies.set("otp_session", selected.Session ?? "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 3 * 60, // 3 min
  });

  res.cookies.set("otp_email", email, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 3 * 60,
  });

  return res;
}
