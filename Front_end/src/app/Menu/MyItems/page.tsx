'use client'
import ProductPreview from '../../../components/Product/productPreview';
import { ProductPreviewType } from '../../../types/API_Types/Book/BookApiTypes'
import { useState, useEffect } from 'react'
import { getMyItems } from '../../../../lib/ProductAPI'

export default function MyItems() {
    const [myItems, setMyItems] = useState<ProductPreviewType[]>([]);
    const fetchMyItems = async () => {    
        try {
            const data:ProductPreviewType[] = await getMyItems(15)
            setMyItems(data);
        }
        catch (err: any) {
            console.error(err);
            throw new Error("Error fetching data " + err.message);
        }
    }
    useEffect(() => {
        fetchMyItems();
    }, [])

    return <div>
        <h1>My Items</h1>
        {/* <div className="productList">
            {myItems.map((item) => {
                return <ProductPreview key={item.bookID} book={item} />
            })}
        </div> */}

    </div>
}