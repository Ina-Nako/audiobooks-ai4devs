import { createContext, useContext, useState, useRef, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef(new Audio())

  // Sync audio element with state
  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => setProgress(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration || 0)
    const handleEnded = () => { setIsPlaying(false); setProgress(0) }
    const handleError = () => {
      // If audio fails to load, still keep the track info visible (simulated mode)
      console.warn('Audio source unavailable, running in simulated mode')
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  // Handle pause state from external changes
  useEffect(() => {
    const audio = audioRef.current
    if (!currentTrack) return

    if (!isPlaying) {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // Handle speed changes
  useEffect(() => {
    audioRef.current.playbackRate = speed
  }, [speed])

  const play = (track) => {
    const audio = audioRef.current

    // If same track, just resume
    if (currentTrack?.id === track.id) {
      audio.play().catch(() => {})
      setIsPlaying(true)
      return
    }

    // New track
    setCurrentTrack(track)
    setProgress(track.startAt || 0)
    setDuration(track.duration_seconds || 0)

    if (track.audio_url) {
      audio.src = track.audio_url
      audio.currentTime = track.startAt || 0
      audio.playbackRate = speed
      // Call play() directly in the user-gesture call stack for browser autoplay policy
      audio.play().catch(() => {})
      setIsPlaying(true)
    } else {
      // No real audio URL — run in simulated mode (player bar shows, no actual audio)
      audio.src = ''
      setIsPlaying(true)
    }
  }

  const pause = () => {
    audioRef.current.pause()
    setIsPlaying(false)
  }
  const resume = () => {
    audioRef.current.play().catch(() => {})
    setIsPlaying(true)
  }

  const stop = () => {
    const audio = audioRef.current
    audio.pause()
    audio.src = ''
    setCurrentTrack(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }

  const seek = (seconds) => {
    const audio = audioRef.current
    if (audio.src) {
      audio.currentTime = seconds
    }
    setProgress(seconds)
  }

  const changeSpeed = (s) => setSpeed(s)

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, progress, duration, speed,
      play, pause, resume, stop, seek, changeSpeed, setProgress, setDuration
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
