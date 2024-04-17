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


    useEffect(() => {
        // Fetch the price and quantity available for the item
        getPriceAndQuantity({ itemID, ownerID }).then((data) => {
            setPrice(parseInt(data.price));
            setMaxQuantity(parseInt(data.quantity));
            if (parseInt(data.quantity) < 1) {
                alert("No items available for rent")
                router.replace('/')
            }
        });
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const req = await postRentalOrder({
            ownerID: ownerID,
            renterID: 1,
            startDate: fromDate,
            endDate: toDate,
        }, [{ itemID, quantity }]);
        console.log(req);
        alert("success")// go to next page
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="fromDate">Date from:</label>
                <input
                    type="date"
                    id="fromDate"
                    required
                    max={toDate}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <label htmlFor="toDate">Date to:</label>
                <input
                    type="date"
                    id="toDate"
                    value={toDate}
                    min={fromDate}
                    required
                    onChange={(e) => setToDate(e.target.value)}
                />
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    required
                    value={quantity}
                    max={maxQuantity}
                    placeholder={`maxQuantity: ${maxQuantity}`}
                    min={1} // This should be the max quantity available
                    onChange={(e) => setQuantity(e.target.value as any)}
                />
                <div className={styles.priceContainer}>
                    <p>Price:{calculatedPrice.valueOf()}</p>

                </div><button type="button" className="border p-2 border-spacing-20" onClick={calulateDays}>caluclate Price</button>
                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
}