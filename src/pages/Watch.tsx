import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

const Watch = () => {
    const { type, id } = useParams<{ type: string; id: string }>();

    if (!id || !type) return null;

    return (
        <div className="w-screen h-screen bg-black flex flex-col">
            <div className="absolute top-4 left-4 z-50">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            <div className="flex-1 w-full h-full">
                <VideoPlayer
                    tmdbId={parseInt(id)}
                    type={type as 'movie' | 'tv'}
                />
            </div>
        </div>
    );
};

export default Watch;
