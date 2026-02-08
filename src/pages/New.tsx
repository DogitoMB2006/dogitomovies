import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending } from '../services/tmdb';
import type { Movie } from '../types';
import { mockMovies } from '../lib/mock';

const New = () => {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [featured, setFeatured] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getTrending();
                const list = (data?.results || []).filter((r: Movie) => r.media_type !== 'person') as Movie[];
                if (list.length > 0) {
                    setTrending(list);
                    setFeatured(list[0]);
                } else throw new Error('No data');
            } catch (e) {
                console.log('Using mock data due to API failure/missing key');
                setTrending(mockMovies);
                setFeatured(mockMovies[0]);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="page-shell">
            <Navbar />
            <Hero movie={featured} />

            <div className="content-wrap section-stack">
                <MovieRow title="Popular This Week" movies={trending} />
                <MovieRow title="New Releases" movies={[...trending].sort(() => 0.5 - Math.random())} />
                <MovieRow title="Trending Now" movies={trending} />
            </div>
        </div>
    );
};

export default New;
