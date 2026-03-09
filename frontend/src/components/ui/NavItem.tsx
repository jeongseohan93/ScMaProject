type Props = {
  label: string;
};

export default function NavItem({ label }: Props) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-white/85 hover:bg-white/5 transition"
    >
      <span className="h-6 w-6 rounded-lg bg-white/10 border border-white/10" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
