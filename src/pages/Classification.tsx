import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Brain, Zap, CheckCircle, Sparkles, Recycle, Flame, Droplets, Cpu, Package, Image as ImageIcon, X, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WasteResult {
  type: string;
  confidence: number;
  method: string;
  energy: number;
  color: string;
  icon: typeof Recycle;
  details: string;
  steps: string[];
}

const wasteResults: Record<string, WasteResult> = {
  plastic: {
    type: "Plastic", confidence: 92, method: "Pyrolysis", energy: 600, color: "hsl(200, 80%, 50%)", icon: Package,
    details: "High-density polyethylene detected. Suitable for thermal decomposition into fuel oils.",
    steps: [
      "Plastic waste is collected from bins, recycling centers, and waste streams, then sorted by type (PET, HDPE, PVC, etc.).",
      "The sorted plastic is cleaned thoroughly to remove labels, food residues, and other contaminants.",
      "Clean plastic is shredded into small flakes or pellets to increase surface area for processing.",
      "The shredded plastic is fed into a pyrolysis reactor — a sealed chamber heated to 300–900°C without oxygen.",
      "At high temperature, plastic polymers break down into smaller hydrocarbon molecules, producing pyrolysis oil, gas, and char.",
      "The pyrolysis oil is refined and can be used as fuel for generators, producing electricity (approx. 600 kWh per ton of plastic).",
    ],
  },
  organic: {
    type: "Organic", confidence: 97, method: "Anaerobic Digestion", energy: 250, color: "hsl(160, 84%, 39%)", icon: Recycle,
    details: "Biodegradable food waste identified. Optimal for biogas generation via fermentation.",
    steps: [
      "Food waste is collected and segregated to remove plastics, metals, and non-biodegradable materials.",
      "The waste is crushed and mixed with water to create a slurry, making it easier for microorganisms to process.",
      "The slurry is fed into an airtight anaerobic digester — a large sealed tank with no oxygen.",
      "Naturally occurring microorganisms break down the organic matter over 15–30 days in the absence of oxygen.",
      "This decomposition produces biogas (60% methane, 40% CO₂), which rises and is collected at the top of the digester.",
      "The biogas is purified to remove impurities, then burned in a generator to produce electricity and heat (approx. 250 kWh per ton).",
    ],
  },
  ewaste: {
    type: "E-waste", confidence: 88, method: "Specialized Recycling", energy: 150, color: "hsl(0, 72%, 50%)", icon: Cpu,
    details: "Circuit board components detected. Requires controlled disassembly for metal recovery.",
    steps: [
      "Electronic devices are collected at designated e-waste centers and sorted by type (phones, computers, batteries, etc.).",
      "Devices are manually disassembled to separate hazardous components like batteries, capacitors, and CRT screens.",
      "Printed circuit boards are processed using hydrometallurgy or pyrometallurgy to recover precious metals (gold, silver, copper).",
      "Plastic casings are separated and can be recycled or used for energy recovery through incineration.",
      "Recovered metals are smelted and refined for reuse in manufacturing, reducing the need for mining raw materials.",
      "The thermal energy from smelting and incineration processes is captured and converted to electricity (approx. 150 kWh per ton).",
    ],
  },
  metal: {
    type: "Metal", confidence: 95, method: "Smelting & Recovery", energy: 100, color: "hsl(38, 92%, 50%)", icon: Flame,
    details: "Ferrous metal alloy identified. Can be melted and reformed with minimal energy loss.",
    steps: [
      "Scrap metal is collected from waste streams, demolition sites, and recycling drop-offs.",
      "Metals are sorted using magnetic separators (for ferrous) and eddy current separators (for non-ferrous like aluminum).",
      "Sorted metal is cleaned, shredded, and compacted into bales for efficient transport to smelting facilities.",
      "The metal bales are fed into electric arc furnaces or blast furnaces, heated to over 1,500°C to melt completely.",
      "Molten metal is purified, removing impurities and slag, then cast into ingots or sheets for reuse.",
      "Heat energy recovered from the smelting process is used to generate steam for turbines (approx. 100 kWh per ton).",
    ],
  },
  glass: {
    type: "Glass", confidence: 90, method: "Cullet Recycling", energy: 80, color: "hsl(280, 60%, 55%)", icon: Droplets,
    details: "Soda-lime glass detected. Crushable into cullet for direct furnace reuse.",
    steps: [
      "Glass bottles, jars, and containers are collected from recycling bins and waste collection points.",
      "Glass is sorted by color (clear, green, brown) and cleaned to remove labels, caps, and food residue.",
      "Clean glass is crushed into small pieces called 'cullet', which melts at a lower temperature than raw materials.",
      "Cullet is mixed with silica sand, soda ash, and limestone, then fed into a glass furnace at 1,500°C.",
      "The molten glass is shaped into new bottles, jars, or fiberglass insulation products.",
      "Using cullet reduces furnace energy by 25–30%, and excess heat is recovered for power generation (approx. 80 kWh per ton).",
    ],
  },
  mixed: {
    type: "Mixed Waste", confidence: 78, method: "Mass Burn Incineration", energy: 350, color: "hsl(220, 10%, 46%)", icon: Recycle,
    details: "Multiple material types detected. Best processed via high-temperature incineration.",
    steps: [
      "Mixed municipal solid waste is collected from households and commercial areas where sorting wasn't done at source.",
      "Waste is delivered to an incineration facility where large items are removed and the rest is fed onto a moving grate.",
      "The waste is burned at temperatures between 850–1,100°C in a controlled combustion chamber with excess air.",
      "The intense heat converts waste into ash (reduced to 10% of original volume), flue gases, and thermal energy.",
      "Hot flue gases pass through a boiler, heating water into steam that drives turbines to generate electricity.",
      "Emissions are cleaned through filters, scrubbers, and catalytic converters before release (approx. 350 kWh per ton).",
    ],
  },
};

