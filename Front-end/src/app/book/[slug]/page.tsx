import Markdown from "markdown-to-jsx";
import contentDisplayer from '../../../components/contentDisplay'
import emptyBook from '../../../assets/emptyBook.jpeg';

import Image from 'next/image'

require('dotenv').config()


const getBook = async (bookURL: string) => {
    try {
        const res = await fetch(bookURL, { cache: "no-store" }) // refreshed every day / 86400 seconds
        const book = await res.json();
        const bookPrev = book.data
        return bookPrev
    }
    catch (err: any) {
        console.log(err)
        throw new Error(err.message)
    }
}

type Content = {
    id: number;
    createdAt: string;
    title: string;
    content: string;
    bookImage: string;
    description: string;
    creationDate: string;
    author: string;
};
const parseBookApi = (bookRaw: any): Content => {
    const book: Content = {
        id: bookRaw.id,
        title: bookRaw.attributes.title,
        content: bookRaw.attributes.content,
        bookImage: bookRaw.attributes?.previewImage?.data?.attributes?.url || null,
        createdAt: bookRaw.attributes.createdAt,
        description: bookRaw.attributes.description,
        creationDate: bookRaw.attributes.creationDate,
        author: bookRaw.attributes.author,

    }
    return book

}


// well done functionality is there, but it needs to be styled
export default async function Book({ params, searchParams }: { params: any, searchParams: any }) {
    const id = searchParams.id;
    const bookURL = `${process.env.URL}/api/reviews/${id}?&populate[0]=previewImage`
    const bookRaw = await getBook(bookURL)
    const content: Content = parseBookApi(bookRaw)
    console.log(bookRaw)

    return <div className="bookIdContainer marginNavBar">
        <div className="bookOpenerContainer w-full flex max-md:flex-col" style={{ minHeight: "50vh" }} >
            <div className=" w-2/5 min-h-full max-md:w-full max-md:py-3">
                <Image
                    className=" min-h-full w-1/2 rounded-lg border-r mx-auto"
                    src={content.bookImage === null ? emptyBook : content.bookImage!}
                    alt=""
                    style={{ objectFit: "contain" }}
                    height="1000"
                    width="1000"
                />

            </div>
            <div className=" w-3/5 min-h-full  max-md:w-full flex flex-col">
                <div className="bookTitle text-center text-7xl h-1/2  max-md:text-5xl max-md:py-3">
                    {content.title}
                </div>
                <div className="bookDescription mx-auto py-auto text-center py-12 h-1/2 w-1/2 max-md:py-3 ">
                    {content.description}
                </div>
            </div>
        </div>
        <div >
            {contentDisplayer({ content })}
        </div>

    </div>
}
