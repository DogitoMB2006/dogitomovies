import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

const MovieRow = ({ title, movies }: MovieRowProps) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const slide = (offset: number) => {
        if (rowRef.current) {
            rowRef.current.scrollLeft += offset;
        }
    };

    return (
        <section className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Browse all</span>
            </div>

            <div className="relative group/row">
                <button
                    type="button"
                    onClick={() => slide(-500)}
                    className="absolute -left-2 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground transition hover:border-primary/70 hover:text-primary md:flex"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <div
                    ref={rowRef}
                    className="frosted soft-glow flex items-center gap-2 overflow-x-scroll rounded-2xl p-3 scrollbar-hide sm:gap-3 sm:p-4 md:gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="w-[140px] flex-shrink-0 sm:w-[160px] md:w-[180px] lg:w-[210px]"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => slide(500)}
                    className="absolute -right-2 top-1/2 z-40 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground transition hover:border-primary/70 hover:text-primary md:flex"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
};

export default MovieRow;
