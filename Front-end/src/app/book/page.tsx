import styles from '../../styles/book.module.css'
import pageination from '@/components/pageination'
import { BookPreview } from '../../types/bookTypes'
import bookPreviewCard from '../../components/bookPreview';
import { NotFoundError, ServerError } from '../lib/exceptions'

require('dotenv').config()


const bookURL: string = `${process.env.URL}/api/reviews?fields[0]=title&fields[1]=description&fields[2]=id&fields[3]=urlSlug&fields[4]=createdAt&fields[5]=updatedAt&fields&populate[0]=previewImage&populate[1]=categories`





const getBlogs = async () => {
    try {
        const res = await fetch(bookURL, { cache: "no-store" }) // refreshed every day / 86400 seconds
        const book = await res.json();
        const bookPrev = book.data
        return bookPrev
    }
    catch (err: any) {
        console.log(err)
        throw new ServerError()
    }
}


const bookParser = (book: any) => {
    const bookPrev: any = {
        id: book.id,
        title: book.attributes.title,
        description: book.attributes.description,
        image: book.attributes?.previewImage?.data?.attributes?.url || "",
        slug: book.attributes.urlSlug,
        categories: book.attributes?.categories?.data || [],

    }
    return bookPrev
}

export default async function bookPage() {
    const bookPreviewsRaw = await getBlogs()
    const bookPreviews = bookPreviewsRaw.map((book: any) => bookParser(book))


    return <div className="bookPageCont">
        <div className="content text-center">
            <h1 className="text-4xl">
                Library of Book Reviews 📖
            </h1>
            <h5><cite>Wisdom is a torch the blind use to see again</cite></h5>
        </div>

        <div className={styles.bookAndTopicsContainer} >
            <div className={styles.bookContainer} >

                <div className={styles.gridTables}>
                    {bookPreviews.map((prev: any) => <div className={styles.gridItem}>
                        {
                            bookPreviewCard(prev.id, prev.title, prev.categories, prev.description, prev.image, prev.slug)
                        }
                    </div>
                    )}
                </div>
            </div>
            {/* <div className={styles.topicsContainer}>
                <b>Browse Topics</b>
                <ul>
                    <li>
                        x
                    </li>
                    <li>
                        x
                    </li>
                    <li>
                        x
                    </li>
                    <li>
                        This will be dynamically generated
                    </li>
                </ul>

            </div> */}
        </div>

    </div>
}