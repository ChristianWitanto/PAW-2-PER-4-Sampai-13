import z from "zod";


const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Format email tidak valid'))

const passwordSchema = z
.string().trim().min(8, "Password Minimal 8 Karakter")
.refine((value) => Buffer.byteLength(value, 'utf-8') <= 72, {
    error: "password maksimal 72 byte UTF-8"
})


export const registerSchema = z.object({
    name : z.string().trim().min(3,"Minimal 3 Karakter"),
    email : emailSchema,
    password : passwordSchema
})

export const loginSchema = z.object({
    email : emailSchema,
    password : passwordSchema
})
