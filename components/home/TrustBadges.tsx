import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above Rp 500K",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description: "100% authentic products",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
];

export default function TrustBadges() {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.title}
              className="flex items-center gap-3 bg-bg-card border border-border rounded-lg px-4 py-4"
            >
              <div className="bg-accent/10 p-2.5 rounded-full flex-shrink-0">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {badge.title}
                </h3>
                <p className="text-xs text-text-secondary">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
