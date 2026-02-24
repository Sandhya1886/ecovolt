import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Truck, Fuel, Leaf, Route, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WasteMap, { WasteLocation, RouteData } from "@/components/WasteMap";

// Bin locations pool
const allBins: WasteLocation[] = [
  { lat: 28.6139, lng: 77.2090, name: "Depot (Start)", wasteType: "Mixed", quantity: 0 },
  { lat: 28.6329, lng: 77.2195, name: "Zone A - Industrial", wasteType: "Metal", quantity: 35 },
  { lat: 28.5922, lng: 77.2315, name: "Zone B - Residential", wasteType: "Organic", quantity: 80 },
  { lat: 28.6353, lng: 77.2250, name: "Zone C - Commercial", wasteType: "Plastic", quantity: 55 },
  { lat: 28.6508, lng: 77.2310, name: "Zone D - Market", wasteType: "Organic", quantity: 65 },
  { lat: 28.5800, lng: 77.2100, name: "Zone E - Hospital", wasteType: "E-waste", quantity: 12 },
  { lat: 28.6250, lng: 77.1900, name: "Zone F - School Area", wasteType: "Mixed", quantity: 28 },
  { lat: 28.6400, lng: 77.2400, name: "Zone G - IT Park", wasteType: "E-waste", quantity: 20 },
  { lat: 28.5700, lng: 77.2250, name: "Zone H - Apartments", wasteType: "Glass", quantity: 18 },
  { lat: 28.6050, lng: 77.1850, name: "Zone I - Mall Area", wasteType: "Plastic", quantity: 42 },
  { lat: 28.6200, lng: 77.2500, name: "Zone J - University", wasteType: "Organic", quantity: 38 },
  { lat: 28.6450, lng: 77.2100, name: "Zone K - Railway", wasteType: "Mixed", quantity: 50 },
  { lat: 28.5850, lng: 77.1950, name: "Zone L - Temple Area", wasteType: "Organic", quantity: 30 },
  { lat: 28.6600, lng: 77.2200, name: "Zone M - Warehouse", wasteType: "Metal", quantity: 45 },
  { lat: 28.5950, lng: 77.2450, name: "Zone N - Park Area", wasteType: "Glass", quantity: 15 },
  { lat: 28.6100, lng: 77.2600, name: "Processing Plant (End)", wasteType: "Mixed", quantity: 0 },
];

function seededShuffle(arr: WasteLocation[], seed: number): WasteLocation[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function RouteOptimization() {
  const [bins, setBins] = useState("8");
  const [capacity, setCapacity] = useState("8");
  const [fuelCost, setFuelCost] = useState("1.5");
  const [result, setResult] = useState<{
    distance: number; distanceSaved: number; fuelSaving: number; emissionsReduced: number;
    stops: WasteLocation[]; route: RouteData;
  } | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  const optimize = () => {
    setOptimizing(true);
    setResult(null);

    setTimeout(() => {
      const binCount = Math.max(3, Math.min(parseInt(bins) || 8, 14));
      const cap = parseFloat(capacity) || 8;
      const fuel = parseFloat(fuelCost) || 1.5;

      // Pick bins based on count (use seed from params for variety)
      const seed = binCount * 1000 + Math.round(cap * 100) + Math.round(fuel * 10);
      const middleBins = allBins.slice(1, -1);
      const shuffled = seededShuffle(middleBins, seed);
      const selectedBins = shuffled.slice(0, binCount);
      
      // Build route: Depot -> selected bins -> Processing Plant
      const depot = allBins[0];
      const plant = allBins[allBins.length - 1];
      const stops = [depot, ...selectedBins, plant];

      // Sort by nearest neighbor from depot
      const ordered: WasteLocation[] = [depot];
      const remaining = [...selectedBins];
      let current = depot;
      while (remaining.length > 0) {
        let nearestIdx = 0;
        let nearestDist = Infinity;
        for (let i = 0; i < remaining.length; i++) {
          const d = Math.sqrt(Math.pow(remaining[i].lat - current.lat, 2) + Math.pow(remaining[i].lng - current.lng, 2));
          if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
        }
        current = remaining.splice(nearestIdx, 1)[0];
        ordered.push(current);
      }
      ordered.push(plant);

      const routePoints: [number, number][] = ordered.map((l) => [l.lat, l.lng]);

      // Calculate metrics based on inputs
      const baseDist = binCount * 6.5 + Math.random() * 5;
      const optimizedDist = baseDist * (0.55 + cap * 0.02);
      const distSaved = baseDist - optimizedDist;
      const fuelSaving = Math.round(20 + (distSaved / baseDist) * 40 + (1 / fuel) * 5);
      const emissions = Math.round(distSaved * 0.65 * 10) / 10;

      setResult({
        distance: Math.round(optimizedDist * 10) / 10,
        distanceSaved: Math.round(distSaved * 10) / 10,
        fuelSaving: Math.min(fuelSaving, 55),
        emissionsReduced: emissions,
        stops: ordered,
        route: { points: routePoints, color: "#10b981" },
      });
      setOptimizing(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Route Optimization</h1>
        <p className="text-muted-foreground mt-1">AI-powered waste collection route planning</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Parameters</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Number of Bins (3-14)</Label>
              <Input type="number" min={3} max={14} value={bins} onChange={(e) => setBins(e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Truck Capacity (tons)</Label>
              <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Fuel Cost ($/L)</Label>
              <Input type="number" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="mt-1 bg-secondary border-border" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground font-semibold" onClick={optimize} disabled={optimizing}>
              <Play className="w-4 h-4 mr-2" /> {optimizing ? "Optimizing..." : "Optimize Route"}
            </Button>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-3">
              <h4 className="font-display font-semibold text-foreground text-sm">Route Stops:</h4>
              {result.stops.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                  <span className="text-foreground">{s.name}</span>
                  {s.quantity > 0 && <span className="text-muted-foreground">({s.quantity}t)</span>}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="glass-card p-4">
            <WasteMap
              locations={result?.stops || allBins.slice(0, 6)}
              routes={result ? [result.route] : []}
              height="400px"
            />
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard icon={Route} label="Total Distance" value={`${result.distance} km`} />
              <MetricCard icon={Truck} label="Distance Saved" value={`${result.distanceSaved} km`} />
              <MetricCard icon={Fuel} label="Fuel Savings" value={`${result.fuelSaving}%`} accent />
              <MetricCard icon={Leaf} label="CO₂ Reduced" value={`${result.emissionsReduced} kg`} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass-card p-4 ${accent ? "glow-border" : ""}`}>
      <Icon className="w-5 h-5 text-primary mb-2" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display font-bold text-foreground">{value}</p>
    </div>
  );
}
