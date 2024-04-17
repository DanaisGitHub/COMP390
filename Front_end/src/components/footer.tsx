

export default function footer() {
    return <footer className="relative bg-blueGray-200 pt-8 pb-6 border-t-2 mt-9">
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap text-left lg:text-left">
                <div className="w-full lg:w-6/12 md:px-4">
                    <h4 className="text-3xl fonat-semibold text-blueGray-700">Let's keep in touch!</h4>
                    <h5 className="text-lg mt-0 mb-2 text-blueGray-600">
                        Find us on any of these platforms, we respond 1-2 business days.
                    </h5>
                    <span className="mt-6 lg:mb-0 mb-6 flex gap-3 flex-wrap justify-centermax-w-full">
                        {/* facebok */}
                        <a href="" target="__blank">
                            <svg
                                className="w-6 h-6 text-blue-600 fill-current  rounded-full  cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                />
                            </svg>
                        </a>

                        {/* twitter */}
                        <a href="" target="__blank">
                            <svg
                                className="w-7 h-7 text-blue-300 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                                />
                            </svg>
                        </a>

                        {   /*whatsapp*/}
                        <a href="" target="__blank">
                            <svg
                                className="w-7 h-7 text-green-400 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512">
                                <path
                                    d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
                                ></path>
                            </svg>
                        </a>

                        {/*Linkedin*/}
                        <a href="" target="__blank">
                            <svg
                                className="w-7 h-7 text-blue-500 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512">
                                <path
                                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                ></path>
                            </svg>
                        </a>

                        {/* <!-- Github --> */}
                        <a href="" target="__blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 "
                                fill="currentColor"
                                style={{ color: "#333" }}
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* <!-- Instagram --> */}
                        <a href="" target="__blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="currentColor"
                                style={{ color: "#c13584" }}
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>


                        {/* <!-- Stack overflow --> */}
                        <a href="" target="__blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="currentColor"
                                style={{ color: "#f48024" }}
                                viewBox="0 0 24 24">
                                <path
                                    d="M15 21h-10v-2h10v2zm6-11.665l-1.621-9.335-1.993.346 1.62 9.335 1.994-.346zm-5.964 6.937l-9.746-.975-.186 2.016 9.755.879.177-1.92zm.538-2.587l-9.276-2.608-.526 1.954 9.306 2.5.496-1.846zm1.204-2.413l-8.297-4.864-1.029 1.743 8.298 4.865 1.028-1.744zm1.866-1.467l-5.339-7.829-1.672 1.14 5.339 7.829 1.672-1.14zm-2.644 4.195v8h-12v-8h-2v10h16v-10h-2z" />
                            </svg>
                        </a>

                        {/* <!-- Youtube --> */}
                        <a href="" target="__blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="currentColor"
                                style={{ color: "#ff0000" }}
                                viewBox="0 0 24 24">
                                <path
                                    d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>

                        {/* <!-- Slack --> */}
                        <a href="" target="__blank">
                            <svg
                                className="h-7 w-7"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "#3eb991" }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill-rule="evenodd"
                                clip-rule="evenodd">
                                <path
                                    d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
                            </svg>
                        </a>

                        {/* <!-- Twitch --> */}
                        <a href="" target="__blank">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                fill="currentColor"
                                style={{ color: "#9146ff" }}
                                viewBox="0 0 24 24">
                                <path
                                    d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"
                                    fill-rule="evenodd"
                                    clip-rule="evenodd" />
                            </svg>
                        </a>





                    </span>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                    <div className="flex flex-wrap items-top mb-6">
                        <div className="w-full lg:w-4/12 px-4 ml-auto">
                            <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">Useful Links</span>
                            <ul className="list-unstyled">
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">About Us</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Blog</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Github</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Free Products</a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full lg:w-4/12 px-4">
                            <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2">Other Resources</span>
                            <ul className="list-unstyled">
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">MIT License</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Terms &amp; Conditions</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Privacy Policy</a>
                                </li>
                                <li>
                                    <a className="text-blueGray-600 hover:text-blueGray-800 font-semibold block pb-2 text-sm" href="">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="my-6 border-blueGray-300"></hr>
            <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                    <div className="text-sm text-blueGray-500 font-semibold py-1">
                        Copyright © <span id="get-current-year">2023
                            Danai Zerai
                        </span>


                    </div>
                </div>
            </div>
        </div>
    </footer>
}
