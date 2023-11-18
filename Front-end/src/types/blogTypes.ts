export type BlogPreview =  {
    id:number,
    image:string,
    title:string,
    description: string,
    rating?:number,
    author?:string
    date?:Date
}

export type BlogType = {
    image:string,
    title:string,
    description: string,
    rating?:number,
    author?:string
    date?:Date
}