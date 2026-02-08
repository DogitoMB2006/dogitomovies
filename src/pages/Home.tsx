import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { getTrending } from '../services/tmdb';
import type { Movie } from '../types';
import { mockMovies } from '../lib/mock';

const Home = () => {
    const [trending, setTrending] = useState<Movie[]>([]);
    const [featured, setFeatured] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getTrending();
                // just in case, If API key is invalid/missing, data might be error or empty
                if (data && data.results && data.results.length > 0) {
                    setTrending(data.results);
                    setFeatured(data.results[0]);
                } else {
                    throw new Error("No data");
                }
            } catch (e) {
                console.log("Using mock data due to API failure/missing key");
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
                <MovieRow title="Trending Now" movies={trending} />
                <MovieRow title="Top Rated" movies={[...trending].reverse()} />
                <MovieRow title="Action Movies" movies={trending} />
                <MovieRow title="New Releases" movies={[...trending].sort(() => 0.5 - Math.random())} />
            </div>
        </div>
    );
};

export default Home;
