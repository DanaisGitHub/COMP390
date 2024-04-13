
import Image from 'next/image'
import picture from '../../assets/SQUARE.jpg'
import { ProductPreviewType } from '@/types/API_Types/Book/BookApiTypes'
import Link from 'next/link'
export default function productPreview(props: ProductPreviewType) {
    const { itemID, ownerID, book, lng, lat, ranking_we_think, ranking_of_book } = props
    console.log(props)
    return <Link href={`/productsearch/${itemID}?ownerID=${ownerID}&itemID=${itemID}`} className="max-w-[20rem] rounded overflow-hidden shadow-lg border-white border-2 m-2">

        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{book ?? "noName"} </div> {/*Max 3 Lines*/}
            <div className=" text-m mb-2 flex flex-row w-[100%] bg-red-500 justify-start"> {"Name of Seller"}
            </div>
            <div className="font-bold text-xl mb-2">Rating Others gave: {ranking_of_book}</div>
            <div className="font-bold text-xl mb-2">:{ranking_we_think?.toFixed(2)}</div>

        </div>
    </Link>
}