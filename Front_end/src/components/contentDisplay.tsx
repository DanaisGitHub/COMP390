// need to figure out how to get blog format to show up properly



import Head from 'next/head';
import Markdown from "markdown-to-jsx";
import MarkDownIt from 'markdown-it'



type Content = {
    id: number;
    createdAt: string;
    title: string;
    content: string;
    author: string;
    creationDate:string


};

type Props = {
    content: Content;
};


const md = new MarkDownIt()



export default function BlogPage({ content }: Props) {
    const htmlContent = md.render(content.content)
    return (
        <article>
            <Head>
                <title >{content.title} | Your Blog</title> not working
            </Head>

            <div className="container  mx-auto md:px-10  mt-28">

                <div className="blogMetaData flex flex-row justify-between  max-w-none mx-auto w-full md:w-6/12 md:p-5 text-zinc-500">
                    <span>
                        Created on: {content.creationDate}
                    </span>
                    <span>
                        Author was: {content.author}
                    </span>
                </div>
                <div style={{overflowWrap: "break-word"}}className="prose max-w-none mx-auto w-full  p-2 md:w-6/12  mb-16 bg-slate-100 md:p-5 rounded-xl md:shadow-2xl" ><section dangerouslySetInnerHTML={{ __html: htmlContent }}></section></div>

            </div>
        </article>
    );
};




