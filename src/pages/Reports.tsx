import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, Leaf, Zap, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";

type WasteCategory = "all" | "plastic" | "organic" | "metal" | "glass" | "ewaste" | "mixed";
type TimeRange = 30 | 60 | 90;

interface Report {
  title: string;
  date: string;
  type: string;
  icon: typeof Calendar;
  metrics: string;
  category: WasteCategory;
  daysAgo: number;
  data: string[][];
}

const reports: Report[] = [
  // Plastic reports
  { title: "Plastic Waste Collection - Zone A", date: "Feb 20, 2026", type: "Daily", icon: Calendar, category: "plastic", daysAgo: 13,
    metrics: "55 tons plastic collected, pyrolysis scheduled",
    data: [["Zone", "Sub-type", "Quantity (tons)", "Status"], ["Zone A", "PET Bottles", "22", "Processed"], ["Zone A", "HDPE Containers", "18", "Queued"], ["Zone A", "PVC Packaging", "15", "Collected"]] },
  { title: "Plastic Recycling Efficiency Report", date: "Jan 2026", type: "Monthly", icon: TrendingUp, category: "plastic", daysAgo: 40,
    metrics: "68% recycling rate, 33,000 kWh from pyrolysis",
    data: [["Metric", "Value", "Target", "Status"], ["Recycling Rate", "68%", "65%", "✓ Met"], ["Energy from Pyrolysis", "33,000 kWh", "30,000 kWh", "✓ Met"], ["Contamination Rate", "8%", "<10%", "✓ Met"]] },
  { title: "Plastic Waste Quarterly Summary", date: "Q4 2025", type: "Quarterly", icon: TrendingUp, category: "plastic", daysAgo: 75,
    metrics: "180 tons processed, revenue ₹7.02L generated",
    data: [["Month", "Collected (tons)", "Processed (tons)", "Revenue (₹)"], ["Oct", "58", "55", "2,14,500"], ["Nov", "62", "60", "2,34,000"], ["Dec", "65", "62", "2,41,800"]] },

  // Organic reports
  { title: "Organic Waste - Biogas Production", date: "Feb 22, 2026", type: "Daily", icon: Leaf, category: "organic", daysAgo: 11,
    metrics: "80 tons organic waste, 20,000 kWh biogas generated",
    data: [["Source", "Quantity (tons)", "Biogas (m³)", "Energy (kWh)"], ["Food Waste", "45", "2,250", "11,250"], ["Garden Waste", "20", "800", "4,000"], ["Market Waste", "15", "950", "4,750"]] },
  { title: "Organic Composting Report", date: "Jan 2026", type: "Monthly", icon: Leaf, category: "organic", daysAgo: 45,
    metrics: "420 tons composted, 35 tons fertilizer produced",
    data: [["Week", "Input (tons)", "Compost Output (tons)", "Quality Grade"], ["W1", "105", "8.5", "A"], ["W2", "110", "9.0", "A"], ["W3", "98", "8.0", "B+"], ["W4", "107", "9.5", "A"]] },

  // Metal reports
  { title: "Metal Recovery & Smelting Report", date: "Feb 18, 2026", type: "Weekly", icon: Zap, category: "metal", daysAgo: 15,
    metrics: "32 tons metal recovered, 3,200 kWh energy",
    data: [["Metal Type", "Quantity (tons)", "Recovery Rate", "Value (₹)"], ["Steel", "18", "94%", "5,40,000"], ["Aluminum", "8", "89%", "4,80,000"], ["Copper", "6", "92%", "7,20,000"]] },

  // Glass reports
  { title: "Glass Cullet Recycling Summary", date: "Feb 15, 2026", type: "Monthly", icon: FileText, category: "glass", daysAgo: 18,
    metrics: "22 tons glass recycled, 1,760 kWh saved",
    data: [["Glass Type", "Quantity (tons)", "Cullet Produced", "Energy Saved (kWh)"], ["Clear", "10", "9.5 tons", "760"], ["Green", "7", "6.5 tons", "520"], ["Brown", "5", "4.8 tons", "480"]] },

  // E-waste reports
  { title: "E-waste Processing Report", date: "Feb 10, 2026", type: "Monthly", icon: Zap, category: "ewaste", daysAgo: 23,
    metrics: "12 tons e-waste, precious metals recovered",
    data: [["Device Type", "Quantity (tons)", "Gold (g)", "Silver (g)"], ["Circuit Boards", "5", "15.2", "180"], ["Mobile Phones", "3", "8.5", "95"], ["Computers", "4", "12.0", "150"]] },

  // Mixed / general reports
  { title: "Daily Waste Collection Report", date: "Feb 24, 2026", type: "Daily", icon: Calendar, category: "all", daysAgo: 9,
    metrics: "847 tons collected, 32 trucks deployed",
    data: [["Zone", "Waste Type", "Quantity (tons)", "Status"], ["Zone A - Industrial", "Metal", "35", "Collected"], ["Zone B - Residential", "Organic", "80", "Collected"], ["Zone C - Commercial", "Plastic", "55", "Collected"], ["Zone D - Market", "Organic", "65", "Collected"], ["Zone E - Hospital", "E-waste", "12", "Collected"]] },
  { title: "Monthly Sustainability Summary", date: "January 2026", type: "Monthly", icon: Leaf, category: "all", daysAgo: 50,
    metrics: "124 tons CO₂ reduced, 15% improvement",
    data: [["Metric", "Value", "Change", "Target"], ["CO₂ Reduced", "124 tons", "+15%", "110 tons"], ["Energy Generated", "198,400 kWh", "+8%", "185,000 kWh"], ["Waste Recycled", "68%", "+5%", "65%"], ["Fuel Saved", "28%", "+3%", "25%"]] },
  { title: "Energy Production Report", date: "January 2026", type: "Monthly", icon: Zap, category: "all", daysAgo: 55,
    metrics: "198,400 kWh generated from waste",
    data: [["Source", "Energy (kWh)", "Method", "Efficiency"], ["Organic Waste", "85,000", "Biogas", "72%"], ["Plastic Waste", "68,400", "Pyrolysis", "65%"], ["Mixed Waste", "45,000", "Incineration", "58%"]] },
  { title: "Carbon Reduction Statement", date: "Q4 2025", type: "Quarterly", icon: TrendingUp, category: "all", daysAgo: 80,
    metrics: "450 tons CO₂ offset, exceeding targets by 12%",
    data: [["Month", "CO₂ Reduced (tons)", "Trees Equivalent", "Credits Earned"], ["October", "145", "6,670", "145"], ["November", "152", "6,992", "152"], ["December", "153", "7,038", "153"]] },
  { title: "Route Optimization Analysis", date: "February 2026", type: "Monthly", icon: FileText, category: "all", daysAgo: 5,
    metrics: "28% fuel savings, 18.3 km avg reduction",
    data: [["Route", "Original (km)", "Optimized (km)", "Fuel Saved (L)"], ["Route A", "62.5", "44.8", "12.3"], ["Route B", "48.2", "35.1", "9.1"], ["Route C", "55.8", "40.2", "10.8"], ["Route D", "41.3", "30.5", "7.5"]] },
];

