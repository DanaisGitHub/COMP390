
import Image from 'next/image'
import picture from '../../assets/SQUARE.jpg'
import { ProductPreviewType } from '@/types/API_Types/Book/BookApiTypes'
import Link from 'next/link'
export default function productPreview(props: ProductPreviewType) {
    const { itemID, ownerID, book, lng, lat, ranking_we_think, ranking_of_book } = props
    console.log(props)
    return <Link href={`/productsearch/${itemID}?ownerID=${ownerID}&itemID=${itemID}`}
        className="w-[40%] rounded overflow-hidden shadow-lg bg-slate-200 border-gray-100 border-2 m-2">

        <div className="px-6 py-4 ">
            <div className="text-l mb-2">Title: <b>{book.toLocaleUpperCase() ?? "noName"} </b></div> {/*Max 3 Lines*/}
            <div className="text-l mb-2">AI Rating: <b>{ranking_we_think?.toFixed(2)}</b></div>
            <div className="text-l mb-2">Standard Rating: <b>{ranking_of_book}</b></div>
        </div>
    </Link>
}