"use client";

import { DottedMap, type Marker } from "@/components/ui/dotted-map";

// The collector market, scanned worldwide — every dot is a live listing source.
const markers: Marker[] = [
  { lat: 37.77, lng: -122.42, size: 0.9 },
  { lat: 40.71, lng: -74.0, size: 0.9 },
  { lat: 51.51, lng: -0.13, size: 0.9 },
  { lat: 6.52, lng: 3.38, size: 0.9 },
  { lat: 25.2, lng: 55.27, size: 0.9 },
  { lat: 12.97, lng: 77.59, size: 0.9 },
  { lat: 1.35, lng: 103.82, size: 0.9 },
  { lat: -33.87, lng: 151.21, size: 0.9 },
  { lat: -23.55, lng: -46.63, size: 0.9 },
];

export function MarketScanMap() {
  return (
    <div className="absolute inset-0 bg-[#131316]">
      <DottedMap
        className="absolute inset-0 h-full w-full text-white/[0.1]"
        markers={markers}
        pulse
        dotColor="currentColor"
        markerColor="#c4f56b"
        dotRadius={0.2}
        width={150}
        height={100}
      />

      {/* edge vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_45%,transparent_45%,#131316_100%)]" />

      {/* live scan result over the marketplace */}
      <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/60">
          <span className="size-1.5 rounded-full bg-[#c4f56b] shadow-[0_0_8px_#c4f56b]" />
          Scanning Renaiss · live
        </div>
        <div className="mt-0.5 text-[15px] font-semibold tabular-nums text-white">12 underpriced</div>
        <div className="text-[10px] font-medium text-[#c4f56b]">of 1,284 active listings</div>
      </div>
    </div>
  );
}
