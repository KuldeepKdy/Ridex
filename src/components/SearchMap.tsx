"use client";

type props = {
  pickUp: string;
  drop: string;
  OnChange: (p: string, d: string) => void;
  onDistance: (d: number) => void;
};
import axios from "axios";
import L from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
function SearchMap({ pickUp, drop, OnChange, onDistance }: props) {

    const [p1,serP1] = useState<[number,number]>();
    const [p2,serP2] = useState<[number,number]>();

    const geoCoding =async(q:string):Promise<[number,number] | null> =>{
        try{
            const {data} = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`);
            if(!data.features.length) return null;
            const [lat,lon] = data.features[0].geometry.coordinates;
            return [lat,lon];
        }catch(error){
            console.log(error);
            return null;
        }

    }
  return (
    <div className="relative h-full w-full bg-zinc-100">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={[0, 0]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.carto.com/">"CARTO"</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default SearchMap;
