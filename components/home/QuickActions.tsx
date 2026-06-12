import { ClipboardList, Truck, ScrollText, FileText } from "lucide-react";
import Link from "next/link";

const actions = [
  { label: "Track Order", icon: Truck, href: "#" },
  { label: "Bulk Quote", icon: ClipboardList, href: "#" },
  { label: "Invoices", icon: FileText, href: "#" },
  { label: "Send Feedback", icon: ScrollText, href: "#" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 bg-bg-card border border-border rounded-lg px-4 py-3 hover:shadow-card-hover hover:border-primary/20 transition-all duration-200"
          >
            <div className="bg-primary-light p-2 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
