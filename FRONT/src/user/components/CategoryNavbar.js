

import { Link, useLocation } from "react-router-dom";

const categories = [
  { label: "All", value: "all" },
  { label: "Smartphones", value: "smartphones" },
  { label: "Tablets", value: "tablets" },
  { label: "Smartwatches", value: "smartwatches" },
  { label: "Headphones", value: "headphones" },
  { label: "Chargers", value: "chargers" },
  { label: "Power Banks", value: "power banks" },
  { label: "Speakers", value: "speakers" },
];

export default function CategoryNavbar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category") || "all";

  return (
<div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-md border-b py-2 px-6 flex gap-6 overflow-x-auto sticky top-[72px] z-30">
{categories.map((cat) => (
        <Link
          key={cat.value}
          to={`/products?category=${cat.value}`}
          className={`whitespace-nowrap font-semibold px-3 py-1 rounded-md text-sm transition-all duration-300 ${
            activeCategory === cat.value
              ? "bg-white text-emerald-600 shadow-lg scale-105"
              : "text-white/90 hover:bg-white/20"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
