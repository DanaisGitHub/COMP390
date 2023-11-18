import Link from 'next/link'
import Image from 'next/image'
const noImageLink = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.QiAAM1z2YIX52LOQgQlr3gHaHa%26pid%3DApi&f=1&ipt=3849f250d63a1ec85d80b7b445999ad670efe531a2d047c5b4e2dc94cbc7d86d&ipo=images"

export default function blogPreviewCard(id: number, title: string, catergories: string[], description: string, thumbnail: string, slug: string, author: string, creationDate: string) {

  return <Link href={`/blog/${slug}?id=${id}`}><div className="  bg-white max-w-sm rounded overflow-hidden shadow-lg hover:scale-105 transition ease-in-out duration-250 transform " style={{ width: "350px" }}>
    <div className=' bg-white border-b-2 border-lime-400 ' >
      <Image className=" max-h-64 max-w-sm mx-auto shadow-xl  " src={thumbnail === "" ? "" : `${thumbnail}`} width={383} height={255} alt="Sunset in the mountains" style={{ objectFit: "cover" }}></Image>
    </div>
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{title}</div>
      <p className=" text-base">
        {description}
      </p>
    </div>
    <div className="px-6 pt-4 pb-2">
      {catergories.map((cat: any) => { return <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{cat.attributes.name}</span> })}

    </div>
    <div className=" flex flex-row w-full justify-between px-2 text-xs text-zinc-500">
      <span>
        Created on: {creationDate}
      </span>
      <span>
        Author was {author}
      </span>
    </div>
  </div>
  </Link>
}
// title is slug + link



// {
//     data: {
//       id: 1,
//       attributes: {
//         title: 'Test Blog',
//         urlSlug: 'test-blog',
//         content: '# My Awesome Blog Post\n' +
//           '\n' +
//           "Welcome to my blog! In this post, I'll be discussing how to use Markdown to format your blog content, including code snippets.\n" +
//           '\n' +
//           '## Introduction\n' +
//           '\n' +
//           "Markdown is a lightweight markup language that allows you to write plain text with simple formatting syntax. It's widely used for creating blog posts, documentation, and more.\n" +
//           '\n' +
//           '## Code Snippets\n' +
//           '\n' +
//           "To include a code snippet in your blog post, you can use Markdown's code block syntax. Simply wrap your code with three backticks (\\`\\`\\`) and specify the language after the opening backticks. Here's an example in Python:\n" +
//           '\n' +
//           '```python\n' +
//           '\n' +
//           'def greet(name):\n' +
//           '    print(f"Hello, {name}!")\n' +
//           '\n' +
//           'greet("John")\n',
//         description: 'its a test',
//         timeStamp: 'today',
//         createdAt: '2023-07-06T05:47:44.832Z',
//         updatedAt: '2023-07-16T16:12:23.405Z',
//         publishedAt: '2023-07-06T05:49:59.771Z'
//       }
//     },
//     meta: {}
//   }