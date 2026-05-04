export interface Movie {
    id: number;
    title: string;
    name?: string; // For TV shows
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string; // For TV shows
    media_type: 'movie' | 'tv' | 'person';
}

export interface SearchResults {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

/** TMDB `/tv/{id}/season/{n}` — fields we use in the episode picker */
export interface TvSeasonEpisode {
    id: number;
    episode_number: number;
    name: string;
    still_path: string | null;
}

export interface TvSeasonDetails {
    season_number: number;
    episodes: TvSeasonEpisode[];
}
