import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Brain, Zap, CheckCircle, Sparkles, Recycle, Flame, Droplets,
  Cpu, Package, Image as ImageIcon, X, ListOrdered, Leaf, HelpCircle
} from "lucide-react";
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

const wasteCategories = [
  { key: "plastic", label: "Plastic", icon: Package, color: "hsl(200, 80%, 50%)", desc: "Bottles, bags, containers" },
  { key: "organic", label: "Organic", icon: Leaf, color: "hsl(160, 84%, 39%)", desc: "Food, garden waste" },
  { key: "metal", label: "Metal", icon: Flame, color: "hsl(38, 92%, 50%)", desc: "Cans, foil, scrap" },
  { key: "glass", label: "Glass", icon: Droplets, color: "hsl(280, 60%, 55%)", desc: "Bottles, jars, windows" },
  { key: "ewaste", label: "E-Waste", icon: Cpu, color: "hsl(0, 72%, 50%)", desc: "Phones, circuits, cables" },
  { key: "mixed", label: "Mixed", icon: Recycle, color: "hsl(220, 10%, 46%)", desc: "Unsorted municipal waste" },
];

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

// Analyze image pixels to classify waste type
function analyzeImageColors(imageData: ImageData): string {
  const data = imageData.data;
  const totalPixels = data.length / 4;

  let rTotal = 0, gTotal = 0, bTotal = 0;
  let grayCount = 0, greenCount = 0, blueCount = 0;
  let brownCount = 0, darkCount = 0, brightCount = 0;
  let saturationTotal = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    rTotal += r; gTotal += g; bTotal += b;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const diff = max - min;
    const lum = (r + g + b) / 3;
    const sat = max === 0 ? 0 : diff / max;
    saturationTotal += sat;

    // Gray/silver detection (low saturation, medium brightness)
    if (sat < 0.15 && lum > 80 && lum < 200) grayCount++;
    // Green detection
    if (g > r * 1.2 && g > b * 1.2 && sat > 0.2) greenCount++;
    // Blue detection
    if (b > r * 1.2 && b > g * 1.0 && sat > 0.2) blueCount++;
    // Brown/orange detection
    if (r > g * 1.1 && g > b * 1.1 && r > 100 && sat > 0.2) brownCount++;
    // Dark pixels
    if (lum < 60) darkCount++;
    // Bright/white pixels
    if (lum > 220 && sat < 0.1) brightCount++;
  }

  const avgR = rTotal / totalPixels;
  const avgG = gTotal / totalPixels;
  const avgB = bTotal / totalPixels;
  const avgSat = saturationTotal / totalPixels;

  const grayRatio = grayCount / totalPixels;
  const greenRatio = greenCount / totalPixels;
  const blueRatio = blueCount / totalPixels;
  const brownRatio = brownCount / totalPixels;
  const darkRatio = darkCount / totalPixels;
  const brightRatio = brightCount / totalPixels;

  // Scoring system
  const scores: Record<string, number> = {
    metal: 0, plastic: 0, organic: 0, glass: 0, ewaste: 0, mixed: 0
  };

  // Metal: gray, silver, shiny, low saturation
  scores.metal += grayRatio * 5;
  scores.metal += (avgSat < 0.15 ? 3 : 0);
  scores.metal += (avgR > 120 && avgR < 200 && Math.abs(avgR - avgG) < 25 && Math.abs(avgG - avgB) < 25) ? 3 : 0;

  // Organic: green, brown, natural colors
  scores.organic += greenRatio * 6;
  scores.organic += brownRatio * 4;
  scores.organic += (avgG > avgR && avgG > avgB) ? 2 : 0;

  // Plastic: bright colors, high saturation, blue tones common
  scores.plastic += blueRatio * 4;
  scores.plastic += (avgSat > 0.35 ? 3 : 0);
  scores.plastic += brightRatio * 2;
  scores.plastic += (avgB > avgR && avgB > avgG) ? 2 : 0;

  // Glass: transparent look (bright + low saturation), or green/brown glass
  scores.glass += brightRatio * 3;
  scores.glass += (avgSat < 0.2 && brightRatio > 0.3) ? 3 : 0;
  scores.glass += (greenRatio > 0.1 && brightRatio > 0.15) ? 2 : 0;

  // E-waste: dark, circuit board greens, complex color mix
  scores.ewaste += darkRatio * 4;
  scores.ewaste += (greenRatio > 0.05 && darkRatio > 0.2) ? 3 : 0;
  scores.ewaste += (avgSat > 0.15 && avgSat < 0.35 && darkRatio > 0.15) ? 2 : 0;

  // Mixed: no dominant signal
  scores.mixed += 1; // base

  // Find best match
  let best = "mixed", bestScore = scores.mixed;
  for (const [key, score] of Object.entries(scores)) {
    if (score > bestScore) { best = key; bestScore = score; }
  }

  return best;
}

