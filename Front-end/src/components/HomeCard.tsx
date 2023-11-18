import styles from '../styles/HomeCard.module.css'
import Link from 'next/link'
import Image from 'next/image'


export default function HomeCard(id: number, title: string, description: string, link: string, imageLink: any) {//crossOrign in space
    return <div>
        <Link href={link}>
            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
            <link rel="preconnect" href="https://fonts.gstatic.com"></link>
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&family=Roboto:wght@300&display=swap" rel="stylesheet"></link>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"></link>

            <div className={styles.main}>
                <div className={styles.card}>
                    <Image src={imageLink} alt={''} />
                    <div className="card-content">
                        <h2 className='  bg-slate-200 text-gray-800 font-extrabold text-3xl px-1'>
                            {title}
                        </h2>
                        <p style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                            {description}
                        </p>
                        <button className="button px-2 py-1">
                            Find out more
                            <span className="material-symbols-outlined">
                                arrow_right_alt
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    </div>
}