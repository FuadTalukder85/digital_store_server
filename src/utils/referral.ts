import crypto from "crypto";

export function generateReferralCode(name = "user"): string {
  const base = name.replace(/\s+/g, "").toLowerCase().slice(0, 6) || "user";
  const suffix = crypto.randomBytes(2).toString("hex");
  return `${base}${suffix}`;
}
