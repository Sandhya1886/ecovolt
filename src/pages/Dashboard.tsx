import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Truck, Leaf, TrendingDown, Gauge, PieChart as PieIcon,
  BarChart3, LineChart as LineIcon, Activity, ChevronDown,
} from "lucide-react";
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import WasteMap, { WasteLocation } from "@/components/WasteMap";

const widgets = [
  { label: "Waste Collected Today", value: "847", unit: "tons", icon: Leaf, change: "+12%" },
  { label: "Predicted Energy Output", value: "198,400", unit: "kWh", icon: Zap, change: "+8%" },
  { label: "CO₂ Emissions Reduced", value: "124", unit: "tons", icon: TrendingDown, change: "+15%" },
  { label: "Active Collection Trucks", value: "32", unit: "active", icon: Truck, change: "94%" },
  { label: "Landfill Capacity", value: "67", unit: "%", icon: Gauge, change: "-2%" },
];

const wasteTypes = [
  { name: "Organic", value: 38, color: "hsl(160, 84%, 39%)" },
  { name: "Plastic", value: 24, color: "hsl(200, 80%, 50%)" },
  { name: "Metal", value: 14, color: "hsl(38, 92%, 50%)" },
  { name: "Glass", value: 12, color: "hsl(280, 60%, 55%)" },
  { name: "E-waste", value: 12, color: "hsl(0, 72%, 50%)" },
];

const dailyWaste = [
  { day: "Mon", organic: 120, plastic: 80, metal: 40, glass: 30, ewaste: 25 },
  { day: "Tue", organic: 135, plastic: 75, metal: 45, glass: 35, ewaste: 20 },
  { day: "Wed", organic: 110, plastic: 90, metal: 38, glass: 28, ewaste: 30 },
  { day: "Thu", organic: 145, plastic: 85, metal: 50, glass: 32, ewaste: 22 },
  { day: "Fri", organic: 160, plastic: 95, metal: 42, glass: 38, ewaste: 28 },
  { day: "Sat", organic: 90, plastic: 60, metal: 30, glass: 20, ewaste: 15 },
  { day: "Sun", organic: 80, plastic: 50, metal: 25, glass: 18, ewaste: 12 },
];

const energyForecast = [
  { month: "Jan", actual: 180000, predicted: 175000 },
  { month: "Feb", actual: 195000, predicted: 190000 },
  { month: "Mar", actual: 210000, predicted: 215000 },
  { month: "Apr", actual: 198000, predicted: 205000 },
  { month: "May", actual: 225000, predicted: 220000 },
  { month: "Jun", actual: null, predicted: 235000 },
  { month: "Jul", actual: null, predicted: 245000 },
];

const carbonData = [
  { week: "W1", reduced: 28 }, { week: "W2", reduced: 32 },
  { week: "W3", reduced: 27 }, { week: "W4", reduced: 35 },
  { week: "W5", reduced: 40 }, { week: "W6", reduced: 38 },
  { week: "W7", reduced: 42 }, { week: "W8", reduced: 45 },
];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", color: "hsl(var(--foreground))", fontSize: 13 },
  labelStyle: { color: "hsl(var(--muted-foreground))" },
};

const mapLocations: WasteLocation[] = [
  { lat: 28.6139, lng: 77.209, name: "Central Delhi Hub", wasteType: "Mixed", quantity: 120 },
  { lat: 28.6329, lng: 77.2195, name: "Connaught Place Zone", wasteType: "Plastic", quantity: 45 },
  { lat: 28.5922, lng: 77.2315, name: "South Delhi Sector", wasteType: "Organic", quantity: 85 },
  { lat: 28.6353, lng: 77.2250, name: "Karol Bagh Market", wasteType: "E-waste", quantity: 18 },
  { lat: 28.6508, lng: 77.2310, name: "Civil Lines", wasteType: "Metal", quantity: 32 },
  { lat: 28.6100, lng: 77.2300, name: "Lodhi Colony", wasteType: "Glass", quantity: 22 },
  { lat: 28.5800, lng: 77.2100, name: "Saket Area", wasteType: "Organic", quantity: 65 },
];

