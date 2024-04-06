export default function SearchWithQuery ({params}:any){
    const {slug} = params
    return <div>
        <h1>{slug}</h1>
    </div>
}