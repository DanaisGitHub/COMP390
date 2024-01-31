import Link from "next/link";
import emptyBook from '../assets/emptyBook.jpeg';

import Image from 'next/image'

export default function bookPreview(id: number, title: string, categories: string[], description: string, thumbnail: string, slug: string) {
    return (
        <Link href={`/book/${slug}?id=${id}`}
            className="flex flex-row items-center hover:scale-105 transition ease-in-out duration-250 transform"
        >
            <Image
                    className=" h-[50vh] max-md:h-auto w-1/2  mx-auto"
                src={thumbnail === null ? emptyBook : thumbnail}
                alt=""
                style={{ objectFit: "contain", minHeight:"100%"}}
                height="1000"
                width="1000"
            />
            <div className="flex flex-col w-2/3 justify-between p-4 leading-normal">
                <h5 className="mb-2 text-xl  font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </Link>
    );
}
