interface BadgeProps {
  variant?: "sale" | "new" | "best" | "eco" | "out-of-stock" | "low-stock";
  children: React.ReactNode;
}

const badgeStyles = {
  sale: "bg-secondary text-white",
  new: "bg-accent text-white",
  best: "bg-warning text-white",
  eco: "bg-accent text-white",
  "out-of-stock": "bg-error text-white",
  "low-stock": "bg-warning text-white",
};

export default function Badge({ variant = "sale", children }: BadgeProps) {
  return (
    <span
      className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
}
