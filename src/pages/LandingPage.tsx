import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { 
  Zap, Recycle, TrendingUp, Truck, Brain, BarChart3, 
  ArrowRight, Leaf, Factory, Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: 2.01, suffix: "B", label: "Tons of waste generated annually", decimals: 2 },
  { value: 33, suffix: "%", label: "Of global waste is mismanaged", decimals: 0 },
  { value: 400, suffix: "M", label: "Tons could become energy", decimals: 0 },
  { value: 70, suffix: "%", label: "Reduction possible with AI", decimals: 0 },
];

const features = [
  { icon: Brain, title: "AI Waste Classification", desc: "Computer vision identifies waste types instantly with 95%+ accuracy" },
  { icon: Zap, title: "Energy Prediction", desc: "ML models predict energy output from waste composition in real-time" },
  { icon: Truck, title: "Route Optimization", desc: "AI-powered routing reduces fuel costs by 30% and emissions significantly" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time monitoring of waste streams, energy generation, and CO₂ reduction" },
  { icon: Factory, title: "Landfill Forecasting", desc: "Predict overflow risks and methane emissions before they become critical" },
  { icon: Globe, title: "Sustainability Reports", desc: "Automated compliance reports and carbon reduction tracking" },
];

const steps = [
  { num: "01", title: "Collect & Classify", desc: "IoT sensors and AI classify waste at source automatically", icon: Recycle },
  { num: "02", title: "Analyze & Predict", desc: "ML models analyze waste streams and predict energy potential", icon: TrendingUp },
  { num: "03", title: "Optimize & Convert", desc: "Smart routing and conversion maximize energy recovery", icon: Zap },
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Smart city waste-to-energy" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-20" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Leaf className="w-4 h-4" />
              AI-Powered Waste Intelligence
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
              Transform Waste Into{" "}
              <span className="gradient-text">Energy Intelligence</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              EcoVolt combines AI, IoT, and data analytics to optimize waste collection, 
              predict energy generation, and build sustainable smart cities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gradient-primary text-primary-foreground font-semibold px-8 h-12 text-base hover:opacity-90 transition-opacity">
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/classification">
                <Button size="lg" variant="outline" className="border-primary/30 text-foreground h-12 text-base hover:bg-primary/10">
                  Upload Waste Data
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <StatCard key={i} {...stat} delay={i * 0.1} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Intelligent Waste Management
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Six powerful AI modules working together to transform how cities handle waste
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <AnimatedSection key={i}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-6 h-full hover:glow-border transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">How EcoVolt Works</h2>
            <p className="text-muted-foreground text-lg">Three steps to smarter waste-to-energy conversion</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={i}>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl glass-card glow-border flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-primary font-display font-bold text-sm">{step.num}</span>
                  <h3 className="font-display text-xl font-semibold mt-2 mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Ready to Power the Future with Waste?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join smart cities worldwide using EcoVolt to turn waste into clean energy.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold px-10 h-12 text-base">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">EcoVolt</span>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              Building a sustainable future through intelligent waste-to-energy solutions.
            </p>
            <p className="text-muted-foreground text-xs">© 2026 EcoVolt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, suffix, label, decimals, delay }: { value: number; suffix: string; label: string; decimals: number; delay: number }) {
  const [ref, inView] = useInView({ triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="font-display text-4xl sm:text-5xl font-bold text-primary mb-2">
        {inView && <CountUp end={value} duration={2.5} decimals={decimals} />}
        {suffix}
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </motion.div>
  );
}
