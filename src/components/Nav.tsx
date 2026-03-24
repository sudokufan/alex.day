import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "about" },
  { to: "/projects", label: "projects" },
  { to: "/writing", label: "writing" },
  { to: "/now", label: "now" },
  { to: "/top", label: "top" },
  { to: "/uses", label: "uses" },
  { to: "/stats", label: "stats" },
];

export default function Nav() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-12 border-b border-parchment">
      <Link
        to="/"
        className="font-serif text-xl text-ink hover:text-accent transition-colors duration-200"
      >
        alex.day
      </Link>
      <nav className="flex flex-wrap gap-x-5 gap-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `font-sans text-sm transition-colors duration-200 ${
                isActive
                  ? "text-ink underline underline-offset-4 decoration-accent"
                  : "text-stone hover:text-ink"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
