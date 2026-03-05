import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Zap, CheckCircle, Image as ImageIcon, Sparkles, Recycle, Flame, Droplets, Cpu, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const wasteResults: Record<string, { type: string; confidence: number; method: string; energy: number; color: string; icon: typeof Recycle; details: string }> = {
  plastic: { type: "Plastic", confidence: 92, method: "Pyrolysis", energy: 600, color: "hsl(200, 80%, 50%)", icon: Package, details: "High-density polyethylene detected. Suitable for thermal decomposition into fuel oils." },
  organic: { type: "Organic", confidence: 97, method: "Anaerobic Digestion", energy: 250, color: "hsl(160, 84%, 39%)", icon: Recycle, details: "Biodegradable food waste identified. Optimal for biogas generation via fermentation." },
  ewaste: { type: "E-waste", confidence: 88, method: "Specialized Recycling", energy: 150, color: "hsl(0, 72%, 50%)", icon: Cpu, details: "Circuit board components detected. Requires controlled disassembly for metal recovery." },
  metal: { type: "Metal", confidence: 95, method: "Smelting & Recovery", energy: 100, color: "hsl(38, 92%, 50%)", icon: Flame, details: "Ferrous metal alloy identified. Can be melted and reformed with minimal energy loss." },
  glass: { type: "Glass", confidence: 90, method: "Cullet Recycling", energy: 80, color: "hsl(280, 60%, 55%)", icon: Droplets, details: "Soda-lime glass detected. Crushable into cullet for direct furnace reuse." },
  mixed: { type: "Mixed Waste", confidence: 78, method: "Mass Burn Incineration", energy: 350, color: "hsl(220, 10%, 46%)", icon: Recycle, details: "Multiple material types detected. Best processed via high-temperature incineration." },
};

const wasteOptions = [
  { value: "auto", label: "Auto-detect", desc: "Let AI identify the waste type" },
  { value: "plastic", label: "Plastic", desc: "Bottles, bags, packaging" },
  { value: "organic", label: "Organic", desc: "Food waste, garden waste" },
  { value: "metal", label: "Metal", desc: "Cans, foil, scrap metal" },
  { value: "glass", label: "Glass", desc: "Bottles, jars, windows" },
  { value: "ewaste", label: "E-waste", desc: "Electronics, batteries" },
  { value: "mixed", label: "Mixed Waste", desc: "Unsorted, mixed materials" },
];

const allTypes = Object.keys(wasteResults);

export default function Classification() {
  const [result, setResult] = useState<typeof wasteResults["plastic"] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedType, setSelectedType] = useState("auto");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const simulateClassification = () => {
    setResult(null);
    setAnalyzing(true);
    setTimeout(() => {
      const key = selectedType === "auto" ? allTypes[Math.floor(Math.random() * allTypes.length)] : selectedType;
      const base = wasteResults[key];
      setResult({ ...base, confidence: Math.max(70, base.confidence + Math.floor(Math.random() * 8) - 4) });
      setAnalyzing(false);
    }, 2200);
  };

  const handleFileSelect = () => {
    setUploadedFile("waste_sample_" + Math.floor(Math.random() * 999) + ".jpg");
    simulateClassification();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Waste Classification</h1>
        <p className="text-muted-foreground mt-1">AI-powered waste identification and conversion recommendations</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload + Type Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Type Selection */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-3">Waste Category</h3>
            <div className="space-y-2">
              {wasteOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all text-sm ${
                    selectedType === opt.value
                      ? "bg-primary/10 border border-primary/30 text-foreground"
                      : "border border-transparent hover:bg-accent/60 text-muted-foreground"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${selectedType === opt.value ? "bg-primary" : "bg-border"}`} />
                  <div>
                    <div className="font-medium text-foreground">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(); }}
            onClick={handleFileSelect}
            className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40 hover:bg-accent/30"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {analyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Brain className="w-7 h-7 text-primary" />
                </motion.div>
              ) : (
                <Upload className="w-7 h-7 text-primary" />
              )}
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              {analyzing ? "Analyzing waste..." : "Upload Waste Image"}
            </h3>
            <p className="text-muted-foreground text-xs mb-4">
              Drag & drop or click · JPG, PNG up to 10MB
            </p>
            <Button size="sm" className="gradient-primary text-primary-foreground" disabled={analyzing}>
              <ImageIcon className="w-4 h-4 mr-1.5" />
              {analyzing ? "Processing..." : "Choose File"}
            </Button>
            {uploadedFile && !analyzing && (
              <p className="text-xs text-muted-foreground mt-3">Last: {uploadedFile}</p>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Main Result Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Classification Complete</span>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${result.color}15` }}>
                      <result.icon className="w-7 h-7" style={{ color: result.color }} />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">{result.type}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{result.details}</p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">AI Confidence</span>
                      <span className="text-sm font-bold" style={{ color: result.color }}>{result.confidence}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: result.color }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-accent/50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Method</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{result.method}</p>
                    </div>
                    <div className="rounded-xl bg-accent/50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Energy Yield</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{result.energy} kWh/ton</p>
                    </div>
                  </div>
                </div>

                {/* Revenue Estimate Card */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Estimated Impact (per ton)</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="text-lg font-bold text-primary">₹{(result.energy * 6.5).toLocaleString()}</p>
                      <p className="text-[11px] text-muted-foreground">Revenue</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="text-lg font-bold text-primary">{(result.energy * 0.4).toFixed(0)} kg</p>
                      <p className="text-[11px] text-muted-foreground">CO₂ Saved</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-3">
                      <p className="text-lg font-bold text-primary">{Math.round(result.energy / 30)}</p>
                      <p className="text-[11px] text-muted-foreground">Homes Powered (day)</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => { setResult(null); setUploadedFile(null); }} variant="outline" className="w-full">
                  Classify Another Sample
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-border bg-card p-12 flex items-center justify-center shadow-sm h-full min-h-[400px]"
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/60 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">Ready to Classify</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Select a waste category and upload an image to get AI-powered classification results
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
