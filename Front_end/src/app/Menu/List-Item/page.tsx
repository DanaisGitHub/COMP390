'use client'
import { useEffect, useState } from 'react';
import { getUserItems, getUserDetails, updateUserDetails } from "../../../../lib/UserDetailsAPI";
import { postNewList } from '../../../../lib/ProductAPI';
import { useRouter } from 'next/navigation';


type UserItemType = {
    id?: number;
    ownerID: number;
    itemID: number;
    quantity: number;
    price: number;
}

export default function MyProfile() {
    const [newUserItem, setNewUserItem] = useState<UserItemType>({
        ownerID: 10,
        itemID: 0,
        quantity: 0,
        price: 0.00
    });
    const router = useRouter();



    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            await postNewList(newUserItem);
            alert("success")// go to next page
            router.replace('/productsearch')
        } catch (err: any) {
            alert(err.message)
            router.replace('/productsearch')
        }

    };

    return <div>
        <section className="bg-gray-50 dark:bg-gray-900 bg-green-700 h-[100%] p-4 ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100%] lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className=" text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
                            List An Item
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="itemID" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">itemID (Done this way for simplicity)</label>
                                <input onChange={(e) => setNewUserItem({ ...newUserItem!, itemID: parseInt(e.target.value) })}
                                    type="number"
                                    name="itemID"
                                    id="itemID"
                                    min={0}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={newUserItem?.itemID} />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                                <input onChange={(e) => setNewUserItem({ ...newUserItem!, quantity: parseInt(e.target.value) })}
                                    type="number"
                                    min={1}
                                    name="quantity"
                                    id="quantity"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={newUserItem?.quantity} />
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input onChange={(e) => setNewUserItem({ ...newUserItem!, price: parseFloat(e.target.value) })}
                                    type="number"
                                    name="price"
                                    min={0.00}
                                    id="price"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={newUserItem?.price} />
                            </div>
                            <button type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 bg-cyan-600 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Add New Item
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div >
}
