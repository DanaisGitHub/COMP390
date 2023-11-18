import Link from "next/link";
import Router from "next/router";
import styles from "../styles/header.module.css"
import { useEffect,useState } from "react";



export default function header() {



    let [navOpen, setNavOpen] = useState(false);
    return <header className="flex sm:justify-start z-40 w-full text-sm py-4 dark:bg-gray-800 border-b-2 max-h-min">
        <nav className="max-w-[85rem] w-full mx-auto px-4 flex justify-between " aria-label="Global">
            <Link href="/" className="flex items-center justify-start ">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Danai <b>Zerai</b></span>
            </Link>
            <div className=" hidden flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:pl-5 text-lg sm:flex">
                <Link href="/blog"
                    className={styles.eachLink}>Blog</Link>

                <Link href="/book"
                    className={styles.eachLink}>Book Reviews</Link>

                {/* Why do you spase out and cause the other to have styelings */}
                <Link href="/CV"
                    className={styles.eachLink}>CV</Link>


                <Link href="/contact-us"
                    className={styles.eachLink}>Contact</Link>


            </div>
            <div className={styles.mainMenu} onClick={()=>setNavOpen(!navOpen)}>
                <button type="button" className={navOpen ? " inline-flex items-center justify-center p-2 rounded-md  text-white bg-gray-700 outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-white":"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-white"} aria-controls="mobile-menu" aria-expanded="false">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

            </div>

            <div className= {navOpen?" navPopUp fixed z-50 bg-gray-200 rounded-r-3xl border-t-2 border-r-2 border-black min-h-full left-0 top-0 w-3/5 p-10":" hidden"}>
                <nav className="flex flex-col h-3/6 justify-between w-full ">
                <Link href="/"
                    className={styles.eachLink} onClick={()=>setNavOpen(!navOpen)}>Home</Link>

                <Link href="/blog"
                    className={styles.eachLink} onClick={()=>setNavOpen(!navOpen)}>Blog</Link>

                <Link href="/book"
                    className={styles.eachLink} onClick={()=>setNavOpen(!navOpen)}>Book Reviews</Link>

                {/* Why do you spase out and cause the other to have styelings */}
                <Link href="/CV"
                    className={styles.eachLink} onClick={()=>setNavOpen(!navOpen)}>CV</Link>


                <Link href="/contact-us"
                    className={styles.eachLink} onClick={()=>setNavOpen(!navOpen)}>Contact</Link>

                </nav>
                

            </div>


        </nav>
    </header>
}
