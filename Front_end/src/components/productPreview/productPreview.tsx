'use client'

import Image from 'next/image'
import picture from '../../assets/SQUARE.jpg'
export default function productPreview(props: { nameOfProduct?: string, verified?: boolean, nameOfSeller?: string, averageReviewsNumber?: number, price?: number, numberOfReviews?: number, picturee?: string }) {

    const { nameOfProduct, verified, nameOfSeller, averageReviewsNumber, price, numberOfReviews, picturee } = props
    console.log(props)
    return <div className="max-w-[20rem] rounded overflow-hidden shadow-lg border-white border-8">

        {/* image Section */}
        <div className="w-full max-h-[24rem] bg-red-600 border-8 border-red-600">
            <Image className="w-full" src={picture} alt="Sunset in the mountains" width={1000} height={1000} />
        </div>


        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Name Of Product{nameOfProduct} </div> {/*Max 3 Lines*/}
            <div className=" text-m mb-2 flex flex-row w-[100%] bg-red-500 justify-start"> {nameOfSeller}Name Of Seller
                <div className=' justify-end w-1/2  bg-blue-600 text-right'>{verified == true}Verfied</div>
            </div>
            <div className="font-bold text-xl mb-2">{averageReviewsNumber}Reviews{numberOfReviews}</div>
            <div className="font-bold text-xl mb-2">{price}PRICE/Day</div>

        </div>


    </div>
}