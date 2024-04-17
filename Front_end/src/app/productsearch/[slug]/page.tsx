import BookDetails from "@/components/Product/productFullDetails"
import { getFullBookDetails } from "../../../../lib/ProductAPI"
import { ProductDetailsType } from "@/types/API_Types/Book/BookApiTypes"
import Link from "next/link"
export default async function SearchWithQuery({ params, searchParams }: any) {
    const { slug } = params
    const { ownerID, itemID } = searchParams


    const book: ProductDetailsType = await getFullBookDetails({ bookID: slug })



    return <div className="w-full h-[80vh] bg-slate-300">

        <title>Book Details</title>
        <h1>{book.book}</h1>
        <BookDetails id={book.id} series={book.series} formats={book.formats}
            genres={book.formats} book={book.book} author={book.author} description={book.description}
            numPages={book.numPages} rating_we_think={book.rating_we_think}
            numOfVoters={book.numOfVoters} />

        <Link href={`/rent?ownerID=${ownerID}&itemID=${itemID}`} className="border border-spacing-40 m-auto border-l-4 border-emerald-800">RENT</Link>
        <br />{ownerID}<br />
        {itemID}

    </div>
}