import type { InputHTMLAttributes } from "react";

/**
 * 리액트 기본 input 속성을 그대로 가져옴
 */
type Props = InputHTMLAttributes<HTMLInputElement>;

/**
 * 전역에서 돌려 쓰는 공통 텍스트 입력창.
 * @param className - 밖에서 추가로 줄 여백이나 커스텀 스타일
 * @param props - 나머지 모든 input 속성 (value, onChange, placeholder 등) 주머니
 */
export default function TextInput( { className = "", ...props}: Props ) {
    return (
        <input
            // 스타일이 길어지니까 배열에 넣고 공백(" ")으로 합쳐서 관리 (가독성 때문임)
            className={[
                "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white", // 기본 모양 & 색상
                "placeholder-white/40 outline-none border border-white/10", // 플레이스홀더 & 테두리
                "focus:border-white/30", // 마우스 클릭(포커스) 했을 때 강조 효과
                className, // 밖에서 추가로 넘겨준 스타일 합치기
            ].join(" ")}
            {...props} // 남은 속성들(type, placeholder 등)
        />
    );
}