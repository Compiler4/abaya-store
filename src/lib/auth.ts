import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

/**
 * ✅ USER PAYLOAD TYPE (IMPORTANT)
 */
export type UserPayload = JwtPayload & {
  id: number;
  email?: string;
  role: "user" | "admin";
};

/**
 * 🔐 SIGN TOKEN
 */
export function signToken(user: UserPayload) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    SECRET,
    { expiresIn: "1d" }
  );
}

/**
 * 🔍 VERIFY TOKEN (TYPE SAFE)
 */
export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, SECRET) as UserPayload;
}