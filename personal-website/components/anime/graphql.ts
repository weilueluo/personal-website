import { FilterItem } from "./search";

export const MY_USER_ID = 6044692;
export const PAGE_SIZE = 12;

////////////////////////////////////// query

const query = (s: string) => `query{${s}}`;
export interface Query<T> {
    data?: T;
}

///////////////////////////////////////////////// pageinfo
const pageInfo = `pageInfo{
    total
    perPage
    currentPage
    lastPage
    hasNextPage
}`;
export interface PageInfoItem {
    total?: number;
    perPage?: number;
    currentPage?: number;
    lastPage?: number;
    hasNextPage?: boolean;
}

///////////////////////////////////////////////// page
const page_ = (s: string, page_: number | string = 1, perPage = PAGE_SIZE) =>
    `Page(page:${page_}, perPage:${perPage}){
    ${pageInfo}
    ${s}
}`;
export interface PageInfo {
    pageInfo: PageInfoItem;
}
export interface Page<T> {
    Page?: T & PageInfo;
}

///////////////////////////////////////////////// title
const title = `title{
    romaji
    english
    native
}`;
type Title = {
    romaji?: string;
    english?: string;
    native?: string;
};

///////////////////////////////////////////////// date
const dateFields = `year
month
day`;
type Date = {
    year?: number;
    month?: number;
    day?: number;
};

///////////////////////////////////////////////// cover image
const coverImage = `coverImage{
    medium
    large
}`;
type CoverImage = {
    medium?: string;
    large?: string;
};
type Image = CoverImage;

///////////////////////////////////////////////// section media: media but only contains necessary items for showing it in the anime landing page
const sectionMediaFields = `id
${title}
siteUrl
startDate{
    ${dateFields}
}
${coverImage}`;
export interface SectionMedia {
    id: number;
    title?: Title;
    siteUrl?: string;
    startDate?: Date;
    coverImage?: CoverImage;
}

///////////////////////////////////////////////// relations
const relations = `relations{
    edges{
        id
        relationType
        node{
            id
            siteUrl
            ${title}
            ${coverImage}
        }
    }
    ${pageInfo}
}`;
type Relation = {
    id: number;
    relationType: string;
    node: {
        id: number;
        title?: Title;
        coverImage?: CoverImage;
        siteUrl?: string;
    };
};
type Relations = {
    edges?: Relation[];
    pageInfo: PageInfoItem;
};

///////////////////////////////////////////////// name
const name = `name{
    full
    native
    alternative
}`;
type Name = {
    full?: string;
    native?: string;
    alternative?: string[];
};

const yearMonthday = `year
month
day`;

const mediumLargeFields = `medium
large`;

///////////////////////////////////////////////// characters
const characterFields = `id
role
node{
    id
    ${name}
    image{
        medium
        large
    }
    description
    gender
    dateOfBirth{
        ${yearMonthday}
    }
    bloodType
    siteUrl
}
voiceActors (language: JAPANESE, sort: ROLE){
    id
    ${name}
    description
    image{
        ${mediumLargeFields}
    }
    gender
    age
}`;
type VoiceActor = {
    id: number;
    name?: Name;
    description?: string;
    image?: Image;
    gender?: string;
    age?: number;
};
export interface Character {
    id: number;
    role?: string;
    node?: {
        id: number;
        name?: Name;
        gender?: string;
        description?: string;
        bloodType?: string;
        siteUrl?: string;
        dateOfBirth?: Date;
        image?: Image;
    };
    voiceActors?: VoiceActor[];
}

/////////////////////////////////////////////////
const characters = (page: number | string) =>
    `characters(page: ${page}){
    edges{
        ${characterFields}
    }
    ${pageInfo}
}`;
export interface Characters {
    characters: CharactersItem;
}
export interface CharactersItem {
    edges: Character[];
    pageInfo: PageInfoItem;
}

///////////////////////////////////////////////// staff
const staffFields = `id
role
node{
    id
    ${name}
    image{
        ${mediumLargeFields}
    }
    description
    gender
    age
    siteUrl
}`;
export interface Staff {
    id: number;
    role?: string;
    node?: {
        id: number;
        name: Name;
        image: Image;
        description?: string;
        gender?: string;
        age?: number;
        siteUrl?: string;
    };
}

/////////////////////////////////////////////////
const staffs = (page: number | string) =>
    `staff(page: ${page}){
    edges{
        ${staffFields}
    }
    ${pageInfo}
}`;
export interface Staffs {
    staff: StaffsItem;
}
export interface StaffsItem {
    edges: Staff[];
    pageInfo?: PageInfoItem;
}

///////////////////////////////////////////////// media
const mediaFields = `${sectionMediaFields}
trailer{
    id
    site
    thumbnail
}
description
status
season
seasonYear
episodes
synonyms
meanScore
bannerImage
genres
hashtag
tags{
    name
    description
}
nextAiringEpisode{
    id
    airingAt
    timeUntilAiring
    episode
}
${relations}
${characters(1)}
${staffs(1)}`;

