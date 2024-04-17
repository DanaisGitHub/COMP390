'use client'
import GoogleMaps from "../../components/Google_Maps/map";
import NewGoogleMaps from "../../components/Google_Maps/newMap";
import ProductPreview from '../../components/Product/productPreview';
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
//import { getRankedBooks } from '../../../lib/ProductAPI';
import { ProductPreviewType } from "@/types/API_Types/Book/BookApiTypes";
import { getRankedBooks } from "../../..//lib/ProductAPI";

export default function SearchNoQuery({ searchParams }: any) {

    const router = useRouter();
    let searchParam = useSearchParams();
    const { searchQuery, maxDistance, minRating, maxPrice } = searchParams;
    let searchQueryParam = searchParam.get('searchQuery') ?? "";
    // let maxDistance = searchParam.get('maxDistance') ?? "1000";
    // let minRating = searchParam.get('minRating') ?? "4.2";
    // let maxPrice = searchParam.get('maxPrice') ?? "1000";



    const fetchData = async () => {
        try {
            const rankedBooksRet = await getRankedBooks({
                lat: 53.4808,
                lng: -2.2426,
                searchQuery: searchQueryState ?? "",
                maxDistance: maxDistance ?? "1000",
                minRating: minRating ?? "4.2",
                maxPrice: maxPrice ?? "1000",
            });
            setRankedBooks(rankedBooksRet)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    let [searchQueryState, setSearchQueryState] = useState<string>(searchQueryParam?.valueOf() ?? "");
    let [rankedBooks, setRankedBooks] = useState<ProductPreviewType[]>();

    useEffect(() => {
        fetchData();
    }, []);

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>, searchQuery?: string) => {
        setSearchQueryState(e.target.value);

    }

    return <div className="h-[100vh]">
        {maxDistance} {minRating} {maxPrice}
        <form >
            <input type="text" placeholder="Seach for a Book" value={searchQueryState} onChange={(e) => { onInputChange(e, searchQueryState) }} />
            <Link href={searchQueryState ? `?searchQuery=${searchQueryState}` : ""} className="border border-red-900" onClick={async (e) => { await fetchData(); }} >tHIS S FOR SEARCH BAR</Link>
        </form>

        <div className=' flex flex-wrap h-[80vh] '>
            <div className='  w-1/2 flex flex-wrap justify-around overflow-scroll h-[80vh] '>
                {
                    rankedBooks?.map((book, index) => {
                        return <ProductPreview key={index} {...book} />
                    })
                }
            </div>
            <div className="w-1/2 h-[80vh] sticky">
                {NewGoogleMaps({
                    userPos: { lat: 53.4808, lng: -2.2426 },
                    items: rankedBooks!.map((book) => { return { lat: book.lat, lng: book.lng } })
                })}
            </div>
        </div>

    </div>
}