export default function Classification() {
  const [result, setResult] = useState<WasteResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classifyImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setUploadedFileName(file.name);
      setResult(null);
      setAnalyzing(true);

      // Simulate AI classification based on file name or random
      setTimeout(() => {
        const keys = Object.keys(wasteResults);
        const nameLower = file.name.toLowerCase();
        let key = keys[Math.floor(Math.random() * keys.length)];
        if (nameLower.includes("plastic") || nameLower.includes("bottle")) key = "plastic";
        else if (nameLower.includes("food") || nameLower.includes("organic") || nameLower.includes("fruit")) key = "organic";
        else if (nameLower.includes("metal") || nameLower.includes("can") || nameLower.includes("steel")) key = "metal";
        else if (nameLower.includes("glass") || nameLower.includes("jar")) key = "glass";
        else if (nameLower.includes("circuit") || nameLower.includes("phone") || nameLower.includes("electronic")) key = "ewaste";

        const base = wasteResults[key];
        setResult({ ...base, confidence: Math.max(70, base.confidence + Math.floor(Math.random() * 8) - 4) });
        setAnalyzing(false);
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) classifyImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) classifyImage(file);
  };

  const reset = () => {
    setResult(null);
    setUploadedImage(null);
    setUploadedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Waste Classification</h1>
        <p className="text-muted-foreground mt-1">Upload a waste image for AI-powered classification and energy conversion analysis</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload */}
        <div className="lg:col-span-2 space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Upload area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !analyzing && fileInputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              analyzing ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/30"
            }`}
          >
            {uploadedImage && !analyzing ? (
              <div className="relative">
                <img src={uploadedImage} alt="Uploaded waste" className="w-full h-48 object-cover rounded-xl mb-3" />
                <button onClick={(e) => { e.stopPropagation(); reset(); }} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 border border-border flex items-center justify-center hover:bg-destructive/10">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                <p className="text-xs text-muted-foreground truncate">{uploadedFileName}</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {analyzing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                      <Brain className="w-8 h-8 text-primary" />
                    </motion.div>
                  ) : (
                    <Upload className="w-8 h-8 text-primary" />
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {analyzing ? "Analyzing waste image..." : "Upload Waste Image"}
                </h3>
                <p className="text-muted-foreground text-xs mb-4">
                  {analyzing ? "AI model is processing your image" : "Drag & drop or click to select · JPG, PNG up to 10MB"}
                </p>
                {!analyzing && (
                  <Button size="sm" className="gradient-primary text-primary-foreground">
                    <ImageIcon className="w-4 h-4 mr-1.5" /> Choose Image
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Uploaded preview with classify button */}
          {uploadedImage && !analyzing && !result && (
            <Button className="w-full gradient-primary text-primary-foreground font-semibold h-11" onClick={() => fileInputRef.current?.click()}>
              <Brain className="w-4 h-4 mr-2" /> Re-upload & Classify
            </Button>
          )}

          {result && (
            <Button variant="outline" className="w-full border-border" onClick={reset}>
              Classify Another Sample
            </Button>
          )}
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
                className="space-y-4"
              >
                {/* Main Result Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Classification Complete</span>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    {uploadedImage && (
                      <img src={uploadedImage} alt="Classified waste" className="w-16 h-16 rounded-xl object-cover border border-border" />
                    )}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${result.color}15` }}>
                        <result.icon className="w-6 h-6" style={{ color: result.color }} />
                      </div>
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">{result.type}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{result.details}</p>
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">AI Confidence</span>
                      <span className="text-sm font-bold" style={{ color: result.color }}>{result.confidence}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1.2 }} className="h-full rounded-full" style={{ background: result.color }} />
                    </div>
                  </div>

                  {/* Method & Energy */}
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

                {/* Impact */}
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

                {/* Step-by-step Process */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ListOrdered className="w-5 h-5 text-primary" />
                    <h4 className="font-display font-semibold text-foreground">How Energy is Produced from {result.type}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Method: <span className="font-semibold text-foreground">{result.method}</span> — Step-by-step process from waste to energy
                  </p>
                  <div className="space-y-3">
                    {result.steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
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
                    Upload a waste image to get AI-powered classification with detailed energy conversion process
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