type AnimeStatus = "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";

type AnimeSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

/////////////////////////////////////////////////
export type MEDIALIST_STATUS = "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";

const mediaList = (userID: number | string, status: MEDIALIST_STATUS) =>
    `mediaList(userId:${userID}, type:ANIME${status ? `,status_in:[${status}]` : ""}){
    id
    status
    media{
        ${sectionMediaFields}
    }
}`;
export interface MediaListItem {
    id: number;
    status?: MEDIALIST_STATUS;
    media?: SectionMedia;
}
export interface MediaList {
    mediaList: MediaListItem[];
}

/////////////////////////////////////////////////
const usersFavouritesAnimeNodes = (id: number | string, page: number | string) =>
    `users(id:${id}){
    favourites(page:1){
        anime(page:${page},perPage:${PAGE_SIZE}){
            nodes{
                ${sectionMediaFields}
            }
            ${pageInfo}
        }
    }
}`;
export interface UsersFavouritesAnime {
    users?: {
        favourites?: {
            anime?: {
                nodes?: SectionMedia[];
                pageInfo?: PageInfoItem;
            };
        };
    }[];
}

const medias = (id: number | string) =>
    `media(id:${id}){
    ${mediaFields}
}`;
const mediasSearch = (search?: string, filterItems?: FilterItem[]) => {

    const searchQuery = search ? `search:"${search}"` : "";

    const genres = (filterItems || []).filter((item) => item.type === "genre").map((item) => `"${item.name}"`);
    const genreQuery = genres.length > 0 ? `genre_in:[${genres.join(",")}]` : "";

    const tags = (filterItems || []).filter((item) => item.type === "tag").map((item) => `"${item.name}"`);
    const tagQuery = tags.length > 0 ? `tag_in:[${tags.join(",")}]` : "";

    const queries = [searchQuery, genreQuery, tagQuery].join(",");

    return `media(${queries}){${mediaFields}}`
}

export interface Media<T> {
    media: T[];
}

export interface MediaItem extends SectionMedia {
    trailer?: {
        id?: string;
        site?: string;
        thumbnail: string;
    };
    description?: string;
    status?: AnimeStatus;
    season?: AnimeSeason;
    seasonYear?: number;
    episodes?: number;
    synonyms?: string[];
    meanScore?: number;
    bannerImage?: string;
    genres?: string[];
    hashtag?: string;
    tags?: {
        name: string;
        description?: string;
    }[];
    nextAiringEpisode?: {
        id: number;
        airingAt: number;
        timeUntilAiring: number;
        episode: number;
    };
    characters?: CharactersItem;
    staff?: Staffs;
    relations?: Relations;
}

const mediasCharacterOnly = (id: number | string, page: number | string) =>
    `media(id:${id}){
    ${characters(page)}
}`;

export type MediaCharactersOnly = Media<CharactersItem>;

const mediasStaffsOnly = (id: number | string, page: number | string) =>
    `media(id:${id}){
    ${staffs(page)}
}`;

///////////////////////////////////////////// genres
const genreCollection = "GenreCollection";
export interface GenreCollection {
    GenreCollection: string[];
};

/////////////////////////////////////////////
const mediaTagCollection = `MediaTagCollection {
    name
    description
    category
    isAdult
}`
export interface MediaTag {
    name: string,
    description: string,
    category: string,
    isAdult: boolean
}
export interface MediaTagCollection {
    MediaTagCollection: MediaTag[];
};

///////////////////////////////////////////// filter
const filters = `${genreCollection}
${mediaTagCollection}`
export type Filters = MediaTagCollection & GenreCollection;

///////////////////////////////////////////// client

export class AnilistGraphqlQuery {
    public static fetchMedia(animeID: number | string): string {
        return query(page_(medias(animeID)));
    }
    public static fetchMediaList(userID: number | string, page: number | string, status: MEDIALIST_STATUS) {
        return query(page_(mediaList(userID, status), page));
    }
    public static fetchMediaCharacters(animeID: number | string, page: number | string) {
        return query(page_(mediasCharacterOnly(animeID, page)));
    }
    public static fetchMediaStaffs(animeID: number | string, page: number | string) {
        return query(page_(mediasStaffsOnly(animeID, page)));
    }
    public static fetchFavouriteAnimes(userID: number | string, page: number | string) {
        return query(page_(usersFavouritesAnimeNodes(userID, page)));
    }
    public static fetchSearch(searchString: string | string, page: number | string, filterItems: FilterItem[]) {
        return query(page_(mediasSearch(searchString, filterItems), page));
    }
    public static fetchFilters() {
        return query(filters)
    }
}
