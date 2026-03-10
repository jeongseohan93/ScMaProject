import type { ButtonHTMLAttributes } from "react";

/**
 * 리액트 기본 버튼 속성에 스타일을 합친 타입
 * 이렇게 해두면 onClick, type 같은 기본 기능을 따로 정의 안해도 됨
 */
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline";
} 

/**
 * 프로젝트 전역에서 돌려 쓰는 공통 버튼
 * @param variant - 버튼 디자인 (기본값은 파란색 primary)
 * @param className - 외부에서 추가로 줄 여백이나 커스텀 스타일
 * @param props - 나머지 모든 버튼 속성 (onClick, disabled 등)을 담은 주머니
 */
export default function Button({
    variant = "primary",
    className = "",
    ...props // variant랑 className 빼고 남은 모든 속성을 여기에 싹 모음
}: Props) {
    // 모든 버튼에 공통으로 들어가는 기본 모양
    const base = "inline-flex justify-center items-center rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

    // variant 값에 따라 색상만 스위칭
    const styles = 
        variant === "primary"
      ? "bg-blue-600 hover:bg-blue-500 text-white" // 직접 "outline"이라고 안 하면 무조건 이거임
      : "border border-white/15 hover:bg-white/5 text-white";

    return <button className={`${base} ${styles} ${className}`} {...props} />;
}