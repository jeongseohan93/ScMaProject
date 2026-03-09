type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div className={`rounded-xl bg-white/5 border border-white/10 ${className}`}>
      {children}
    </div>
  );
}