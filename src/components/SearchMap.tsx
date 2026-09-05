"use client";

type props = {
  pickUp: string;
  drop: string;
  OnChange: (p: string, d: string) => void;
  onDistance: (d: number) => void;
};
import axios from "axios";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";

function FitBounds({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [72, 72],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [p1, p2, map]);
  return null;
}

const pickUpIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
  <div style="
    background:#0a0a0a;color:#fff;
    padding:5px 14px;border-radius:100px;
    font-size:10px;font-weight:800;letter-spacing:0.14em;
    text-transform:uppercase;white-space:nowrap;
    font-family:-apple-system,system-ui,sans-serif;
    box-shadow:0 2px 12px rgba(0,0,0,0.25);
  ">PICKUP</div>
  <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
  <div style="
    width:13px;height:13px;background:#0a0a0a;border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
  "></div>
</div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58],
});
const dropIcon = new L.DivIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22))">
  <div style="
    background:#0a0a0a;color:#fff;
    padding:5px 14px;border-radius:100px;
    font-size:10px;font-weight:800;letter-spacing:0.14em;
    text-transform:uppercase;white-space:nowrap;
    font-family:-apple-system,system-ui,sans-serif;
    box-shadow:0 2px 12px rgba(0,0,0,0.25);
  ">DROP</div>
  <div style="width:2px;height:10px;background:#0a0a0a;opacity:0.4"></div>
  <div style="
    width:13px;height:13px;background:#0a0a0a;border-radius:50%;
    border:3px solid #fff;
    box-shadow:0 0 2px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.3);
  "></div>
</div>`,
  className: "",
  iconSize: [90, 58],
  iconAnchor: [45, 58],
});
function SearchMap({ pickUp, drop, OnChange, onDistance }: props) {
  const [p1, setP1] = useState<[number, number]>();
  const [p2, setP2] = useState<[number, number]>();
  const [route, setRoute] = useState<[number, number][]>([]);
  const [km, setKm] = useState<number | null>();
  const [ready, setReady] = useState(false);
  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`,
      );
      if (!data.features.length) return null;
      const [lat, lon] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const loadRoute = async (p: [number, number], d: [number, number]) => {
    try {
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${p[1]},${p[0]};${d[1]},${d[0]}?overview=full&geometries=geojson`,
      );

      console.log(data);
      if (!data.routes.length) return;
      setRoute(
        data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => [
          lat,
          lon,
        ]),
      );

      const distKm = (data.routes[0].distance / 1000).toFixed(2);
      setKm(Number(distKm));
      onDistance(Number(distKm));
    } catch (error) {
      console.log(error);
    }
  };

  const dragPickUp = async (lat: number, lon: number) => {
    setP1([lat, lon]);
    loadRoute([lat, lon], p2!);
  };
  const dragDrop = async (lat: number, lon: number) => {
    setP2([lat, lon]);
    loadRoute(p1!, [lat, lon]);
  };

  useEffect(() => {
    setReady(false);
    if (pickUp && drop) {
      (async () => {
        const a = geoCoding(pickUp);
        const b = geoCoding(drop);
        if (!a || !b) {
          return;
        }
        await loadRoute(a, b);
        setP1(a);
        setP2(b);
        setReady(true);
      })();
    }
  }, [pickUp, drop]);
  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        zoom={13}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.carto.com/">"CARTO"</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && (
          <Marker
            position={p1}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLating();
                dragPickUp(m.lat, m.lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLating();
                dragDrop(m.lat, m.lng);
              },
            }}
          />
        )}
        {route?.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0a0a0a",
                weight: 4,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}
      </MapContainer>
      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-[999] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-transparent border-t-zinc-300"
              />
              <MapPin size={15} className="text-zinc-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchMap;
