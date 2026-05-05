import jwt from "jsonwebtoken";

export function getUserFromToken() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}