import axios from 'axios';
import path from 'path';
import qs from 'qs';

const STRAPI_URL = 'https://marimari.tech/cms/api/';
// process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337/api/';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

export async function getStrapiContent<T>(
    apiPath: string,
    params: Record<string, unknown> = {},
    extra = '',
    token = STRAPI_TOKEN
): Promise<T | undefined> {
    return axios
        .get<{ data: T }>(
            path.join(STRAPI_URL, apiPath) + '?' + qs.stringify(params) + extra,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(({ data }) => data.data)
        .catch((e) => {
            console.log(e);
            return undefined; //TODO: Do I need to do this
        });
}

export async function postStrapiContent<T>(
    apiPath: string,
    params: Record<string, unknown> = {},
    token = STRAPI_TOKEN
): Promise<T | undefined> {
    console.log(
        `Posting ${JSON.stringify(
            params
        )} to ${STRAPI_URL}${apiPath} token: ${token}`
    );
    return fetch(path.join(STRAPI_URL, apiPath) + '?' + qs.stringify(params), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: params }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response);
            return response.json();
        })
        .then(({ data }) => data.data)
        .catch((e) => {
            console.log(e);
            return undefined;
        });
}

export async function putStrapiContent<T>(
    apiPath: string,
    params: Record<string, unknown> = {},
    token = STRAPI_TOKEN
): Promise<T | undefined> {
    console.log(apiPath, 'Using token:', token);
    return axios
        .put<{ data: T }>(
            path.join(STRAPI_URL, apiPath),
            { data: params },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((res) => {
            //console.log('Put:', res);
            return res;
        })
        .then(({ data }) => data.data)
        .catch((e) => {
            console.log('Erorr performing put:', e);
            return undefined;
        });
}

type StrapiContent<T> = {
    id: number;
    attributes: T & StrapiTimestamp;
};

export type StrapiSearch = StrapiContent<{ search: string }>;
export type GlobalContent = {
    about: AboutContent;
    projects: ProjectContent[];
};

type StrapiTimestamp = {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
};

export type AboutContent = StrapiContent<{
    aboutText: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}>;

export type ProjectContent = StrapiContent<{
    title: string;
    description: string;
    repoLink: string;
    liveLink: string;
    brief: string;
    desktopPreview: { data: StrapiImage };
    mobilePreview: { data: StrapiImage };
}>;

export type StrapiImage = StrapiContent<{
    alternativeText: string;
    width: number;
    height: number;
    url: string;
}>;
