'use client'
import ProductPreview from '../productPreview/productPreview';
import {
    APIProvider,
    Map, AdvancedMarker, Pin, InfoWindow
} from '@vis.gl/react-google-maps';


export default function GoogleMaps() {
    let position = { lat: 37.7749295, lng: -122.4194155 };
    let pos2 = { lat: 37.6749295, lng: -121.4194155 };

    return (
        <div className=' flex min-h-[80vh]'>
            <div className='w-1/2 flex m-auto justify-around overflow-y-scroll flex-wrap'> {/* Get space around some how */}
            <ProductPreview nameOfProduct="nameOfProduct"></ProductPreview>
            <ProductPreview nameOfProduct="nameOfProduct"></ProductPreview>
            <ProductPreview nameOfProduct="nameOfProduct"></ProductPreview>
            <ProductPreview nameOfProduct="nameOfProduct"></ProductPreview>


            </div>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <div style={{ height: '50vh', width: '50%' }}>
                    <Map zoom={9} center={ {lat: 37.7748295, lng: -122.4194155} } mapId={"9dab203d16eaebce"}>
                        <AdvancedMarker position={position} onClick={()=> alert("hello")}></AdvancedMarker>
                        <AdvancedMarker position={pos2}></AdvancedMarker>
                    </Map>
                </div>
            </APIProvider>

            
        </div>


    )
}