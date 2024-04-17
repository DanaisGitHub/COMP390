"use client"
import React,{useEffect} from "react";
import {Loader} from '@googlemaps/js-api-loader'





 export default function GoogleMaps (){
    const mapRef = React.useRef<HTMLDivElement>(null);
    const lat = 1
    const lng = -1
    useEffect(  ()=>{
        const initMap = async ()=>{

            const loader = new Loader({
                apiKey:process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                version:"weekly"
            });

            const {Map} = await loader.importLibrary('maps')

            const posistion = {
                lat:lat??1,
                lng:lng??-1
            }

            const mapOptions:google.maps.MapOptions = {
                center: posistion,
                zoom:17,
                mapId:"idk"
            }
            const map = new Map(mapRef.current as HTMLDivElement,mapOptions)
            return map

        }
        initMap();
    },[])

    return <div className="h-full w-full" ref = {mapRef}/>
}
