import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, User, Building2, Users, Briefcase, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const userTypes = [
  { value: "municipality" as const, label: "Municipality", icon: Building2, desc: "City or government body" },
  { value: "citizen" as const, label: "Citizen", icon: Users, desc: "Individual user" },
  { value: "company" as const, label: "Company", icon: Briefcase, desc: "Waste management firm" },
];

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"municipality" | "citizen" | "company">("citizen");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, name: name || email.split("@")[0], userType });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isSignup ? "Join EcoVolt and start managing waste intelligently" : "Sign in to your EcoVolt dashboard"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label className="text-muted-foreground text-sm">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-secondary border-border" />
                </div>
              </div>
            )}

            <div>
              <Label className="text-muted-foreground text-sm">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-secondary border-border" required />
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground text-sm">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-secondary border-border" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <Label className="text-muted-foreground text-sm mb-2 block">User Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {userTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setUserType(t.value)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        userType === t.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <t.icon className={`w-5 h-5 mx-auto mb-1 ${userType === t.value ? "text-primary" : ""}`} />
                      <p className="text-xs font-medium">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11">
              {isSignup ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-5 text-center">
            <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-primary hover:underline">
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