const categories: { value: WasteCategory; label: string }[] = [
  { value: "all", label: "All Reports" },
  { value: "plastic", label: "Plastic" },
  { value: "organic", label: "Organic" },
  { value: "metal", label: "Metal" },
  { value: "glass", label: "Glass" },
  { value: "ewaste", label: "E-waste" },
  { value: "mixed", label: "Mixed" },
];

function downloadPDF(report: Report) {
  const doc = new jsPDF();
  doc.setFontSize(18); doc.setTextColor(16, 185, 129); doc.text("EcoVolt", 14, 20);
  doc.setFontSize(14); doc.setTextColor(40, 40, 40); doc.text(report.title, 14, 32);
  doc.setFontSize(10); doc.setTextColor(100, 100, 100);
  doc.text(`${report.date} | ${report.type} Report`, 14, 40);
  doc.text(report.metrics, 14, 48);
  if (report.data.length > 1) {
    (doc as any).autoTable({ head: [report.data[0]], body: report.data.slice(1), startY: 56, theme: "grid", headStyles: { fillColor: [16, 185, 129], textColor: 255 }, styles: { fontSize: 10 } });
  }
  doc.save(`${report.title.replace(/\s+/g, "_")}.pdf`);
}

function downloadCSV(report: Report) {
  const csv = report.data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${report.title.replace(/\s+/g, "_")}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadAllPDF(filtered: Report[]) {
  const doc = new jsPDF();
  doc.setFontSize(20); doc.setTextColor(16, 185, 129); doc.text("EcoVolt - Reports", 14, 20);
  let y = 35;
  filtered.forEach((report) => {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(13); doc.setTextColor(40, 40, 40); doc.text(report.title, 14, y); y += 7;
    doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text(`${report.date} | ${report.metrics}`, 14, y); y += 5;
    if (report.data.length > 1) {
      (doc as any).autoTable({ head: [report.data[0]], body: report.data.slice(1), startY: y, theme: "grid", headStyles: { fillColor: [16, 185, 129], textColor: 255 }, styles: { fontSize: 9 }, margin: { left: 14 } });
      y = (doc as any).lastAutoTable.finalY + 15;
    }
  });
  doc.save("EcoVolt_Filtered_Reports.pdf");
}

function downloadAllCSV(filtered: Report[]) {
  let csv = "";
  filtered.forEach((r) => { csv += `\n${r.title}\n${r.date}\n${r.data.map((row) => row.join(",")).join("\n")}\n`; });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "EcoVolt_Filtered_Reports.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function Reports() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<WasteCategory>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>(90);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesCategory = category === "all" ? true : r.category === category || r.category === "all";
      const matchesTime = r.daysAgo <= timeRange;
      const matchesSearch = search === "" || r.title.toLowerCase().includes(search.toLowerCase()) || r.metrics.toLowerCase().includes(search.toLowerCase()) || r.data.some((row) => row.some((cell) => cell.toLowerCase().includes(search.toLowerCase())));
      return matchesCategory && matchesTime && matchesSearch;
    });
  }, [search, category, timeRange]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Reports & Insights</h1>
        <p className="text-muted-foreground mt-1">Search, filter, and download sustainability reports</p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-border bg-card p-4 mb-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by waste type, metric, or keyword (e.g. plastic, CO₂, pyrolysis)" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-secondary border-border" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c.value ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`}>
              {c.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            {([30, 60, 90] as const).map((d) => (
              <button key={d} onClick={() => setTimeRange(d)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === d ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:bg-accent"}`}>
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export All */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Button variant="outline" className="border-primary/30 text-foreground hover:bg-accent" onClick={() => downloadAllPDF(filtered)}>
          <Download className="w-4 h-4 mr-2" /> Export Filtered as PDF ({filtered.length})
        </Button>
        <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary" onClick={() => downloadAllCSV(filtered)}>
          <Download className="w-4 h-4 mr-2" /> Export as CSV
        </Button>
      </div>

      {/* Report List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No reports found for the selected filters.</p>
          </div>
        )}
        {filtered.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <r.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.type}</p>
                <p className="text-sm text-secondary-foreground mt-1">{r.metrics}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:bg-secondary text-xs" onClick={() => downloadPDF(r)}>
                <Download className="w-3 h-3 mr-1" /> PDF
              </Button>
              <Button size="sm" variant="outline" className="border-border text-muted-foreground hover:bg-secondary text-xs" onClick={() => downloadCSV(r)}>
                <Download className="w-3 h-3 mr-1" /> CSV
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
