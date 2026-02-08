import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrendingTV, getPopularTV } from '../services/tmdb';
import type { Movie } from '../types';
import { mockMovies } from '../lib/mock';

const mockTV = mockMovies.filter((m) => m.media_type === 'tv');
const fallbackTV = mockTV.length > 0 ? mockTV : mockMovies;

const TV = () => {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [popular, setPopular] = useState<Movie[]>([]);
    const [featured, setFeatured] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [trendingData, popularData] = await Promise.all([
                    getTrendingTV(),
                    getPopularTV(),
                ]);
                const filterAndTyped = (results: unknown[] = []) =>
                    (results as Movie[]).filter((r) => r.media_type !== 'person').map((r) => ({ ...r, media_type: 'tv' as const }));

                const trendingList = filterAndTyped(trendingData?.results);
                const popularList = filterAndTyped(popularData?.results);

                if (trendingList.length > 0) {
                    setTrending(trendingList);
                    setFeatured(trendingList[0]);
                } else throw new Error('No data');
                if (popularList.length > 0) setPopular(popularList);
            } catch (e) {
                console.log('Using mock data due to API failure/missing key');
                setTrending(fallbackTV);
                setFeatured(fallbackTV[0]);
                setPopular([...fallbackTV].reverse());
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="page-shell">
            <Navbar />
            <Hero movie={featured} />

            <div className="content-wrap section-stack">
                <MovieRow title="Trending TV" movies={trending} />
                <MovieRow title="Top Rated TV" movies={popular.length > 0 ? popular : [...trending].reverse()} />
                <MovieRow title="Popular This Week" movies={trending} />
            </div>
        </div>
    );
};

export default TV;
