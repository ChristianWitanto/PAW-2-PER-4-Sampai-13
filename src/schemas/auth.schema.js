import z from "zod";

const passwordSchema = z
.string().trim().min(8, "Password Minimal 8 Karakter")
.refine((value) => Buffer.byteLength(value, 'utf-8') <= 72, {
    error: "password maksimal 72 byte UTF-8"
})


export const registerSchema = z.object({
    name : z.string().trim().min(3,"Minimal 3 Karakter"),
    email : z.email(),
    password : passwordSchema
})

export const loginSchema = z.object({
    email : z.email(),
    password : passwordSchema
})