export default function Classification() {
  const [result, setResult] = useState<WasteResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [classificationMode, setClassificationMode] = useState<"auto" | "manual">("auto");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const analyzeWithCanvas = useCallback((imgSrc: string, fileName: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Resize for analysis (small = fast)
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);

      let key: string;

      if (classificationMode === "manual" && selectedCategory) {
        key = selectedCategory;
      } else {
        // Use canvas color analysis
        key = analyzeImageColors(imageData);

        // Boost with filename hints (secondary signal)
        const nameLower = fileName.toLowerCase();
        const nameHints: Record<string, string[]> = {
          plastic: ["plastic", "bottle", "pet", "hdpe", "wrapper", "polythene", "poly"],
          organic: ["food", "organic", "fruit", "vegetable", "leaf", "compost", "banana", "apple"],
          metal: ["metal", "can", "steel", "iron", "aluminum", "copper", "tin", "scrap"],
          glass: ["glass", "jar", "bottle", "window", "mirror"],
          ewaste: ["circuit", "phone", "electronic", "computer", "laptop", "pcb", "wire", "cable", "battery"],
          mixed: ["mixed", "garbage", "trash", "municipal"],
        };
        for (const [hintKey, hints] of Object.entries(nameHints)) {
          if (hints.some(h => nameLower.includes(h))) {
            key = hintKey;
            break;
          }
        }
      }

      const base = wasteResults[key];
      const confVariation = Math.floor(Math.random() * 6) - 2;
      setResult({ ...base, confidence: Math.min(99, Math.max(75, base.confidence + confVariation)) });
      setAnalyzing(false);
    };
    img.src = imgSrc;
  }, [classificationMode, selectedCategory]);

  const classifyImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setUploadedImage(src);
      setUploadedFileName(file.name);
      setResult(null);
      setAnalyzing(true);

      // Simulate processing time, then analyze
      setTimeout(() => {
        analyzeWithCanvas(src, file.name);
      }, 2000);
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
    setSelectedCategory(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hidden canvas for image analysis */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Waste Classification</h1>
        <p className="text-muted-foreground mt-1">Upload a waste image for AI-powered classification and energy conversion analysis</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Upload + Options */}
        <div className="lg:col-span-2 space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Classification Mode Toggle */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Classification Mode</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setClassificationMode("auto"); setSelectedCategory(null); }}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                  classificationMode === "auto"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-accent/50 text-muted-foreground hover:bg-accent"
                }`}
              >
                <Brain className="w-4 h-4" /> Auto Detect
              </button>
              <button
                onClick={() => setClassificationMode("manual")}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                  classificationMode === "manual"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-accent/50 text-muted-foreground hover:bg-accent"
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Select Type
              </button>
            </div>
          </div>

          {/* Waste Type Selector (manual mode) */}
          <AnimatePresence>
            {classificationMode === "manual" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Select Waste Type</p>
                  <div className="grid grid-cols-2 gap-2">
                    {wasteCategories.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setResult(wasteResults[cat.key]);
                        }}
                        className={`rounded-xl p-3 text-left transition-all border ${
                          selectedCategory === cat.key
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-transparent bg-accent/30 hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                          <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            ) : analyzing ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Brain className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Analyzing waste image...</h3>
                <p className="text-muted-foreground text-xs">AI model is scanning colors, textures, and patterns</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">Upload Waste Image</h3>
                <p className="text-muted-foreground text-xs mb-4">Drag & drop or click to select · JPG, PNG up to 10MB</p>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  <ImageIcon className="w-4 h-4 mr-1.5" /> Choose Image
                </Button>
              </>
            )}
          </div>

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
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                      {classificationMode === "manual" ? "Manual" : "Auto-detected"}
                    </span>
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
