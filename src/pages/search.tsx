import { GetServerSidePropsContext } from 'next';
import {
    getStrapiContent,
    postStrapiContent,
    StrapiSearch,
} from '../utils/strapi';
import { toLucky, toSearch } from '../utils/search';

const postSearch = async (newSearch: string) => {
    console.log('Creating:', newSearch);
    return postStrapiContent('searches', { search: newSearch }).then((res) =>
        console.log(res)
    );
};
export default function Search() {
    return <div>lol you shouldnt be here</div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    //TODO: Turn this into an api route
    const query = context.query.q;
    const lucky = context.query.lucky === '1';
    if (!query || typeof query !== 'string') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const res = await getStrapiContent<StrapiSearch[]>(
        'searches',
        {
            sort: 'createdAt',
        },
        '%3Adesc'
    );
    //console.log('Res:', res);
    const lastQuery = res ? res[0].attributes.search : 'What is google';

    await postSearch(query);

    const url = lucky ? toLucky(lastQuery) : toSearch(lastQuery);

    return {
        redirect: {
            destination: url,
            permanent: false,
        },
    };
}
