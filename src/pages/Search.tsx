import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { searchContent, hasTmdbKey } from '../services/tmdb';
import type { Movie } from '../types';
import { mockMovies } from '../lib/mock';

function filterMockByQuery(query: string): Movie[] {
    const q = query.trim().toLowerCase();
    if (!q) return mockMovies;
    return mockMovies.filter((m) => {
        const title = (m.title || m.name || '').toLowerCase();
        const overview = (m.overview || '').toLowerCase();
        return title.includes(q) || overview.includes(q);
    });
}

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [usedMock, setUsedMock] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            setUsedMock(false);
            try {
                const data = await searchContent(query);
                if (data?.results?.length) {
                    setResults(data.results.filter((item) => item.media_type !== 'person'));
                } else {
                    setResults(filterMockByQuery(query));
                    setUsedMock(true);
                }
            } catch {
                setResults(filterMockByQuery(query));
                setUsedMock(true);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-background text-white">
            <Navbar />
            <div className="container mx-auto px-4 md:px-8 pt-28 md:pt-32 pb-10">
                <h2 className="text-2xl font-bold mb-6">
                    Results for: <span className="text-gray-400">{query || '...'}</span>
                </h2>

                {!hasTmdbKey() && (
                    <p className="mb-4 px-4 py-2 rounded bg-amber-500/20 text-amber-200 text-sm">
                        Add <code className="bg-black/30 px-1 rounded">VITE_TMDB_API_KEY</code> in a <code className="bg-black/30 px-1 rounded">.env</code> file to search real titles. Get a free key at{' '}
                        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline">themoviedb.org</a>.
                    </p>
                )}

                {usedMock && results.length > 0 && (
                    <p className="mb-4 text-gray-500 text-sm">Showing sample results (API key not set or request failed).</p>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {results.map((movie) => (
                            <div key={`${movie.media_type}-${movie.id}`} className="w-full">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-20">No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;
