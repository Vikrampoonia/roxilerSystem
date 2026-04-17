import { z } from "zod";
import constants from "../constant/constants.js";
import messages from "../constant/message.js";

const EMAIL_REGEX = constants.regex.EMAIL;

export const signupSchema = z.object({
    name: z.string().min(constants.limits.NAME_MIN, messages.validation.nameTooShort).max(constants.limits.NAME_MAX, messages.validation.nameTooLong),
    email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid),
    address: z.string().max(constants.limits.ADDRESS_MAX, messages.validation.addressTooLong),
    password: z
        .string()
        .min(constants.limits.PASS_MIN, messages.validation.passwordTooShort)
        .max(constants.limits.PASS_MAX, messages.validation.passwordTooLong)
        .regex(constants.regex.PASSWORD_UPPERCASE, messages.validation.passwordUppercase)
        .regex(constants.regex.PASSWORD_SPECIAL, messages.validation.passwordSpecial),
});

export const loginSchema = z.object({
    email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid),
    password: z.string().min(1),
});

export const createUserSchema = z.object({
    name: z.string().min(constants.limits.NAME_MIN, messages.validation.nameTooShort).max(constants.limits.NAME_MAX, messages.validation.nameTooLong),
    email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid),
    address: z.string().max(constants.limits.ADDRESS_MAX, messages.validation.addressTooLong),
    password: z
        .string()
        .min(constants.limits.PASS_MIN, messages.validation.passwordTooShort)
        .max(constants.limits.PASS_MAX, messages.validation.passwordTooLong)
        .regex(constants.regex.PASSWORD_UPPERCASE, messages.validation.passwordUppercase)
        .regex(constants.regex.PASSWORD_SPECIAL, messages.validation.passwordSpecial),
    role: z.enum([constants.roles.systemAdministrator, constants.roles.normalUser, constants.roles.storeOwner]).optional().default(constants.roles.normalUser),
});

export const getUserFilterSchema = z
    .object({
        name: z.string().optional(),
        email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid).optional(),
        address: z.string().optional(),
        role: z.enum([constants.roles.systemAdministrator, constants.roles.normalUser, constants.roles.storeOwner]).optional(),
        page: z.coerce.number().int().min(1).optional(),
        pageLimit: z.coerce.number().int().min(10).max(100).optional(),
        sortBy: z.enum(["name", "email"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional();

export const getUserByIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const addRatingSchema = z.object({
    store_id: z.coerce.number().int().positive(),
    rating_value: z.coerce.number().int().min(1).max(5),
});

export const updateRatingSchema = z.object({
    store_id: z.coerce.number().int().positive(),
    rating_value: z.coerce.number().int().min(1).max(5),
});

export const getStoreForUserFilterSchema = z
    .object({
        name: z.string().optional(),
        address: z.string().optional(),
        page: z.coerce.number().int().min(1).optional(),
        pageLimit: z.coerce.number().int().min(10).max(100).optional(),
        sortBy: z.enum(["name"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional();

export const storeRatingsSummaryFilterSchema = z
    .object({
        page: z.coerce.number().int().min(1).optional(),
        pageLimit: z.coerce.number().int().min(10).max(100).optional(),
        sortBy: z.enum(["name", "email"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional();

export const createStoreSchema = z.object({
    name: z.string().min(1).max(60),
    email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid),
    address: z.string().max(constants.limits.ADDRESS_MAX, messages.validation.addressTooLong),
    owner_email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid),
});

export const getStoreFilterSchema = z
    .object({
        name: z.string().optional(),
        email: z.string().regex(EMAIL_REGEX, messages.validation.emailInvalid).optional(),
        address: z.string().optional(),
        page: z.coerce.number().int().min(1).optional(),
        pageLimit: z.coerce.number().int().min(10).max(100).optional(),
        sortBy: z.enum(["name", "email"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
    })
    .optional();

export const updateProfileSchema = z.object({
    name: z.string().min(constants.limits.NAME_MIN, messages.validation.nameTooShort).max(constants.limits.NAME_MAX, messages.validation.nameTooLong).optional(),
    address: z.string().max(constants.limits.ADDRESS_MAX, messages.validation.addressTooLong).optional(),
    password: z
        .string()
        .min(constants.limits.PASS_MIN, messages.validation.passwordTooShort)
        .max(constants.limits.PASS_MAX, messages.validation.passwordTooLong)
        .regex(constants.regex.PASSWORD_UPPERCASE, messages.validation.passwordUppercase)
        .regex(constants.regex.PASSWORD_SPECIAL, messages.validation.passwordSpecial)
        .optional(),
}).refine((data) => data.name || data.address || data.password, {
    message: messages.validation.atLeastOneFieldRequired,
});
