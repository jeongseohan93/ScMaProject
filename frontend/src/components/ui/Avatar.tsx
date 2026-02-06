type Props = {
  size?: number;
  className?: string;
};

export default function Avatar({ size = 40, className = "" }: Props) {
  return (
    <div
      className={`rounded-full bg-white/10 border border-white/10 ${className}`}
      style={{ width: size, height: size }}
      aria-label="avatar placeholder"
    />
  );
}
