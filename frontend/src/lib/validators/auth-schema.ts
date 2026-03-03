import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, "아이디 또는 이메일을 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const registerSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  confirmPassword: z.string(),
  name: z.string().min(1, "이름을 입력해주세요."),
  nickname: z.string().optional(),
  phoneNumber: z.string().optional(),
  birth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().or(z.literal("")),
  agreeTerms: z.boolean().refine((val) => val === true, "약관에 동의해야 합니다."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;