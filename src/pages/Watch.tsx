import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

const Watch = () => {
    const { type, id } = useParams<{ type: string; id: string }>();

    if (!id || !type) return null;

    return (
        <div className="h-screen w-screen bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_35%)]" />
            <div className="absolute left-4 top-4 z-50">
                <Link
                    to="/"
                    className="frosted pointer-events-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/70 hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>
            </div>

            <div className="h-full w-full p-3 sm:p-4">
                <VideoPlayer
                    tmdbId={parseInt(id)}
                    type={type as 'movie' | 'tv'}
                />
            </div>
        </div>
    );
};

export default Watch;
