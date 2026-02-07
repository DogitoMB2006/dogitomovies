import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import type { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23374151" width="200" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const [previewImgError, setPreviewImgError] = useState(false);
    const [thumbError, setThumbError] = useState(false);
    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path);
    const thumbSrc = thumbError || !posterUrl ? PLACEHOLDER_IMAGE : posterUrl;

    return (
        <motion.div
            className="group/card relative w-full aspect-[2/3] cursor-pointer"
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.2 }}
        >
            <img
                src={thumbSrc}
                alt={movie.title || movie.name}
                className="rounded-md object-cover object-top w-full h-full"
                onError={() => setThumbError(true)}
            />

           
            <div className="hover-only-preview absolute top-0 left-0 w-full opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:pointer-events-auto transition-opacity duration-200 bg-card rounded-md shadow-xl overflow-hidden z-20 origin-top-left scale-95 group-hover/card:scale-100 -translate-y-1 group-hover/card:translate-y-0">
                <div className="relative w-full aspect-[2/3] bg-muted">
                    <img
                        src={previewImgError ? PLACEHOLDER_IMAGE : (posterUrl || PLACEHOLDER_IMAGE)}
                        alt=""
                        className="object-cover object-top w-full h-full"
                        onError={() => setPreviewImgError(true)}
                    />
                </div>
                <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Link
                                to={`/watch/${movie.media_type || 'movie'}/${movie.id}`}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                            >
                                <Play className="w-4 h-4 fill-black text-black" />
                            </Link>
                            <button type="button" className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-400 hover:text-white transition-colors flex-shrink-0">
                                <Plus className="w-4 h-4" />
                            </button>
                            <button type="button" className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-400 hover:text-white transition-colors flex-shrink-0">
                                <ThumbsUp className="w-4 h-4" />
                            </button>
                        </div>
                        <button type="button" className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-auto">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <h3 className="font-bold text-white text-sm truncate">{movie.title || movie.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-green-500 font-semibold">{Math.round((movie.vote_average ?? 0) * 10)}% Match</span>
                        <span className="border border-gray-600 px-1 rounded">{movie.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
