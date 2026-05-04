import { useCallback, useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getTvSeason, getTvSeasonCount, getImageUrl, hasTmdbKey } from '../services/tmdb'
import type { TvSeasonDetails } from '../types'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface TvEpisodeSheetProps {
    open: boolean
    onClose: () => void
    tvId: number
    season: number
    episode: number
    onSelect: (season: number, episode: number) => void
}

const TvEpisodeSheet = ({
    open,
    onClose,
    tvId,
    season: activeSeason,
    episode: activeEpisode,
    onSelect,
}: TvEpisodeSheetProps) => {
    const titleId = useId()
    const [seasonCount, setSeasonCount] = useState(1)
    const [seasonTab, setSeasonTab] = useState(activeSeason)
    const [seasonData, setSeasonData] = useState<TvSeasonDetails | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        setSeasonTab(activeSeason)
    }, [open, activeSeason])

    useEffect(() => {
        if (!open) return
        if (!hasTmdbKey()) {
            setLoadError('Missing TMDB API key')
            setSeasonData(null)
            return
        }
        let cancelled = false
        setLoadError(null)
        getTvSeasonCount(tvId)
            .then((n) => {
                if (!cancelled) setSeasonCount(Math.max(1, n))
            })
            .catch(() => {
                if (!cancelled) setLoadError('Could not load show')
            })
        return () => {
            cancelled = true
        }
    }, [open, tvId])

    useEffect(() => {
        if (!open || !hasTmdbKey()) return
        let cancelled = false
        setLoading(true)
        setLoadError(null)
        getTvSeason(tvId, seasonTab)
            .then((data) => {
                if (!cancelled) setSeasonData(data)
            })
            .catch(() => {
                if (!cancelled) {
                    setSeasonData(null)
                    setLoadError('Could not load episodes')
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [open, tvId, seasonTab])

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        },
        [onClose]
    )

    useEffect(() => {
        if (!open) return
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, handleKeyDown])

    const seasonOptions = Array.from({ length: seasonCount }, (_, i) => i + 1)

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        role="presentation"
                        className="absolute inset-0 cursor-default bg-black/75"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onPointerDown={onClose}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        className={cn(
                            'relative z-[1] flex max-h-[min(88dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border/80 bg-card shadow-2xl sm:max-h-[80vh] sm:rounded-2xl',
                            'pointer-events-auto'
                        )}
                        initial={{ y: 48, opacity: 0.96 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 32, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    >
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/80 px-4 py-3 sm:px-5">
                            <h2 id={titleId} className="font-heading text-lg font-bold tracking-tight text-foreground">
                                Episodes
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border/60 text-foreground transition hover:border-primary/60 hover:text-primary"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="border-b border-border/80 px-4 py-3 sm:px-5">
                            <label htmlFor={`${titleId}-season`} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Season
                            </label>
                            <select
                                id={`${titleId}-season`}
                                value={seasonTab}
                                onChange={(e) => setSeasonTab(Number(e.target.value))}
                                className="w-full rounded-xl border border-border/80 bg-secondary/90 px-3 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-primary/70"
                            >
                                {seasonOptions.map((s) => (
                                    <option key={s} value={s}>
                                        Season {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                            {loadError && (
                                <p className="rounded-xl border border-border/60 bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                                    {loadError}
                                </p>
                            )}
                            {loading && !loadError && (
                                <p className="px-1 py-6 text-center text-sm text-muted-foreground">Loading…</p>
                            )}
                            {!loading && seasonData && (
                                <ul className="flex flex-col gap-1.5">
                                    {seasonData.episodes.map((ep) => {
                                        const isCurrent = seasonTab === activeSeason && ep.episode_number === activeEpisode
                                        const thumb = ep.still_path ? getImageUrl(ep.still_path, 'w500') : ''
                                        return (
                                            <li key={ep.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => onSelect(seasonTab, ep.episode_number)}
                                                    className={cn(
                                                        'flex w-full min-h-[52px] items-center gap-3 rounded-xl border px-2 py-2 text-left transition sm:min-h-0 sm:px-3 sm:py-2.5',
                                                        isCurrent
                                                            ? 'border-primary/70 bg-primary/15 text-foreground'
                                                            : 'border-border/60 bg-secondary/40 hover:border-primary/50 hover:bg-secondary/70'
                                                    )}
                                                >
                                                    {thumb ? (
                                                        <img
                                                            src={thumb}
                                                            alt=""
                                                            className="h-14 w-24 shrink-0 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-xs font-bold text-muted-foreground">
                                                            {ep.episode_number}
                                                        </span>
                                                    )}
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-xs font-semibold text-primary">
                                                            E{ep.episode_number}
                                                        </span>
                                                        <span className="line-clamp-2 text-sm font-semibold text-foreground">{ep.name}</span>
                                                    </span>
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default TvEpisodeSheet
