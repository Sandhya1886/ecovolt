import { motion } from "framer-motion";
import { FileText, Download, Calendar, TrendingUp, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import "jspdf-autotable";

const reports = [
  { title: "Daily Waste Collection Report", date: "Feb 24, 2026", type: "Daily", icon: Calendar, metrics: "847 tons collected, 32 trucks deployed", data: [
    ["Zone", "Waste Type", "Quantity (tons)", "Status"],
    ["Zone A - Industrial", "Metal", "35", "Collected"],
    ["Zone B - Residential", "Organic", "80", "Collected"],
    ["Zone C - Commercial", "Plastic", "55", "Collected"],
    ["Zone D - Market", "Organic", "65", "Collected"],
    ["Zone E - Hospital", "E-waste", "12", "Collected"],
  ]},
  { title: "Monthly Sustainability Summary", date: "January 2026", type: "Monthly", icon: Leaf, metrics: "124 tons CO₂ reduced, 15% improvement", data: [
    ["Metric", "Value", "Change", "Target"],
    ["CO₂ Reduced", "124 tons", "+15%", "110 tons"],
    ["Energy Generated", "198,400 kWh", "+8%", "185,000 kWh"],
    ["Waste Recycled", "68%", "+5%", "65%"],
    ["Fuel Saved", "28%", "+3%", "25%"],
  ]},
  { title: "Energy Production Report", date: "January 2026", type: "Monthly", icon: Zap, metrics: "198,400 kWh generated from waste", data: [
    ["Source", "Energy (kWh)", "Method", "Efficiency"],
    ["Organic Waste", "85,000", "Biogas", "72%"],
    ["Plastic Waste", "68,400", "Pyrolysis", "65%"],
    ["Mixed Waste", "45,000", "Incineration", "58%"],
  ]},
  { title: "Carbon Reduction Statement", date: "Q4 2025", type: "Quarterly", icon: TrendingUp, metrics: "450 tons CO₂ offset, exceeding targets by 12%", data: [
    ["Month", "CO₂ Reduced (tons)", "Trees Equivalent", "Credits Earned"],
    ["October", "145", "6,670", "145"],
    ["November", "152", "6,992", "152"],
    ["December", "153", "7,038", "153"],
  ]},
  { title: "Route Optimization Analysis", date: "February 2026", type: "Monthly", icon: FileText, metrics: "28% fuel savings, 18.3 km avg reduction", data: [
    ["Route", "Original (km)", "Optimized (km)", "Fuel Saved (L)"],
    ["Route A", "62.5", "44.8", "12.3"],
    ["Route B", "48.2", "35.1", "9.1"],
    ["Route C", "55.8", "40.2", "10.8"],
    ["Route D", "41.3", "30.5", "7.5"],
  ]},
];

function downloadPDF(report: typeof reports[0]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129);
  doc.text("EcoVolt", 14, 20);
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(report.title, 14, 32);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${report.date} | ${report.type} Report`, 14, 40);
  doc.text(report.metrics, 14, 48);

  if (report.data.length > 1) {
    (doc as any).autoTable({
      head: [report.data[0]],
      body: report.data.slice(1),
      startY: 56,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      styles: { fontSize: 10 },
    });
  }

  doc.save(`${report.title.replace(/\s+/g, "_")}.pdf`);
}

function downloadCSV(report: typeof reports[0]) {
  const csvContent = report.data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${report.title.replace(/\s+/g, "_")}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function downloadAllPDF() {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text("EcoVolt - Complete Report", 14, 20);

  let y = 35;
  reports.forEach((report, idx) => {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text(report.title, 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`${report.date} | ${report.metrics}`, 14, y);
    y += 5;

    if (report.data.length > 1) {
      (doc as any).autoTable({
        head: [report.data[0]],
        body: report.data.slice(1),
        startY: y,
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 15;
    }
  });

  doc.save("EcoVolt_Complete_Report.pdf");
}

function downloadAllCSV() {
  let csv = "";
  reports.forEach((report) => {
    csv += `\n${report.title}\n${report.date}\n`;
    csv += report.data.map((row) => row.join(",")).join("\n");
    csv += "\n";
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "EcoVolt_All_Reports.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function Reports() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Reports & Insights</h1>
        <p className="text-muted-foreground mt-1">Generate and download sustainability reports</p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        <Button variant="outline" className="border-primary/30 text-foreground hover:bg-accent" onClick={downloadAllPDF}>
          <Download className="w-4 h-4 mr-2" /> Export All as PDF
        </Button>
        <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary" onClick={downloadAllCSV}>
          <Download className="w-4 h-4 mr-2" /> Export as CSV
        </Button>
      </div>

      <div className="space-y-4">
        {reports.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:glow-border transition-shadow duration-300"
          >
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
