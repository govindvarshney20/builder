"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/daily-challenge", label: "Daily Challenge", icon: "⚡" },
  { href: "/ai-pm-module", label: "AI PM Mastery", icon: "🤖" },
  { href: "/skills-radar", label: "Skills Radar", icon: "🎯" },
  { href: "/interview-prep", label: "Interview Prep", icon: "💼" },
  { href: "/teardowns", label: "Product Teardowns", icon: "🔍" },
  { href: "/case-snacks", label: "Case Snacks", icon: "🍿" },
  { href: "/frameworks", label: "Frameworks", icon: "🧩" },
  { href: "/glossary", label: "PM Glossary", icon: "📖" },
  { href: "/templates", label: "Templates Hub", icon: "📝" },
  { href: "/learning-path", label: "Learning Path", icon: "🗺️" },
  { href: "/news", label: "News & Trends", icon: "📰" },
  { href: "/pm-quiz", label: "PM Type Quiz", icon: "🎭" },
  { href: "/scorecard", label: "Scorecard", icon: "🏆" },
  { href: "/mentor", label: "AI Mentor", icon: "💬" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-border rounded-lg p-2 shadow-md"
      >
        <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-border z-40 transition-all duration-300 flex flex-col
          ${collapsed ? "w-[68px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-border flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold gradient-text">Katalyst</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <span className="text-2xl">⚡</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-muted hover:text-foreground transition-colors text-sm"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-primary/10 text-primary-dark"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted text-center">
              Built with Katalyst
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
