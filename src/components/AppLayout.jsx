import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Home as HomeIcon, LayoutGrid, Shield, LogOut, Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => logout();

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon, end: true },
    { to: "/matrix", label: "Availability Matrix", icon: LayoutGrid, end: false },
    ...(isAdmin ? [{ to: "/admin", label: "Admin Panel", icon: Shield, end: false }] : []),
  ];

  const NavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  const UserCard = () => (
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
          {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{user?.full_name || "Member"}</div>
          <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {isAdmin ? "Admin" : user?.can_edit_units ? "Editor" : "Viewer"}
        </span>
        <Button variant="ghost" size="sm" className="ml-auto h-7 px-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl z-30">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold tracking-tight leading-none">UnitMatrix</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Availability</div>
          </div>
        </div>
        <div className="flex-1 py-4">
          <NavList />
        </div>
        <UserCard />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">UnitMatrix</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r border-border flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 py-4">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
            <UserCard />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="md:pl-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}