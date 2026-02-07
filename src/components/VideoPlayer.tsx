import { useEffect, useRef } from 'react';
import { getVidkingUrl } from '../services/vidking';

interface VideoPlayerProps {
    tmdbId: number;
    type: 'movie' | 'tv';
    season?: number;
    episode?: number;
    poster?: string;
}

const VideoPlayer = ({ tmdbId, type, season, episode }: VideoPlayerProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
     

            try {
                if (typeof event.data === 'string') {
                    const data = JSON.parse(event.data);
                    console.log('Vidking Event:', data);
                   
                }
            } catch (e) {
              
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const src = getVidkingUrl(tmdbId, type, season || 1, episode || 1, {
        color: 'e50914', 
        autoPlay: true,
        nextEpisode: true,
        episodeSelector: true,
    });

    return (
        <div className="w-full h-full bg-black relative">
            <iframe
                ref={iframeRef}
                src={src}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
                className="w-full h-full aspect-video"
            />
        </div>
    );
};

export default VideoPlayer;
