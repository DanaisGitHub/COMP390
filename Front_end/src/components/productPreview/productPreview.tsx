'use client'

import Image from 'next/image'
import picture from '../../assets/SQUARE.jpg'
export default function productPreview(props: {
    productID?: string,
    ownerID?: string,
    nameOfProduct?: string,
    nameOfSeller?: string,
    averageReviewsNumber?: number,
    price?: number,
    pre_rating?: number
    rating_we_think?: number

}) {

    const newPage = () => {
        alert("Hello")
    }

    const { nameOfProduct, nameOfSeller, averageReviewsNumber, price } = props
    console.log(props)
    return <div className="max-w-[20rem] rounded overflow-hidden shadow-lg border-white border-2 m-2" onClick={newPage}>

        {/* image Section */}
        <div className="w-full max-h-[24rem] bg-red-600 border-8 border-red-600">
            <Image className="w-full" src={picture} alt="Sunset in the mountains" width={1000} height={1000} />{/* Random Image */}
        </div>

        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{nameOfProduct ?? "noName"} </div> {/*Max 3 Lines*/}
            <div className=" text-m mb-2 flex flex-row w-[100%] bg-red-500 justify-start"> {nameOfSeller ?? "Name of Seller"}
            </div>
            <div className="font-bold text-xl mb-2">{price}PRICE/Day</div>

        </div>


    </div>
}