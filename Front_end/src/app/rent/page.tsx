'use client'
import { use, useEffect, useState } from 'react';
import styles from '../../styles/Booking.module.css';
import { getPriceAndQuantity, postRentalOrder } from '../../../lib/RentAPI';
import { useRouter } from 'next/navigation';

export default function Booking({ searchParams }: any) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('')
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const router = useRouter();


    let { ownerID, itemID } = searchParams;
    ownerID = parseInt(ownerID);
    itemID = parseInt(itemID);

    const calulateDays = () => {
        const date1 = new Date(fromDate);
        const date2 = new Date(toDate);
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        if (diffDays < 1) {
            diffDays = 1
        }
        setCalculatedPrice(diffDays * price * quantity);
        return diffDays * price * quantity;
    };


    useEffect( () => {
        // Fetch the price and quantity available for the item
        getPriceAndQuantity({ itemID, ownerID }).then((data) => {
            setPrice(parseInt(data.price));
            setMaxQuantity(parseInt(data.quantity));
            if (parseInt(data.quantity) < 1) {
                alert("No items available for rent")
                router.replace('/productsearch')
            }
        }).catch((err: any) => {
            console.error(err)
        })
    }, []);

    const handleSubmit = async (e: any) => {
        try {
            e.preventDefault();
            const req = await postRentalOrder({
                ownerID: ownerID,
                renterID: -1,// defined in function
                startDate: fromDate,
                endDate: toDate,
            }, [{ itemID, quantity }]);
            alert("success")// go to next page
            router.replace('/productsearch')
        } catch (err: any) {
            console.error(err)
            alert("failed Purchase " + err.err)
        }
    };

    return (
        <div className="container mx-auto bg-slate-100 px-4 py-8">

            <form onSubmit={handleSubmit} className="bg-white mx-auto w-1/2 shadow-lg rounded-lg p-6 flex flex-col space-y-4">
                <p>Price: £{price} per/Day</p>
                <p>Max Quantity: {maxQuantity}</p>
                <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">Date from:</label>
                    <input
                        type="date"
                        id="fromDate"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        max={toDate}
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">Date to:</label>
                    <input
                        type="date"
                        id="toDate"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={toDate}
                        min={fromDate}
                        required
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        value={quantity}
                        max={maxQuantity}
                        placeholder={`Max Quantity: ${maxQuantity}`}
                        min={1}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Price: <span className="text-lg font-semibold">{calculatedPrice.valueOf()}</span></p>
                    <button type="button" className="ml-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={calulateDays}>Calculate Price</button>
                </div>
                <button type="submit"
                    className="py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>
            </form>
        </div>
    );
}