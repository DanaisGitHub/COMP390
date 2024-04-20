'use client'
import ProductPreview from '../Product/productPreview';
import {
    APIProvider,
    Map, AdvancedMarker, Pin, InfoWindow
} from '@vis.gl/react-google-maps';

type position = {
    lat: number,
    lng: number,
}

export default function GoogleMaps(props: { title:string[] ,userPos: position, items: position[] }) {
    let { userPos, items, title } = props;
    userPos = userPos ? userPos : { lat: 37.7748295, lng: -122.4194155 };
    items = items ? items : [];

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} >
            <div style={{ height: '100%', width: '100%' }}>
                <Map gestureHandling="auto" zoom={13} center={{ lat: userPos.lat, lng: userPos.lng }} mapId={"9dab203d16eaebce"}>
                    {
                        items.map((item, index) => {
                            return <AdvancedMarker position={item} onClick={() => alert("title: " + title[index])}></AdvancedMarker>

                        })
                    }
                </Map>
            </div>
        </APIProvider>


    )
}