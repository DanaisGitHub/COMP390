'use client'
import Link from "next/link";
import styles from "../styles/header.module.css"
import avatar from "../components/Base/avatarImage"
import { useEffect, useState } from "react";



export default function header() {
    let [navOpen, setNavOpen] = useState(false);
    return <header className="flex sm:justify-start z-40 w-full text-sm py-4  border-b-2 max-h-min">
        <nav className=" w-full mx-auto  flex justify-between " aria-label="Global">
            <div className=" hidden w-full flex-row items-center gap-5 mt-5 justify-between  sm:mt-0 sm:pl-5 text-lg sm:flex">
                <Link href="/productsearch" className={styles.eachLink}>Find an Item</Link>
                <Link href="/Menu/Profile" className={styles.eachLink}>My Profile</Link>
                <Link href="/" className="flex items-center justify-start ">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap"><b>Rent</b>Bie</span>
                </Link>
                <Link href="/Menu/List-Item" className={styles.eachLink}>List an Item</Link>
                <Link href="/Menu" className={styles.eachLink}> Menu</Link>
            </div>
            <div className="flex w-full  sm:hidden">
                <Link href="/" className="flex items-center justify-start ">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap"><b>Rent</b>Bie </span>
                </Link>
                <div className=" flex w-full justify-end " onClick={() => setNavOpen(!navOpen)}>
                    <button type="button" className={navOpen ? " inline-flex items-center justify-center p-2 rounded-md  text-white bg-gray-700 outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-white" : "inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-white"} aria-controls="mobile-menu" aria-expanded="false">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={navOpen ? " navPopUp fixed z-50 bg-gray-200 rounded-r-3xl border-t-2 border-r-2 border-black min-h-full left-0 top-0 w-3/5 p-10" : " hidden"}>
                <nav className="flex flex-col h-3/6 justify-between w-full ">
                    <Link href="/blog"
                        className={styles.eachLink} onClick={() => setNavOpen(!navOpen)}>Find an Item</Link>
                    <Link href="/book"
                        className={styles.eachLink} onClick={() => setNavOpen(!navOpen)}>My Profile</Link>
                    <Link href="/CV"
                        className={styles.eachLink} onClick={() => setNavOpen(!navOpen)}>List an Item</Link>
                    <Link href="/contact-us"
                        className={styles.eachLink} onClick={() => setNavOpen(!navOpen)}>Menu</Link>
                </nav>
            </div>
        </nav>
    </header>
}
