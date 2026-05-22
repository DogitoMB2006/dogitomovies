import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_IDLE_MS = 2800

interface UsePlayerChromeOptions {
    idleMs?: number
    /** Keep chrome visible (e.g. episode sheet open) */
    paused?: boolean
}

export const usePlayerChrome = ({ idleMs = DEFAULT_IDLE_MS, paused = false }: UsePlayerChromeOptions = {}) => {
    const [visible, setVisible] = useState(true)
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearHideTimer = useCallback(() => {
        if (hideTimerRef.current !== null) {
            clearTimeout(hideTimerRef.current)
            hideTimerRef.current = null
        }
    }, [])

    const scheduleHide = useCallback(() => {
        clearHideTimer()
        if (paused) return
        hideTimerRef.current = setTimeout(() => {
            setVisible(false)
            hideTimerRef.current = null
        }, idleMs)
    }, [clearHideTimer, idleMs, paused])

    const bump = useCallback(() => {
        setVisible(true)
        scheduleHide()
    }, [scheduleHide])

    const hideNow = useCallback(() => {
        clearHideTimer()
        setVisible(false)
    }, [clearHideTimer])

    useEffect(() => {
        if (paused) {
            clearHideTimer()
            setVisible(true)
            return
        }
        scheduleHide()
        return clearHideTimer
    }, [paused, scheduleHide, clearHideTimer])

    useEffect(() => {
        bump()

        const onActivity = () => bump()

        window.addEventListener('touchstart', onActivity, { passive: true })
        window.addEventListener('keydown', onActivity)

        return () => {
            window.removeEventListener('touchstart', onActivity)
            window.removeEventListener('keydown', onActivity)
            clearHideTimer()
        }
    }, [bump, clearHideTimer])

    useEffect(() => {
        const onFullscreenChange = () => {
            if (document.fullscreenElement) {
                hideNow()
            } else {
                bump()
            }
        }

        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [bump, hideNow])

    return { visible, bump, hideNow }
}
