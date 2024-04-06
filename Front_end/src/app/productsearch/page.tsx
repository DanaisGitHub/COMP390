'use client';
import GoogleMaps from "../../components/Google_Maps/map";
import NewGoogleMaps from "../../components/Google_Maps/newMap";

export default function SearchNoQuery (){
    return <div className=" bg-slate-500 min-h-full min-w-full"> 
        {NewGoogleMaps()}
    </div>
}