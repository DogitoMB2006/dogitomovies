import { Play, Info } from 'lucide-react';
import type { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroProps {
    movie: Movie | null;
}

const Hero = ({ movie }: HeroProps) => {
    if (!movie) return <div className="h-[70vh] sm:h-[80vh] w-full bg-background animate-pulse" />;

    return (
        <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                        {movie.title || movie.name}
                    </h1>

                    <div className="flex items-center gap-4 text-white/80 mb-6 text-sm md:text-base">
                        <span className="font-semibold text-green-500">{Math.round(movie.vote_average * 10)}% Match</span>
                        <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                        <span className="border border-white/40 px-2 py-0.5 rounded text-xs">HD</span>
                    </div>

                    <p className="text-base md:text-lg text-white/90 mb-8 line-clamp-3 drop-shadow-md">
                        {movie.overview}
                    </p>

                    <div className="flex items-center gap-4">
                        <Link
                            to={`/watch/${movie.media_type}/${movie.id}`}
                            className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded font-bold hover:bg-white/90 transition-colors min-h-[44px]"
                        >
                            <Play className="w-5 h-5 fill-black" />
                            Play
                        </Link>
                        <button type="button" className="flex items-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-3 rounded font-bold hover:bg-gray-500/50 transition-colors backdrop-blur-sm min-h-[44px]">
                            <Info className="w-5 h-5" />
                            More Info
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
