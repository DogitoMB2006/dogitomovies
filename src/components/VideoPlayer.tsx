import { useCallback, useEffect, useRef, useState } from 'react'
import { getVidkingUrl } from '../services/vidking'
import { ListVideo, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '../lib/utils'

interface VideoPlayerProps {
    tmdbId: number
    type: 'movie' | 'tv'
    season?: number
    episode?: number
    poster?: string
    onOpenEpisodes?: () => void
    chromeVisible?: boolean
    onChromeBump?: () => void
}

const chromeTransition = (visible: boolean) =>
    cn(
        'transition-all duration-300 ease-out',
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
    )

const VideoPlayer = ({
    tmdbId,
    type,
    season,
    episode,
    onOpenEpisodes,
    chromeVisible = true,
    onChromeBump,
}: VideoPlayerProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const shellRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const bumpChrome = useCallback(() => {
        onChromeBump?.()
    }, [onChromeBump])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                if (typeof event.data === 'string') {
                    const data = JSON.parse(event.data)
                    console.log('Vidking Event:', data)
                }
            } catch {
                /* embed noise */
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    useEffect(() => {
        const syncFs = () => {
            const el = shellRef.current
            setIsFullscreen(Boolean(el && document.fullscreenElement === el))
        }
        document.addEventListener('fullscreenchange', syncFs)
        return () => document.removeEventListener('fullscreenchange', syncFs)
    }, [])

    const handleToggleFullscreen = useCallback(async () => {
        bumpChrome()
        const shell = shellRef.current
        if (!shell) return
        try {
            if (document.fullscreenElement === shell) {
                await document.exitFullscreen()
            } else {
                await shell.requestFullscreen()
            }
        } catch (err) {
            console.warn('Fullscreen failed:', err)
        }
    }, [bumpChrome])

    const handleOpenEpisodes = useCallback(() => {
        bumpChrome()
        onOpenEpisodes?.()
    }, [bumpChrome, onOpenEpisodes])

    const src = getVidkingUrl(tmdbId, type, season || 1, episode || 1, {
        color: '38bdf8',
        autoPlay: true,
        nextEpisode: true,
        episodeSelector: type === 'movie',
    })

    return (
        <div
            ref={shellRef}
            className="relative flex min-h-0 w-full flex-1 overflow-hidden rounded-none border-0 bg-black sm:rounded-2xl sm:border sm:border-border/80"
            onPointerDown={bumpChrome}
        >
            <iframe
                ref={iframeRef}
                src={src}
                width="100%"
                height="100%"
                title="Video player"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                className="absolute inset-0 block h-full w-full border-0"
            />

            {!chromeVisible && (
                <>
                    <button
                        type="button"
                        aria-label="Show player controls"
                        className="absolute right-[max(0.5rem,env(safe-area-inset-right))] top-[max(0.5rem,env(safe-area-inset-top))] z-[12] min-h-14 min-w-14 bg-transparent sm:right-3 sm:top-3"
                        onPointerDown={(e) => {
                            e.stopPropagation()
                            bumpChrome()
                        }}
                    />
                    {type === 'tv' && onOpenEpisodes && (
                        <button
                            type="button"
                            aria-label="Show player controls"
                            className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-[12] min-h-14 min-w-28 bg-transparent"
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                bumpChrome()
                            }}
                        />
                    )}
                </>
            )}

            <div
                className={cn(
                    'pointer-events-none absolute right-[max(0.5rem,env(safe-area-inset-right))] top-[max(0.5rem,env(safe-area-inset-top))] z-10 sm:right-3 sm:top-3',
                    chromeTransition(chromeVisible)
                )}
            >
                <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    className="pointer-events-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/80 bg-card/90 text-foreground shadow-lg backdrop-blur-md transition hover:border-primary/70 hover:text-primary active:scale-[0.98]"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    tabIndex={chromeVisible ? 0 : -1}
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-5 w-5" aria-hidden />
                    ) : (
                        <Maximize2 className="h-5 w-5" aria-hidden />
                    )}
                </button>
            </div>

            {type === 'tv' && onOpenEpisodes && (
                <div
                    className={cn(
                        'pointer-events-none absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-10',
                        chromeTransition(chromeVisible)
                    )}
                >
                    <button
                        type="button"
                        onClick={handleOpenEpisodes}
                        className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-lg backdrop-blur-md transition hover:border-primary/70 hover:text-primary active:scale-[0.98]"
                        aria-haspopup="dialog"
                        aria-label="Open episode list"
                        tabIndex={chromeVisible ? 0 : -1}
                    >
                        <ListVideo className="h-5 w-5 shrink-0" aria-hidden />
                        <span className="hidden sm:inline">Episodes</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
