import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Flame, Wind, ShieldAlert, Activity, BarChart3 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  AreaChart, Area, BarChart, Bar,
} from "recharts";

const forecastData = Array.from({ length: 90 }, (_, i) => {
  const day = i + 1;
  const base = 55 + day * 0.35 + Math.sin(day / 7) * 3;
  return {
    day: `Day ${day}`,
    dayNum: day,
    capacity: Math.min(Math.round(base + Math.random() * 4), 100),
    predicted: day > 30 ? Math.min(Math.round(base + 2 + Math.random() * 3), 100) : null,
  };
});

const methaneData = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  level: Math.round(40 + i * 1.2 + Math.sin(i / 5) * 8 + Math.random() * 5),
  threshold: 75,
}));

const decompositionData = [
  { type: "Organic", rate: 85, time: "2-6 weeks" },
  { type: "Paper", rate: 65, time: "2-5 months" },
  { type: "Plastic", rate: 12, time: "450+ years" },
  { type: "Metal", rate: 8, time: "50-200 years" },
  { type: "Glass", rate: 3, time: "1M+ years" },
];

const temperatureData = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  temp: Math.round(45 + i * 0.8 + Math.random() * 10),
  safe: 60,
}));

const overflowDay = forecastData.findIndex((d) => (d.predicted ?? d.capacity) >= 90);

const risks = [
  { icon: AlertTriangle, label: "Overflow Risk", value: overflowDay > 0 ? `Day ${overflowDay}` : "Low", level: overflowDay > 0 && overflowDay < 60 ? "high" : "medium", desc: "Predicted date when landfill reaches critical 90% capacity" },
  { icon: Wind, label: "Methane Risk Score", value: "7.2 / 10", level: "high", desc: "Based on organic waste decomposition and gas monitoring" },
  { icon: Flame, label: "Fire Hazard", value: "23%", level: "medium", desc: "Probability based on temperature and combustible material" },
  { icon: TrendingUp, label: "Fill Rate", value: "0.35% / day", level: "low", desc: "Average daily increase in landfill capacity usage" },
  { icon: ShieldAlert, label: "Leachate Risk", value: "Medium", level: "medium", desc: "Groundwater contamination risk from chemical runoff" },
  { icon: Activity, label: "Gas Collection", value: "62%", level: "low", desc: "Efficiency of methane capture and energy recovery" },
];

const chartTooltipStyle = {
  contentStyle: { background: "#fff", border: "1px solid hsl(220, 13%, 88%)", borderRadius: "8px", color: "#1a1a2e" },
};

export default function LandfillForecast() {
  const [timeRange, setTimeRange] = useState<30 | 60 | 90>(90);
  const filteredData = forecastData.filter((d) => d.dayNum <= timeRange);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Landfill Forecasting</h1>
        <p className="text-muted-foreground mt-1">AI-powered capacity prediction, risk assessment & environmental monitoring</p>
      </div>

      {/* Alert Banner */}
      {overflowDay > 0 && overflowDay < 60 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3"
        >
          <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
          <div>
            <p className="font-display font-semibold text-destructive">⚠ Critical Overflow Warning</p>
            <p className="text-sm text-muted-foreground">Landfill capacity is predicted to reach 90% by <strong>Day {overflowDay}</strong>. Immediate action recommended.</p>
          </div>
        </motion.div>
      )}

      {/* Risk Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {risks.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card p-4 border-l-4 ${
              r.level === "high" ? "border-l-destructive" : r.level === "medium" ? "border-l-warning" : "border-l-primary"
            }`}
          >
            <r.icon className={`w-5 h-5 mb-2 ${
              r.level === "high" ? "text-destructive" : r.level === "medium" ? "text-warning" : "text-primary"
            }`} />
            <p className="text-[11px] text-muted-foreground">{r.label}</p>
            <p className="font-display font-bold text-foreground text-lg">{r.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Capacity Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-foreground">Capacity Forecast</h3>
          <div className="flex gap-2">
            {([30, 60, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setTimeRange(d)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  timeRange === d ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
            <XAxis dataKey="day" stroke="hsl(220, 10%, 50%)" fontSize={11} interval={Math.floor(timeRange / 10)} />
            <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} domain={[40, 100]} unit="%" />
            <Tooltip {...chartTooltipStyle} />
            <ReferenceLine y={90} stroke="hsl(0, 72%, 50%)" strokeDasharray="5 5" label={{ value: "⚠ 90% Critical", fill: "hsl(0, 72%, 50%)", fontSize: 12 }} />
            <ReferenceLine y={75} stroke="hsl(38, 92%, 50%)" strokeDasharray="3 3" label={{ value: "Warning 75%", fill: "hsl(38, 92%, 50%)", fontSize: 10 }} />
            <Area type="monotone" dataKey="capacity" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#capacityGrad)" />
            <Area type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="8 4" fill="url(#predictedGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-0.5 bg-primary" /> Actual Capacity
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-0.5 bg-warning" style={{ borderTop: "2px dashed" }} /> AI Predicted
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-4 h-0.5 bg-destructive" /> Critical Threshold
          </div>
        </div>
      </motion.div>

      {/* Row 2: Methane & Temperature */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-warning" /> Methane Emission Levels
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={methaneData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="day" stroke="hsl(220, 10%, 50%)" fontSize={11} />
              <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} unit=" ppm" />
              <Tooltip {...chartTooltipStyle} />
              <ReferenceLine y={75} stroke="hsl(0, 72%, 50%)" strokeDasharray="3 3" label={{ value: "Danger", fill: "hsl(0, 72%, 50%)", fontSize: 10 }} />
              <Area type="monotone" dataKey="level" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-destructive" /> Internal Temperature
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="day" stroke="hsl(220, 10%, 50%)" fontSize={11} />
              <YAxis stroke="hsl(220, 10%, 50%)" fontSize={12} unit="°C" />
              <Tooltip {...chartTooltipStyle} />
              <ReferenceLine y={60} stroke="hsl(0, 72%, 50%)" strokeDasharray="3 3" label={{ value: "Fire Risk", fill: "hsl(0, 72%, 50%)", fontSize: 10 }} />
              <Line type="monotone" dataKey="temp" stroke="hsl(0, 72%, 50%)" strokeWidth={2} dot={{ fill: "hsl(0, 72%, 50%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Decomposition Rates */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Waste Decomposition Analysis
        </h3>
        <div className="grid sm:grid-cols-5 gap-4">
          {decompositionData.map((d, i) => (
            <div key={i} className="text-center">
              <div className="relative w-full h-32 bg-secondary rounded-xl overflow-hidden mb-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.rate}%` }}
                  transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                  className="absolute bottom-0 left-0 right-0 gradient-primary rounded-t-lg"
                />
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-foreground text-lg">{d.rate}%</span>
              </div>
              <p className="font-display font-semibold text-foreground text-sm">{d.type}</p>
              <p className="text-[10px] text-muted-foreground">{d.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
