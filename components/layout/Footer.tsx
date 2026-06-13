import Link from "next/link";
import { Package } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Cement & Mortar", href: "/categories/cement-mortar" },
    { label: "Bricks & Blocks", href: "/categories/bricks-blocks" },
    { label: "Lumber & Plywood", href: "/categories/lumber-plywood" },
    { label: "Tools & Hardware", href: "/categories/tools-hardware" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Store Locator", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "#" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Bulk Orders", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-[var(--max-width-site,1200px)] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6" />
              <span className="text-lg font-bold">BuildMart</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              Your trusted partner for building materials and construction tools.
              Quality products at the best prices.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3 uppercase tracking-wide text-white/90">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} BuildMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
