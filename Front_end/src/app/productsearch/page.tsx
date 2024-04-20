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
import { getRankedBooks, getUserLocation } from "../../..//lib/ProductAPI";
import { title } from "process";

export default function SearchNoQuery({ searchParams }: any) {

    const router = useRouter();
    let searchParam = useSearchParams();
    const { searchQuery, maxDistance, minRating, maxPrice } = searchParams;
    let [lngState, setLngState] = useState<number>(-2.2426);
    let [latState, setLatState] = useState<number>(53.4808);
    let searchQueryParam = searchParam.get('searchQuery') ?? "";
    // let maxDistance = searchParam.get('maxDistance') ?? "1000";
    // let minRating = searchParam.get('minRating') ?? "4.2";
    // let maxPrice = searchParam.get('maxPrice') ?? "1000";




    const fetchData = async () => {
        try {
            const userLocation: { lat: number, lng: number } = await getUserLocation();
            setLatState(userLocation.lat);
            setLngState(userLocation.lng);

            const rankedBooksRet = await getRankedBooks({
                lat: userLocation.lat ?? 53.4808,
                lng: userLocation.lng ?? -2.2426,
                searchQuery: searchQueryState ?? "",
                maxDistance: maxDistance ?? "1000",
                minRating: minRating ?? "0.0",
                maxPrice: maxPrice ?? "1000",
            });
            const rankedBooksOrdered = rankedBooksRet.sort((a, b) => b.ranking_we_think! - a.ranking_we_think!);
            setRankedBooks(rankedBooksOrdered)
        } catch (error: any) {
            console.error('Cannot Get Ranked Books: ', error.message);
            alert(error)
            router.replace('/')
        }
    };


    let [searchQueryState, setSearchQueryState] = useState<string>(searchQueryParam?.valueOf() ?? "");
    let [rankedBooks, setRankedBooks] = useState<ProductPreviewType[]>();

    useEffect(() => {
        fetchData();
    }, []);

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>, searchQuery?: string) => {
        e.preventDefault();
        setSearchQueryState(e.target.value);

    }

    return <div className="h-[100vh]">
        <form className="max-w-md mx-auto my-2 py-1 ">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Book names & Descriptions"
                    value={searchQueryState} onChange={(e) => { onInputChange(e, searchQueryState) }} />
                <Link href={searchQueryState ? `?searchQuery=${searchQueryState}` : `?searchQuery=`} type="submit" onClick={async (e) => { await fetchData(); }} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</Link>
                {/* <Link href={searchQueryState ? `?searchQuery=${searchQueryState}` : ""} className="border border-red-900" onClick={async (e) => { await fetchData(); }} >tHIS S FOR SEARCH BAR</Link> */}
            </div>
        </form>
        <div className=' flex flex-wrap h-[80vh] border-t-2 '>
            <div className='  w-1/2 flex flex-wrap justify-around overflow-scroll h-[80vh] '>
                {
                    rankedBooks?.map((book, index) => {

                        return <ProductPreview key={index} {...book} />
                    })
                }
            </div>
            <div className="w-1/2 h-[80vh] sticky">
                {NewGoogleMaps({
                    title: rankedBooks?.map((book) => { return  book.book  }),
                    userPos: { lat: latState ?? 53.4808, lng: lngState ?? -2.2426 },
                    items: rankedBooks?.map((book) => { return { lat: book.lat, lng: book.lng, } })
                })}

            </div>
        </div>

    </div>
}
