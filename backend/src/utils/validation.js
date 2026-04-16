import { z } from "zod";

const LIMITS = {
    NAME_MIN: 20,
    NAME_MAX: 60,
    ADDRESS_MAX: 400,
    PASS_MIN: 8,
    PASS_MAX: 16,
};

export const signupSchema = z.object({
    name: z.string().min(LIMITS.NAME_MIN).max(LIMITS.NAME_MAX),
    email: z.string().email(),
    address: z.string().max(LIMITS.ADDRESS_MAX),
    password: z
        .string()
        .min(LIMITS.PASS_MIN)
        .max(LIMITS.PASS_MAX)
        .regex(/[A-Z]/, "Must have one uppercase")
        .regex(/[!@#$%^&*]/, "Must have one special character"),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
