import { z } from 'zod';

/**
 * 로그인 시 필요한 최소한의 검증
 */
export const loginSchema = z.object({
    email: z.string().min(1, "아이디 또는 이메일을 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
});

/**
 * 회원가입 전체 폼 검증
 * 필수값 체크부터 비밀번호 일치 여부까지 한 번에 처리
 */
export const registerSchema = z.object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    confirmPassword: z.string(),
    name: z.string().min(1, "이름을 입력해주세요."),
    nickname: z.string().optional(), // optional: 비어 있어도 괜찮다는 
    phoneNumber: z.string().optional(),
    birth: z.string().optional(),
    // 선택 사항이비난 빈 문자열("")이 들어와도 에러 안 나게 처리
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().or(z.literal("")),

    // 약관 동의 체크
    // boolean 타입이라도 반드시 true여야만 통과시키도록 커스텀 검증 적용
    agreeTerms: z.boolean().refine((val) => val === true, "약관에 동의해야 합니다."),
        })
        // 비밀번호 일치 확인
        // password와 confirmPassword　두 필드를 비교해야 하므로 객체 전체를 훑는 refine 사용
        .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"], // 에러 메시지를 '비밀번호 확인' 입력칸 밑에 띄우도록 위치 지정
})

/**
 * 회원가입 폼 데이터 타입(Zod 스키마에서 자동 추출)\
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * 로그인 폼 데이터 타입 (Zod 스키마에서 자동 추출)
 */
export type LoginInput = z.infer<typeof loginSchema>;