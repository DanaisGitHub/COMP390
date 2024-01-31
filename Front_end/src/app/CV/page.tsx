
import A4 from '../../components/A4'

const cmsURL: string = `${process.env.URL}/api/cvs` // must be something to do with it being in localhost

const getCV = async () => {
    try {
        const res = await fetch(cmsURL,{ cache:"force-cache",next: { revalidate: 1 }});
        const jsonData = await res.json();
        if (jsonData.data.length === 0) throw new Error("No CV data found")
        console.log(jsonData.data[0].attributes);
        return jsonData.data[0].attributes.cvContent;
    }
    catch (err:any) {
        console.log("ERRRRRRRRRRRRRRRRRRRRRRROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOORRRRRRRRRRRRRRRRRR")
        console.log(err);
        throw new Error(err) ;
    }

}


export default async function HomeCard() {

    const data = await getCV();

    return <div>
        {A4(data as unknown as string)}
    </div>
}