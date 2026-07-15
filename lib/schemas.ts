import { z } from "zod";

// ─── Reusable primitives ───────────────────────────────────────────────────────

const mongoId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");

const sanitizedString = (min = 0, max = 200) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .transform((val) => val.replace(/<[^>]*>/g, ""));

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  fullname: sanitizedString(2, 100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number"),
  gender: z.enum(["male", "female", "other", ""]).optional(),
});

export const LoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// ─── OTP ──────────────────────────────────────────────────────────────────────

export const OtpSendSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
});

export const OtpVerifySchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  code: z
    .string()
    .trim()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must be numeric"),
});

// ─── User Setup ───────────────────────────────────────────────────────────────

export const UserSetupSchema = z.object({
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
    .optional(),
  country: sanitizedString(0, 100).optional(),
  occupation: sanitizedString(0, 100).optional(),
  currency: z.string().trim().min(1, "Currency is required"),
  spend_limit: z.number().min(0, "Spend limit cannot be negative").optional(),
});

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const CreateWalletSchema = z.object({
  name: sanitizedString(1, 80),
  balance: z.number().min(0, "Initial balance cannot be negative"),
  description: sanitizedString(0, 300).optional(),
  currencyId: mongoId,
});

export const UpdateWalletSchema = z
  .object({
    name: sanitizedString(1, 80).optional(),
    description: sanitizedString(0, 300).optional(),
    currencyId: mongoId.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ─── Transactions ─────────────────────────────────────────────────────────────

export const TRANSACTION_CATEGORIES = [
  "food",
  "transport",
  "salary",
  "entertainment",
  "health",
  "shopping",
  "bills",
  "education",
  "savings",
  "other",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const CreateTransactionSchema = z.object({
  title: sanitizedString(1, 120),
  quantity: z.number().positive("Quantity must be greater than 0"),
  description: sanitizedString(0, 500).optional(),
  date: z.coerce.date(),
  walletId: mongoId,
  type: z.enum(["income", "expense"]),
  category: z.enum(TRANSACTION_CATEGORIES).optional(),
});

// ─── Profile ──────────────────────────────────────────────────────────────────

export const UpdateProfileSchema = z
  .object({
    fullname: sanitizedString(2, 100).optional(),
    username: z
      .string()
      .trim()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/)
      .optional(),
    country: sanitizedString(0, 100).optional(),
    description: sanitizedString(0, 500).optional(),
    occupation: sanitizedString(0, 100).optional(),
    profile_photo: z.string().url("Invalid URL").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ─── Preferences ──────────────────────────────────────────────────────────────

export const UpdatePreferencesSchema = z
  .object({
    show_alerts: z.boolean().optional(),
    auto_report: z.boolean().optional(),
    mask_balance: z.boolean().optional(),
    spend_limit: z.number().min(0).optional(),
    baseCurrency: z.string().trim().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one preference must be provided",
  });
