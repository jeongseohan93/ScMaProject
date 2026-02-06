type Props = {
  ariaLabel: string;
  children?: React.ReactNode;
  className?: string;
};

export default function IconButton({ ariaLabel, children, className = "" }: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={[
        "h-9 w-9 rounded-full bg-white/5 border border-white/10",
        "hover:bg-white/10 transition inline-flex items-center justify-center",
        className,
      ].join(" ")}
    >
      {children ?? <span className="h-4 w-4 rounded bg-white/20" />}
    </button>
  );
}
