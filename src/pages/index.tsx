import Head from 'next/head';
import clsx from 'clsx';
import { body, title } from '@/styles/fonts';
import { motion, Variants } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
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
            <div className="absolute flex h-full w-full flex-col items-center justify-center gap-12 p-6 font-title dark:text-dark-50">
                <header className="relative px-6 text-center text-6xl font-bold lowercase">
                    <h1 className="z-50">Mystery Search</h1>
                </header>
                <form className="flex w-full flex-col items-center justify-center gap-12 lg:w-1/2">
                    <input
                        className="card-light w-full border-0  p-3 px-6 text-2xl focus:border-0 focus:outline-0"
                        placeholder=""
                        type="search"
                        required
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex w-full flex-row items-center justify-center gap-2 md:gap-5">
                        <button
                            className="card-light text-xl md:px-6"
                            onClick={(e) => {
                                e.preventDefault();
                                postSearch(search).then(
                                    () =>
                                        (window.location.href = toSearch(query))
                                );
                            }}>
                            Search
                        </button>
                        <button
                            className="card-light grow text-xl sm:grow-0 md:px-6"
                            onClick={(e) => {
                                e.preventDefault();
                                postSearch(search).then(
                                    () =>
                                        (window.location.href = toLucky(query))
                                );
                            }}>
                            I&apos;m Feeling Very Lucky
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
