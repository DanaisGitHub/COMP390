import Image from 'next/image'

export default function Carousel() {
    return <div id="controls-carousel" className="relative w-full" data-carousel="static">
    
    <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <Image src="/src/assets/1689569660913.jpg" width={100} height={100} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        
        <div className="hidden duration-700 ease-in-out" data-carousel-item="active">
            <Image src="/src/assets/1689569660913.jpg" width={100} height={100} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>

    </div>
    
    
</div>
}