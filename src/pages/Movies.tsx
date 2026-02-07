import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrendingMovies, getPopularMovies } from '../services/tmdb';
import type { Movie } from '../types';
import { mockMovies } from '../lib/mock';

const mockMoviesOnly = mockMovies.filter((m) => m.media_type === 'movie');
const fallbackMovies = mockMoviesOnly.length > 0 ? mockMoviesOnly : mockMovies;

const Movies = () => {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [popular, setPopular] = useState<Movie[]>([]);
    const [featured, setFeatured] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [trendingData, popularData] = await Promise.all([
                    getTrendingMovies(),
                    getPopularMovies(),
                ]);
                const filterAndTyped = (results: unknown[] = []) =>
                    (results as Movie[]).filter((r) => r.media_type !== 'person').map((r) => ({ ...r, media_type: 'movie' as const }));

                const trendingList = filterAndTyped(trendingData?.results);
                const popularList = filterAndTyped(popularData?.results);

                if (trendingList.length > 0) {
                    setTrending(trendingList);
                    setFeatured(trendingList[0]);
                } else throw new Error('No data');
                if (popularList.length > 0) setPopular(popularList);
            } catch (e) {
                console.log('Using mock data due to API failure/missing key');
                setTrending(fallbackMovies);
                setFeatured(fallbackMovies[0]);
                setPopular([...fallbackMovies].reverse());
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="bg-background min-h-screen pb-20 overflow-x-hidden">
            <Navbar />
            <Hero movie={featured} />

            <div className="relative z-10 -mt-32 md:-mt-48 pl-0">
                <MovieRow title="Trending Movies" movies={trending} />
                <MovieRow title="Top Rated Movies" movies={popular.length > 0 ? popular : [...trending].reverse()} />
                <MovieRow title="Popular This Week" movies={trending} />
            </div>
        </div>
    );
};

export default Movies;
