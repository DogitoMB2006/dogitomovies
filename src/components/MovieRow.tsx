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
        <div className="mb-8 relative">
            <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">
                {title}
            </h2>

            <div className="relative group/row">
                <button
                    onClick={() => slide(-500)}
                    className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-8 md:w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity h-full"
                >
                    <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </button>

                <div
                    ref={rowRef}
                    className="flex items-center gap-2 overflow-x-scroll scrollbar-hide px-4 md:px-8 scroll-smooth pb-44"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="min-w-[100px] max-w-[100px] sm:min-w-[140px] sm:max-w-[140px] md:min-w-[180px] md:max-w-[180px] lg:min-w-[220px] lg:max-w-[220px] xl:min-w-[260px] xl:max-w-[260px] flex-shrink-0"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => slide(500)}
                    className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/70 w-8 md:w-12 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity h-full"
                >
                    <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </button>
            </div>
        </div>
    );
};

export default MovieRow;
