import Image from 'next/image'
import imaage from '../../assets/SQUARE.jpg'
 
export default function Page(image?: string,borderThickness?: number) {
  return (
    <Image
      src={imaage}
      width={40}
      height={40}
      alt="Picture of the author"
      className={`rounded-full border-${borderThickness??2} border-white`}
    />
  )
}