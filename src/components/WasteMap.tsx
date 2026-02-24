import { useEffect, useRef } from "react";

export interface WasteLocation {
  lat: number;
  lng: number;
  name: string;
  wasteType: string;
  quantity: number;
  unit?: string;
}

export interface RouteData {
  points: [number, number][];
  color?: string;
}

interface WasteMapProps {
  center?: [number, number];
  zoom?: number;
  locations?: WasteLocation[];
  routes?: RouteData[];
  heatPoints?: { lat: number; lng: number; intensity: number }[];
  height?: string;
}

const wasteColors: Record<string, string> = {
  Organic: "#10b981",
  Plastic: "#3b82f6",
  Metal: "#f59e0b",
  Glass: "#8b5cf6",
  "E-waste": "#ef4444",
  Mixed: "#6b7280",
};

export default function WasteMap({ center = [28.6139, 77.209], zoom = 12, locations = [], routes = [], heatPoints = [], height = "400px" }: WasteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if ((window as any).L) {
        initMap((window as any).L);
        return;
      }

      // Load CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap((window as any).L);
      document.head.appendChild(script);
    };

    const initMap = (L: any) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add heat points as circles
      heatPoints.forEach((hp) => {
        const color = hp.intensity > 0.7 ? "#ef4444" : hp.intensity > 0.4 ? "#f59e0b" : "#10b981";
        L.circle([hp.lat, hp.lng], {
          radius: hp.intensity * 800,
          fillColor: color,
          fillOpacity: 0.3,
          stroke: true,
          color: color,
          weight: 1,
          opacity: 0.5,
        }).addTo(map);
      });

      // Add locations as markers
      locations.forEach((loc) => {
        const color = wasteColors[loc.wasteType] || "#6b7280";
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <div style="width:8px;height:8px;border-radius:50%;background:white;"></div>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:140px">
              <strong style="font-size:14px">${loc.name}</strong>
              <div style="margin-top:4px;font-size:12px;color:#555">
                <div>Type: <span style="color:${color};font-weight:600">${loc.wasteType}</span></div>
                <div>Quantity: <strong>${loc.quantity} ${loc.unit || "tons"}</strong></div>
              </div>
            </div>
          `);
      });

      // Add routes as polylines
      routes.forEach((route) => {
        L.polyline(route.points, {
          color: route.color || "#10b981",
          weight: 4,
          opacity: 0.8,
          dashArray: "10 6",
        }).addTo(map);
      });

      // Fit bounds
      const allPoints: [number, number][] = [];
      locations.forEach((l) => allPoints.push([l.lat, l.lng]));
      routes.forEach((r) => r.points.forEach((p) => allPoints.push(p)));
      if (allPoints.length > 1) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40] });
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, locations, routes, heatPoints]);

  return (
    <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-xl overflow-hidden border border-border z-0" />
  );
}
