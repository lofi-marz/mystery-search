import Head from 'next/head';
import clsx from 'clsx';
import { body, title } from '@/styles/fonts';
import { AnimatePresence, motion, Variants, LayoutGroup } from 'framer-motion';
import { FaHandSparkles, FaMagic, FaSearch } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { MouseEventHandler, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import {
    getStrapiContent,
    postStrapiContent,
    StrapiSearch,
} from '../utils/strapi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconType } from 'react-icons';

export const underlineVariants: Variants = {
    hide: { scaleX: 0 },
    show: { scaleX: 1, transition: { ease: 'easeOut', duration: 2 } },
};

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
export default function Home() {
    const [search, setSearch] = useState('');
    const iconMap = {
        search: FaSearch,
        magic: FaMagic,
    };
    const [icon, setIcon] = useState<keyof typeof iconMap>('search');
    const Icon = iconMap[icon];
    console.log(icon, Icon.name);

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
                            <SearchIcon Icon={Icon} />
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
                    <Buttons
                        searchQuery={encodeURIComponent(search)}
                        onHover={(s) => setIcon(s as keyof typeof iconMap)}
                    />
                </form>
            </div>
        </main>
    );
}

function SearchIcon({ Icon }: { Icon: IconType }) {
    return (
        <motion.div className="" layout>
            <AnimatePresence mode="wait">
                <motion.div
                    key={Icon.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <Icon />
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

function Buttons({
    searchQuery,
    onHover,
}: {
    searchQuery: string;
    onHover: (icon: string) => void;
}) {
    return (
        <motion.div
            layout
            transition={{ ease: 'easeOut' }}
            className="flex w-full flex-row items-center justify-center gap-2 md:gap-5">
            <LayoutGroup>
                <IconButton
                    Icon={FaSearch}
                    text="Search"
                    href={`/search?q=${searchQuery}`}
                    onHover={() => onHover('search')}
                    onHoverEnd={() => onHover('search')}
                />
                <IconButton
                    Icon={FaMagic}
                    text="I'm feeling very lucky"
                    href={`/search?q=${searchQuery}&lucky=1`}
                    onHover={() => onHover('magic')}
                    onHoverEnd={() => onHover('search')}
                />
            </LayoutGroup>
        </motion.div>
    );
}

type IconButtonProps = {
    Icon: IconType;
    text: string;
    href: string;
    onHover: () => void;
    onHoverEnd: () => void;
};
function IconButton({
    Icon,
    text,
    href,
    onHover,
    onHoverEnd,
}: IconButtonProps) {
    return (
        <motion.a
            className="button p-5 transition-all"
            href={href}
            onHoverStart={onHover}
            onHoverEnd={onHoverEnd}>
            <Icon />
        </motion.a>
    );
}
