import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23374151" width="200" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="14"%3ENo image%3C/text%3E%3C/svg%3E';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const [thumbError, setThumbError] = useState(false);
    const posterUrl = getImageUrl(movie.poster_path || movie.backdrop_path);
    const thumbSrc = thumbError || !posterUrl ? PLACEHOLDER_IMAGE : posterUrl;
    const mediaType = movie.media_type === 'tv' ? 'TV' : 'Movie';
    const watchType = movie.media_type === 'tv' ? 'tv' : 'movie';
    const watchUrl = `/watch/${watchType}/${movie.id}`;

    return (
        <Link to={watchUrl} className="block w-full">
            <motion.div
                className="group/card relative w-full cursor-pointer"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_12px_32px_-20px_rgba(56,189,248,0.65)]">
                    <img
                        src={thumbSrc}
                        alt={movie.title || movie.name}
                        className="h-full w-full object-cover object-top transition duration-300 group-hover/card:scale-105"
                        onError={() => setThumbError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />

                    <div className="absolute right-2 top-2 rounded-md border border-border/80 bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                        {mediaType}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                        <h3 className="line-clamp-1 text-sm font-bold text-foreground sm:text-base">{movie.title || movie.name}</h3>
                        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-primary">{Math.round((movie.vote_average ?? 0) * 10)}% Match</span>
                            <span
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-secondary/80 text-foreground transition group-hover/card:border-primary/70 group-hover/card:text-primary"
                                aria-hidden
                            >
                                <Play className="h-3.5 w-3.5 fill-current" />
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;
