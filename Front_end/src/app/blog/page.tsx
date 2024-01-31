
import styles from '../../styles/blog.module.css'


import blogPreviewCard from '../../components/blogPreview';

require('dotenv').config()

import { NotFoundError, ServerError } from '../lib/exceptions'

const blogsURL: string = `${process.env.URL}/api/blogs?fields[0]=title&fields[1]=description&fields[2]=id&fields[3]=urlSlug&fields[4]=createdAt&fields[5]=updatedAt&fields[6]=author&fields[7]=creationDate&populate[0]=previewIcon&populate[1]=categories`


type previewIcon = {
    id: string,
    attributes: {
        name: string,
        alternativeText: string,
        caption: string,
        width: number,
        height: number,
        formats: {
            thumbnail: {
                name: string,
                hash: string,
                ext: string,
                mime: string,
                width: number,
                height: number,
                size: number,
                path: null,
            }
        },
        hash: string,
        ext: string,
        mime: string,
        size: number,
        url: string,
        previewUrl: null,
        provider: string,
        provider_metadata: null,
        created_at: string,
        updated_at: string
    }
}

type catergories = {
    id: string,
    attributes: {
        name: string,
        createvAt: string,
        updatedAt: string,
        publishedAt: string
    }
}
type BlogPrev = {
    title: string,
    description: string,
    previewIcon?: string,
    id: string,
    slug: string,
    createdAt: string,
    categories?: catergories[];
    author: string;
    creationDate: string;
}

const getBlogs = async () => {
    try {
        const res = await fetch(blogsURL, { cache: "no-store" }) // refreshed every day / 86400 seconds, next: { revalidate: 1 }
        const blog = await res.json();
        const blogPrevs = blog.data
        return blogPrevs
    }
    catch (err: any) {
        console.log(err)
        throw new ServerError()
    }
}


export default async function () {
    try {
        const blogPreviewsRaw = await getBlogs()

        if( blogPreviewsRaw === null){ 
            throw new Error ("No blogs found sorry")
        }

        const blogPreviews: BlogPrev[] = blogPreviewsRaw.map((blog: any) => {
            return {
                id: blog.id,
                title: blog.attributes.title,
                description: blog.attributes.description,
                previewIcon: blog.attributes?.previewIcon?.data?.attributes?.url || "",
                categories: blog.attributes.categories.data || [],
                slug: blog.attributes.urlSlug,
                author: blog.attributes.author,
                creationDate: blog.attributes.creationDate
            }
        });




        return <div className="blogPageCont marginNavBar">

            <div className="content text-center">
                <h1 className="text-4xl">📝 Articles</h1>
                <h5>I like to blog about the stuff I'm interested in. Hopefully you'll find some of it interesting too.</h5>
            </div>

            <div className={styles.blogAndTopicsContainer} >
                <div className={styles.blogContainer} >
                    <div className={styles.gridTables}>
                        {blogPreviews.map((blog: any) => {
                            return <div className={styles.gridItem}>
                                {blogPreviewCard(blog.id, blog.title, blog.categories, blog.description, blog.previewIcon, blog.slug, blog.author, blog.creationDate)}
                            </div>
                        })}
                    </div>


                    {/* <div>{pageination()}</div> */}

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
    catch (err: any) {
        console.log(err)
        throw new Error(err.message)
    }
}


