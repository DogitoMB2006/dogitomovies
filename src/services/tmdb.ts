import axios from 'axios';
import type { SearchResults, Movie, TvSeasonDetails } from '../types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? '';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

export const hasTmdbKey = (): boolean => !!TMDB_API_KEY;

export const searchContent = async (query: string, page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/search/multi', {
        params: { query, page },
    });
    return response.data;
};

export const getTrending = async (page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/trending/all/week', {
        params: { page },
    });
    return response.data;
};

export const getTrendingTV = async (page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/trending/tv/week', { params: { page } });
    return response.data;
};

export const getTrendingMovies = async (page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/trending/movie/week', { params: { page } });
    return response.data;
};

export const getPopularTV = async (page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/tv/popular', { params: { page } });
    return response.data;
};

export const getPopularMovies = async (page = 1): Promise<SearchResults> => {
    const response = await tmdb.get('/movie/popular', { params: { page } });
    return response.data;
};

export const getMovieDetails = async (id: number, type: 'movie' | 'tv'): Promise<Movie> => {
    const response = await tmdb.get(`/${type}/${id}`);
    return response.data;
};

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getTvSeasonCount = async (tvId: number): Promise<number> => {
    const response = await tmdb.get(`/tv/${tvId}`);
    const n = response.data?.number_of_seasons;
    return typeof n === 'number' && n >= 1 ? n : 1;
};

export const getTvSeason = async (tvId: number, seasonNumber: number): Promise<TvSeasonDetails> => {
    const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data as TvSeasonDetails;
};
