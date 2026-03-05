import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Zap, BarChart3, Map, Brain, FileText, Leaf, 
  Menu, X, TrendingUp, AlertTriangle, Settings, User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Home", icon: Zap },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/classification", label: "Classification", icon: Brain },
  { path: "/energy-prediction", label: "Energy", icon: TrendingUp },
  { path: "/route-optimization", label: "Routes", icon: Map },
  { path: "/landfill-forecast", label: "Landfill", icon: AlertTriangle },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Eco<span className="text-primary">Volt</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {user ? (
                <Link to="/settings" className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="ml-2 px-4 py-1.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
                  Sign In
                </Link>
              )}
            </div>

            <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-border/50">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <span className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                {!user && (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-primary">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
