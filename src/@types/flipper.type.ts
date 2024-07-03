import { z } from 'zod'

export const loginPostArgSchema = z.object({
  login: z.string(),
  password: z.string()
})

export type LoginPostArg = z.infer<typeof loginPostArgSchema>
export type UserMapping = LoginPostArg

export const jwtUserSchema = z.object({
  login: z.string().min(1, 'Login cannot be empty')
})

export type JwtUser = z.infer<typeof jwtUserSchema>

export type PostArgs = LoginPostArg
