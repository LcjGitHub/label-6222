import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "期号列表", icon: BookOpen, end: true },
  { to: "/overview", label: "数据概览", icon: LayoutDashboard },
  { to: "/designers", label: "设计师汇总", icon: Users },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm">封面字体研究</span>
        </NavLink>
        <ul className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
