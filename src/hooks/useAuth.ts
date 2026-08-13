"use client";

import { useEffect, useState } from "react";
import { readStoredJson } from "@/lib/safe-storage";

type StoredUser = Record<string, unknown>;

export function useAuth() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = readStoredJson<StoredUser | null>("user", null, {
      clearInvalid: true,
    });

    if (storedUser && typeof storedUser === "object") {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  return { user, loading };
}
