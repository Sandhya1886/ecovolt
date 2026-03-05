import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building2, LogOut, Shield, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const typeLabels = { municipality: "Municipality", citizen: "Citizen", company: "Company" };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Profile Information
          </h3>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Type</p>
                  <p className="text-sm font-medium text-foreground">{typeLabels[user.userType]}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Please sign in to view your profile.</p>
          )}
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h3>
          <div className="space-y-3">
            {["Overflow alerts", "Daily collection summary", "Energy production reports"].map((item, i) => (
              <label key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary cursor-pointer">
                <span className="text-sm text-foreground">{item}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Security
          </h3>
          <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-secondary mb-3">
            Change Password
          </Button>
          <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
