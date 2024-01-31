"use client"
import React,{useEffect} from "react";
import {Loader} from '@googlemaps/js-api-loader'




export function GoogleMaps (props:{lat?:number,lng?:number}){
    const mapRef = React.useRef<HTMLDivElement>(null);

    useEffect(  ()=>{
        const initMap = async ()=>{

            const loader = new Loader({
                apiKey:process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                version:"weekly"
            });

            const {Map} = await loader.importLibrary('maps')

            const posistion = {
                lat:props.lat??1,
                lng:props.lng??-1
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