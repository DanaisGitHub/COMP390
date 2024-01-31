import Image from 'next/image'
import contentDisplayer from '../../../components/contentDisplay'
import styles from '../../../styles/blogIdPage.module.css'
import autoCover from '../../../assets/autoCover.jpg'


require('dotenv').config()


const getBlog = async (blogsURL:string) => {
    try {
        const res = await fetch(blogsURL, { cache: "no-store"}) // refreshed every day / 86400 seconds, next: { revalidate: 1 }
        const blog = await res.json();
        const blogPrevs = blog.data
        return blogPrevs
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
    thumbnail?: string;
    categories?: string[];
    blogCoverImage?: string;
    author:string;
    creationDate:string;
};


const parseBlogApi = (blogRaw: any) => {
    const blog: Content = {
        id: blogRaw.id,
        thumbnail: blogRaw.attributes?.previewIcon?.data?.attributes?.url || null,
        blogCoverImage:blogRaw.attributes?.blogCoverImage?.data?.attributes?.url || null,
        title: blogRaw.attributes.title,
        content: blogRaw.attributes.content,
        createdAt: blogRaw.attributes.createdAt,
        creationDate: blogRaw.attributes.creationDate,
        author: blogRaw.attributes.author
    }
    return blog

}


// well done functionality is there, but it needs to be styled
export default async function Blog({ params, searchParams }: { params: any, searchParams: any }) {
    try {
        const id = searchParams.id;
        //const blogURL = `${process.env.URL}/api/blogs/${id}`
        const blogURL = `https://personalwebstrapi-production.up.railway.app/api/blogs/${id}?populate[0]=previewIcon&populate[1]=blogCoverImage`
        const blogRaw = await getBlog(blogURL)
        const content = parseBlogApi(blogRaw)

        return <><div className='blogIdContainer'>
            <div id="coverImageContainer" style={{ width: "100%", height: "40vh", backgroundColor: "blanchedalmond" }} >
                <Image src={content.blogCoverImage === null ? autoCover : content.blogCoverImage! } alt="someImage" style={{ objectFit: "cover" }} width={4000} height={2000}  className='w-full h-full relative overflow-hidden'></Image>
            </div>

            <div id="previewIconContainer" style={{ width: "314px", height: "176px", }} className=" bottom-20 relative ml-3 rounded-xl">
                <Image src={content.thumbnail === null ? autoCover : content.thumbnail! } alt="someImage" style={{ objectFit: "cover" }} width={314} height={176} className='w-full h-full rounded-xl'></Image>
            </div>
            <div className='ml-3 bottom-10 relative text-5xl'>
                <h1>{content.title}</h1>
            </div>
            <div className='ml-3 bottom-10 relative'>
            
            </div>
            <div className=' bottom-10 relative'>
            {contentDisplayer({ content })}
            </div>
            
        </div> </>
    } catch (err: any) {
        console.log(err)
        throw new Error(err.message)
    }


}

