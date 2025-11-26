"use client";

import { Briefcase, FolderOpen, Home, PanelLeft, PanelLeftClose, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Assets", href: "/dashboard/assets", icon: FolderOpen },
  { name: "Projects", href: "/dashboard/projects", icon: Briefcase },
  { name: "Tools", href: "/dashboard/tools", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`${isCollapsed ? "w-16" : "w-64"
        } bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300`}
    >
      <div className={`${isCollapsed ? "px-3" : "px-6"} py-8 flex items-center justify-between transition-all`}>
        {!isCollapsed && <h1 className="text-xl font-semibold text-gray-900">Many Social</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft size={18} className="text-gray-600" />
          ) : (
            <PanelLeftClose size={18} className="text-gray-600" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
                    } px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                      ? "bg-[#2563eb] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                  title={isCollapsed ? item.name : ""}
                >
                  <Icon size={18} strokeWidth={2} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
