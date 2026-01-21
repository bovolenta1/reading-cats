type JwtPayload = Record<string, unknown>;

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1];
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export type UserFromToken = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

export function getUserFromIdToken(idToken: string): UserFromToken | null {
  const p = decodeJwtPayload(idToken);
  if (!p) return null;

  return {
    sub: typeof p.sub === "string" ? p.sub : undefined,
    email: typeof p.email === "string" ? p.email : undefined,
    name:
      typeof p.name === "string"
        ? p.name
        : typeof p.given_name === "string"
          ? `${p.given_name}${typeof p.family_name === "string" ? ` ${p.family_name}` : ""}`
          : undefined,
    picture: typeof p.picture === "string" ? p.picture : undefined,
  };
}
