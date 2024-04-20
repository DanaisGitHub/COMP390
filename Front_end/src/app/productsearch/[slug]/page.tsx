'use client'
import BookDetails from "@/components/Product/productFullDetails"
import { getFullBookDetails } from "../../../../lib/ProductAPI"
import { ProductDetailsType } from "@/types/API_Types/Book/BookApiTypes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchWithQuery({ params, searchParams }: any) {
    const { slug } = params
    const { ownerID, itemID } = searchParams

    const router = useRouter()
    const [bookInfoState, setBookInfoState] = useState<ProductDetailsType>()
    useEffect(() => {
        getFullBookDetails({ ownerID: parseInt(ownerID), itemID: parseInt(itemID) }).then((data) => {
            setBookInfoState(data)
        }).catch((err: any) => {
            console.error(err)
            alert(err)
            router.replace('/')
        })
    }, [])

    return <div className="w-full h-[100%] bg-slate-300">
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2 text-center">{bookInfoState?.book.toLocaleUpperCase()}</h1>
                <h2 className="text-xl text-gray-700">{`Author: ${bookInfoState?.authors.toLocaleUpperCase() ?? "N/A"}`}</h2>
                {bookInfoState?.series && <h3 className="text-lg text-gray-600">{`Series: ${bookInfoState?.series}`}</h3>}
                <p className="text-gray-800 mt-4"><b>Description:</b> {bookInfoState?.description}</p>
                <div className="mt-4">
                    <div className="text-gray-900 font-semibold">Details</div>
                    <ul className="list-disc list-inside">
                        <li>Number of Pages: {bookInfoState?.numPages}</li>
                        <li>Formats: {bookInfoState?.formats}</li>
                        <li>Genres: {bookInfoState?.genres}</li>

                        {bookInfoState?.rating_we_think !== undefined && (
                            <li>Rating We Think: {bookInfoState?.rating_we_think} / 10</li>
                        )}
                        <li>Number of Voters: {bookInfoState?.numOfVoters}</li>
                    </ul>
                </div>
                <Link href={`/rent?ownerID=${ownerID}&itemID=${itemID}`} className="my-4 mx-auto justify-center flex w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 bg-cyan-600 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">RENT</Link>
            </div>

        </div>










    </div>
}