import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import VideoPlayer from '../components/VideoPlayer'
import TvEpisodeSheet from '../components/TvEpisodeSheet'
import { usePlayerChrome } from '../hooks/usePlayerChrome'
import { cn } from '../lib/utils'

const parsePositiveInt = (raw: string | null, fallback: number) => {
    const n = parseInt(raw ?? '', 10)
    return Number.isFinite(n) && n >= 1 ? n : fallback
}

const Watch = () => {
    const { type, id } = useParams<{ type: string; id: string }>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [episodesOpen, setEpisodesOpen] = useState(false)
    const { visible: chromeVisible, bump: bumpChrome } = usePlayerChrome({ paused: episodesOpen })

    const mediaType = type as 'movie' | 'tv'
    const tmdbId = useMemo(() => (id ? parseInt(id, 10) : NaN), [id])

    const season = mediaType === 'tv' ? parsePositiveInt(searchParams.get('season'), 1) : 1
    const episode = mediaType === 'tv' ? parsePositiveInt(searchParams.get('episode'), 1) : 1

    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        const prevHtmlOverflow = html.style.overflow
        const prevBodyOverflow = body.style.overflow
        html.style.overflow = 'hidden'
        body.style.overflow = 'hidden'
        return () => {
            html.style.overflow = prevHtmlOverflow
            body.style.overflow = prevBodyOverflow
        }
    }, [])

    const handleSelectEpisode = (s: number, e: number) => {
        setSearchParams({ season: String(s), episode: String(e) })
        setEpisodesOpen(false)
    }

    if (!id || !type || Number.isNaN(tmdbId)) return null

    return (
        <div className="flex h-[100dvh] max-h-[100dvh] w-screen min-w-0 flex-col overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_35%)]" />

            {!chromeVisible && (
                <button
                    type="button"
                    aria-label="Show player controls"
                    className="absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-[49] min-h-14 min-w-14 bg-transparent"
                    onPointerDown={bumpChrome}
                />
            )}

            <div
                className={cn(
                    'absolute left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-50 transition-all duration-300 ease-out',
                    chromeVisible
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-1 opacity-0'
                )}
            >
                <Link
                    to="/"
                    onPointerDown={bumpChrome}
                    className="frosted pointer-events-auto inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/70 hover:text-primary sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-2"
                    aria-label="Back to home"
                    tabIndex={chromeVisible ? 0 : -1}
                >
                    <ArrowLeft className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Back</span>
                </Link>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col p-0 sm:p-4">
                <VideoPlayer
                    tmdbId={tmdbId}
                    type={mediaType}
                    season={season}
                    episode={episode}
                    chromeVisible={chromeVisible}
                    onChromeBump={bumpChrome}
                    onOpenEpisodes={mediaType === 'tv' ? () => setEpisodesOpen(true) : undefined}
                />
            </div>

            {mediaType === 'tv' && (
                <TvEpisodeSheet
                    open={episodesOpen}
                    onClose={() => setEpisodesOpen(false)}
                    tvId={tmdbId}
                    season={season}
                    episode={episode}
                    onSelect={handleSelectEpisode}
                />
            )}
        </div>
    )
}

export default Watch
