import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ className = "", ...props }: Props) {
  return (
    <input
      className={[
        "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white",
        "placeholder-white/40 outline-none border border-white/10",
        "focus:border-white/30",
        className,
      ].join(" ")}
      {...props}
    />
  );
}