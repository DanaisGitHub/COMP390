'use client'
import { useEffect, useState } from 'react';
import { getUserItems, getUserDetails, updateUserDetails } from "../../../../lib/UserDetailsAPI";
import { BasicUserType } from '@/types/API_Types/User/UserApiTypes';
import { useRouter } from 'next/navigation';

export default function MyProfile() {
    const [userDetails, setUserDetails] = useState<BasicUserType>();
    const router = useRouter();



    const fetchData = async () => {
        try {
            const getUserItems: BasicUserType = await getUserDetails(10);
            setUserDetails(getUserItems)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await updateUserDetails(userDetails!);
        alert("success")// go to next page

    };

    return <div>
        <section className="bg-gray-50 dark:bg-gray-900 bg-green-700 h-[100%] p-4 ">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100%] lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create and account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <input onChange={(e) => setUserDetails({ ...userDetails!, firstName: e.target.value })} type="firstName" name="firstName" id="firstName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userDetails?.firstName} />
                            </div>
                            <div>
                                <label htmlFor="sureName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Surename</label>
                                <input onChange={(e) => setUserDetails({ ...userDetails!, lastName: e.target.value })} type="text" name="sureName" id="sureName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userDetails?.lastName} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={(e) => setUserDetails({ ...userDetails!, userEmail: e.target.value })} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userDetails?.userEmail} />
                            </div>
                            <div>
                                <label htmlFor="latitude" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Latitiude</label>
                                <input onChange={(e) => setUserDetails({ ...userDetails!, lat: parseFloat(e.target.value) })} type="number" name="latitude" id="latitude" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userDetails?.lat} />
                            </div>
                            <div>
                                <label htmlFor="Longitude" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Longitude</label>
                                <input onChange={(e) => setUserDetails({ ...userDetails!, lng: parseFloat(e.target.value) })} type="number" name="Longitude" id="Longitude" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={userDetails?.lng} />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 bg-cyan-600 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div >
}
