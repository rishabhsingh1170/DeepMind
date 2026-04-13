export default function ActionButton({
  icon: Icon,
  label,
  active,
  onClick,
  tone = "indigo",
}) {
  const toneClasses =
    tone === "red"
      ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        : tone === "amber"
          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${toneClasses} ${active ? "ring-2 ring-indigo-500" : ""}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
