import { Play, Info } from 'lucide-react';
import type { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroProps {
    movie: Movie | null;
}

const Hero = ({ movie }: HeroProps) => {
    if (!movie) return <div className="h-[72vh] w-full animate-pulse bg-secondary/60" />;

    const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';

    return (
        <div className="relative h-[72vh] min-h-[520px] w-full overflow-hidden sm:h-[78vh] md:h-[84vh]">
            <div className="absolute inset-0">
                <img
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-background/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-black/25" />
            </div>

            <div className="content-wrap relative z-10 flex h-full flex-col justify-center pt-24 sm:pt-28">
                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-3xl"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-secondary/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Cinematic Pick
                    </div>

                    <h1 className="mb-4 text-4xl font-extrabold leading-tight text-foreground drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
                        {movie.title || movie.name}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-secondary-foreground sm:gap-4 sm:text-sm md:text-base">
                        <span className="rounded-md border border-primary/35 bg-primary/15 px-2.5 py-1 font-semibold text-primary">
                            {Math.round(movie.vote_average * 10)}% Match
                        </span>
                        <span>{movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}</span>
                        <span className="rounded-md border border-border/80 bg-secondary/70 px-2.5 py-1">4K UHD</span>
                        <span className="rounded-md border border-border/80 bg-secondary/70 px-2.5 py-1 uppercase">{mediaType}</span>
                    </div>

                    <p className="mb-8 max-w-2xl text-base text-secondary-foreground drop-shadow-md sm:text-lg">
                        {movie.overview}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                            to={`/watch/${mediaType}/${movie.id}`}
                            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-sky-300"
                        >
                            <Play className="h-5 w-5 fill-primary-foreground" />
                            Play
                        </Link>
                        <button
                            type="button"
                            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-border/80 bg-card/80 px-6 py-3 font-bold text-foreground transition hover:border-primary/60 hover:bg-secondary/80"
                        >
                            <Info className="h-5 w-5" />
                            More Info
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
