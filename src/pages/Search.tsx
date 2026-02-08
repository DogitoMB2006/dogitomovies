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
        <div className="page-shell">
            <Navbar />
            <div className="content-wrap pt-28 pb-12 md:pt-32">
                <div className="frosted mb-6 rounded-2xl p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Search</p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                        Results for <span className="text-primary">{query || '...'}</span>
                    </h2>
                </div>

                {!hasTmdbKey() && (
                    <p className="mb-4 rounded-xl border border-amber-300/25 bg-amber-500/12 px-4 py-3 text-sm text-amber-100">
                        Add <code className="rounded bg-black/30 px-1">VITE_TMDB_API_KEY</code> in a <code className="rounded bg-black/30 px-1">.env</code> file to search real titles. Get a free key at{' '}
                        <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline">themoviedb.org</a>.
                    </p>
                )}

                {usedMock && results.length > 0 && (
                    <p className="mb-4 rounded-xl border border-border/70 bg-secondary/65 px-4 py-3 text-sm text-muted-foreground">
                        Showing sample results (API key not set or request failed).
                    </p>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {results.map((movie) => (
                            <div key={`${movie.media_type}-${movie.id}`} className="w-full">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="frosted mt-20 rounded-2xl p-8 text-center text-muted-foreground">
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
