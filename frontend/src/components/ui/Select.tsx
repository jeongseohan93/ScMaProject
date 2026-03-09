
type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
};

export default function Select({
  name,
  value,
  onChange,
  options,
  placeholder,
}: Props) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white
                 outline-none border border-white/10 focus:border-white/30"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
