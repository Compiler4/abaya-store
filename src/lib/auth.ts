<<<<<<< HEAD
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

/**
 * ✅ USER PAYLOAD TYPE (IMPORTANT)
 */
export type UserPayload = JwtPayload & {
  id: number;
  email?: string;
  role: string;
};

/**
 * 🔐 SIGN TOKEN
 */
export function signToken(user: UserPayload) {
=======
import jwt, { type JwtPayload } from "jsonwebtoken";

const TOKEN_ISSUER = "rify-luxe-abaya";
const TOKEN_AUDIENCE = "rify-store";

export type UserPayload = JwtPayload & {
  id: number;
  email: string;
  role: string;
};

export class AuthConfigurationError extends Error {
  constructor() {
    super(
      "JWT_SECRET is not configured. Add it to .env.local or your hosting environment."
    );
    this.name = "AuthConfigurationError";
  }
}

function getJwtSecret() {
  const secret =
    process.env.JWT_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new AuthConfigurationError();
  }

  return secret;
}

export function assertAuthConfigured() {
  getJwtSecret();
}

export function signToken(user: Pick<UserPayload, "id" | "email" | "role">) {
>>>>>>> 2090a59 (new changes)
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
<<<<<<< HEAD
    SECRET,
    { expiresIn: "1d" }
  );
}

/**
 * 🔍 VERIFY TOKEN (TYPE SAFE)
 */
export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, SECRET) as UserPayload;
=======
    getJwtSecret(),
    {
      algorithm: "HS256",
      audience: TOKEN_AUDIENCE,
      expiresIn: "1d",
      issuer: TOKEN_ISSUER,
    }
  );
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
    audience: TOKEN_AUDIENCE,
    issuer: TOKEN_ISSUER,
  }) as UserPayload;
>>>>>>> 2090a59 (new changes)
}
