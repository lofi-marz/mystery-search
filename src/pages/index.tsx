import Head from 'next/head';
import clsx from 'clsx';
import { body, title } from '@/styles/fonts';
import { motion, Variants } from 'framer-motion';
import { FaHandSparkles, FaMagic, FaSearch } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import {
    getStrapiContent,
    postStrapiContent,
    StrapiSearch,
} from '../utils/strapi';
import { SubmitHandler, useForm } from 'react-hook-form';

export const underlineVariants: Variants = {
    hide: { scaleX: 0 },
    show: { scaleX: 1, transition: { ease: 'easeOut', duration: 2 } },
};
function toSearch(query: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function toLucky(query: string) {
    return toSearch(query) + '&btnI';
}
/*function Kofi() {
    return (
        <a href="https://ko-fi.com/Y8Y3KQQUY" target="_blank">
            <img
                height="36"
                style="border:0px;height:36px;"
                src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
                border="0"
                alt="Buy Me a Coffee at ko-fi.com"
            />
        </a>
    );
}
*/
type SearchFormInputs = { search: string };
export default function Home({ query }: { query: string }) {
    const [search, setSearch] = useState('');

    const postSearch = async (newSearch: string) => {
        console.log('Creating:', newSearch);
        return postStrapiContent('searches', { search: newSearch }).then(
            (res) => console.log(res)
        );
    };
    return (
        <main
            className={clsx(
                'dark relative flex h-screen w-full items-center justify-center overflow-clip bg-dark-950',
                title.variable,
                body.variable
            )}>
            <Head>
                <title>Mystery Search</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="absolute flex h-full w-full items-center justify-center text-[72rem] text-dark-800 opacity-[0]">
                <FaSearch className="md:ml-48" />
            </div>
            <div className="absolute mb-[5vh] flex h-full w-full flex-col items-center justify-center gap-12 p-8 font-title dark:text-dark-50">
                <header className="relative flex flex-col items-center justify-center gap-4 px-6 text-center text-6xl font-bold lowercase md:items-start">
                    <span className="z-50 text-dark-50">Mystery Search</span>
                    <div className="-mt-4 h-4 w-full ">
                        <motion.div
                            variants={underlineVariants}
                            className="bg-gradient h-full w-full"
                            initial="hide"
                            animate="show"
                        />
                    </div>
                </header>
                <form className="flex w-full flex-col items-center justify-center gap-6 font-body lg:w-1/2">
                    <div className="card-dark flex w-full flex-row overflow-clip bg-dark-900 p-0 text-2xl saturate-0">
                        <div className="flex aspect-square items-center justify-center px-6">
                            <FaSearch />
                        </div>
                        <input
                            className="w-full border-0 bg-dark-900 px-6 py-0 py-4 pr-6 text-2xl saturate-0 focus:border-0 focus:outline-0"
                            placeholder=""
                            type="search"
                            required
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full flex-row items-center justify-center gap-2 md:gap-5">
                        <button
                            className="button p-5"
                            onClick={(e) => {
                                e.preventDefault();
                                postSearch(search).then(
                                    () =>
                                        (window.location.href = toSearch(query))
                                );
                            }}>
                            <FaSearch />
                        </button>
                        <button
                            className="button p-5"
                            onClick={(e) => {
                                e.preventDefault();
                                postSearch(search).then(
                                    () =>
                                        (window.location.href = toLucky(query))
                                );
                            }}>
                            <FaMagic />
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await getStrapiContent<StrapiSearch[]>(
        'searches',
        {
            sort: 'createdAt',
        },
        '%3Adesc'
    );
    console.log('Res:', res);
    const query = res ? res[0].attributes.search : 'What is google';

    return { props: { query } };
};