const heatPoints = [
  { lat: 28.6139, lng: 77.209, intensity: 0.9 },
  { lat: 28.6329, lng: 77.2195, intensity: 0.5 },
  { lat: 28.5922, lng: 77.2315, intensity: 0.7 },
  { lat: 28.6508, lng: 77.2310, intensity: 0.3 },
  { lat: 28.5800, lng: 77.2100, intensity: 0.6 },
  { lat: 28.6250, lng: 77.1900, intensity: 0.4 },
  { lat: 28.6400, lng: 77.2400, intensity: 0.8 },
];

type SectionId = "distribution" | "daily" | "energy" | "carbon";

const sections: { id: SectionId; title: string; desc: string; icon: typeof PieIcon }[] = [
  { id: "distribution", title: "Waste Distribution", desc: "Breakdown of collected waste by material category", icon: PieIcon },
  { id: "daily", title: "Daily Waste Generation", desc: "Weekly trend of waste collected across all categories", icon: Activity },
  { id: "energy", title: "Energy Generation Forecast", desc: "Actual vs predicted energy output by month", icon: BarChart3 },
  { id: "carbon", title: "Carbon Reduction Tracker", desc: "Weekly CO₂ emissions reduced through waste-to-energy", icon: LineIcon },
];

export default function Dashboard() {
  const [expanded, setExpanded] = useState<SectionId | null>(null);

  const toggle = (id: SectionId) => setExpanded(expanded === id ? null : id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time waste-to-energy analytics</p>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {widgets.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <w.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary">{w.change}</span>
            </div>
            <div className="font-display text-2xl font-bold text-foreground">{w.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{w.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Map */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-2xl border border-border bg-card p-5 mb-6 shadow-sm">
        <h3 className="font-display font-semibold text-foreground mb-1">Waste Collection Heatmap</h3>
        <p className="text-xs text-muted-foreground mb-4">Click markers for waste type and quantity details</p>
        <WasteMap locations={mapLocations} heatPoints={heatPoints} height="360px" />
        <div className="flex flex-wrap gap-4 mt-4">
          {["Organic", "Plastic", "Metal", "Glass", "E-waste", "Mixed"].map((t) => {
            const colors: Record<string, string> = { Organic: "#10b981", Plastic: "#3b82f6", Metal: "#f59e0b", Glass: "#8b5cf6", "E-waste": "#ef4444", Mixed: "#6b7280" };
            return (
              <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ background: colors[t] }} />
                {t}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Accordion Chart Sections */}
      <div className="space-y-3">
        {sections.map((section, i) => {
          const isOpen = expanded === section.id;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground text-[15px]">{section.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{section.desc}</p>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <ChartContent section={section.id} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ChartContent({ section }: { section: SectionId }) {
  switch (section) {
    case "distribution":
      return (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                {wasteTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap md:flex-col gap-3">
            {wasteTypes.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                <span>{t.name}</span>
                <span className="font-semibold text-foreground">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "daily":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dailyWaste}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip {...chartTooltipStyle} />
            <Area type="monotone" dataKey="organic" stackId="1" fill="hsl(160, 84%, 39%)" fillOpacity={0.5} stroke="hsl(160, 84%, 39%)" />
            <Area type="monotone" dataKey="plastic" stackId="1" fill="hsl(200, 80%, 50%)" fillOpacity={0.5} stroke="hsl(200, 80%, 50%)" />
            <Area type="monotone" dataKey="metal" stackId="1" fill="hsl(38, 92%, 50%)" fillOpacity={0.4} stroke="hsl(38, 92%, 50%)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case "energy":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={energyForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip {...chartTooltipStyle} formatter={(v: number) => `${(v / 1000).toFixed(0)}k kWh`} />
            <Bar dataKey="actual" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} name="Actual" />
            <Bar dataKey="predicted" fill="hsl(200, 80%, 50%)" radius={[6, 6, 0, 0]} opacity={0.6} name="Predicted" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "carbon":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={carbonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" t" />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="reduced" stroke="hsl(160, 84%, 39%)" strokeWidth={3} dot={{ fill: "hsl(160, 84%, 39%)", r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      );
  }
}
