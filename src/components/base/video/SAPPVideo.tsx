import styles from '@styles/components/SAPPVideo.module.scss'
import { video_url } from '@utils/constants'
import { useEffect, useRef, useState, ReactNode } from 'react'
import Icon from '@components/icons'
import {
  formatTimeToHourMinuteSecond,
  getResolution,
  isMobileOrTablet,
} from '@utils/helpers'
import useClickOutside from '@components/base/clickoutside/HookClick'
import ArrowIcon from '@components/base/pagination/ArrowIcon'
import Image from 'next/image'
import { Thumbnail } from 'src/type/course/Question'
import { Stream } from '@cloudflare/stream-react'
import { fetcher } from '@services/requestV2'
import { LoadingIcon, PiPIcon } from '@assets/icons'
import { useRouter } from 'next/router'
import { QuizComponentRef } from '@components/mycourses/activity/documents/QuizComponent'
import { IActivityStateQuestion } from 'src/redux/slice/Course/MyCourse/Activity/ActivityQuiz'
import { GRADING_PREFERENCE } from 'src/constants'
import FullScreenQuizComponent from '@components/mycourses/activity/documents/FullScreenQuizComponent'

interface IProp {
  options: any
  pauseOnSeek?: boolean
  streamRef?: any
  hideVideo?: boolean
  openQuestion?: boolean
  timeQuiz?: any
  thumbnail?: Thumbnail
  children?: ReactNode
  modalOpen?: boolean
  finishAll?: boolean
  isConfirmQuestion?: boolean
  activityId?: string
  tabId?: string
  quizId?: string
  questionRef?: React.RefObject<QuizComponentRef>
  activeQuestion?: IActivityStateQuestion
  document_id?: string
  grading_preference?: GRADING_PREFERENCE
  handleSubmitQuestion?: () => void
  handleCancelQuestion?: () => void
}

type ResolutionTypes =
  | '144p'
  | '240p'
  | '360p'
  | '480p'
  | '720p'
  | '900p'
  | '1080p'
  | '1440p'
  | '2k'
  | '2k+'
  | '4k'
  | '4k+'

interface Quality {
  bitrate: number
  width: number
  height: number
}

interface Caption {
  index: number
  lang: string
}

type ResolutionMap = Record<ResolutionTypes, Quality | undefined>

const SAPPVideo = ({
  options,
  pauseOnSeek = false,
  streamRef,
  hideVideo = false,
  openQuestion = false,
  timeQuiz,
  thumbnail,
  children,
  modalOpen,
  finishAll,
  isConfirmQuestion,
  activityId,
  tabId,
  quizId,
  questionRef,
  activeQuestion,
  document_id,
  grading_preference,
  handleCancelQuestion,
  handleSubmitQuestion,
}: IProp) => {
  const [playerFunction, setPlayerFunction] = useState<any>()
  const [valueVolume, setValueVolume] = useState<number>(1)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [playbackQuality, setPlaybackQuality] = useState<number | string>(0)
  const [listQualitys, setListQualitys] = useState<any>([])
  const [listCaptions, setlistCaptions] = useState<any>([])
  const [activeCC, setActiveCC] = useState<boolean>(false)
  const [playbackCC, setPlaybackCC] = useState<number>(0)
  const [activeSettings, setActiveSettings] = useState<boolean>(false)
  const [activeQuality, setActiveQuality] = useState<boolean>(false)
  const [activeSpeed, setActiveSpeed] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [canPlay, setCanPlay] = useState<boolean>(false)
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0)
  const [cloudflarePlayer, setCloudflarePlayer] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const playbackAnimationRef = useRef<HTMLDivElement>(null)
  const videoControlsRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLButtonElement>(null)
  const seekRef = useRef<HTMLInputElement>(null)
  const seekTooltipRef = useRef<HTMLDivElement>(null)
  const volumeButtonRef = useRef<HTMLButtonElement>(null)
  const volumeRef = useRef<HTMLInputElement>(null)
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLProgressElement>(null)
  const timeElapsedRef = useRef<HTMLTimeElement>(null)
  const durationRef = useRef<HTMLTimeElement>(null)
  const listSettingsRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<any>(null)

  const playbackSpeeds = [
    { value: '0.25', label: '0.25' },
    { value: '0.5', label: '0.5' },
    { value: '0.75', label: '0.75' },
    { value: '1', label: 'Normal' },
    { value: '1.25', label: '1.25' },
    { value: '1.5', label: '1.5' },
    { value: '1.75', label: '1.75' },
    { value: '2', label: '2' },
  ]

  const [seeking, setSeeking] = useState(false)

  let dashjs: any

  useEffect(() => {
    let player: any
    const initTerminal = async () => {
      if (options?.src) {
        dashjs = await import('dashjs')

        if (dashjs) {
          if (dashjs?.supportsMediaSource() || !isMobileOrTablet()) {
            player = dashjs.MediaPlayer().create()

            const audioVideoSettings = player.getSettings()?.streaming?.abr
            audioVideoSettings.autoSwitchBitrate.video = false

            player.initialize(
              streamRef.current,
              `${video_url}${options?.src}/manifest/video.mpd`,
              false,
            )
            await fetchCaptions(
              `${video_url}${options?.src}/manifest/video.mpd`,
            )

            player.updateSettings({
              streaming: {
                abr: audioVideoSettings,
                buffer: {
                  stableBufferTime: 30,
                  bufferTimeAtTopQuality: 60,
                  bufferTimeAtTopQualityLongForm: 120,
                },
              },
            })

            player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
              setTimeout(() => {
                const currentVideoQualityIndex = player.getQualityFor('video')
                const getListBit = player.getBitrateInfoListFor('video')
                player.setQualityFor(
                  'video',
                  getListBit?.[currentVideoQualityIndex]?.qualityIndex,
                  true,
                )

                setListQualitys(getListBit)
                setPlaybackQuality(
                  getListBit?.[currentVideoQualityIndex]?.bitrate,
                )
              }, 1000)
              setPlayerFunction(player)
            })

            player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, () => {
              setCanPlay(true)
              setCloudflarePlayer(false)
            })

            player.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, () => {
              setSeeking(true)
            })

            player.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, () => {
              setSeeking(false)
            })
          } else {
            setCanPlay(true)
            setCloudflarePlayer(true)
          }
        } else {
          setCanPlay(true)
          setCloudflarePlayer(true)
        }
      }
    }
    initTerminal()
    return () => {
      if (player) {
        player.reset()
        player.off(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, () =>
          setSeeking(true),
        )
        player.off(dashjs.MediaPlayer.events.PLAYBACK_SEEKED, () =>
          setSeeking(false),
        )
      }
    }
  }, [options?.src])

  // Get list captions of video
  const fetchCaptions = async (url: string) => {
    try {
      const response = await fetcher(url)
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(response, 'text/xml')
      const adaptationSets = xmlDoc.getElementsByTagName('AdaptationSet')
      const captions = []
      for (let i = 0; i < adaptationSets.length; i++) {
        const mimeType = adaptationSets[i].getAttribute('mimeType')
        if (mimeType === 'text/vtt') {
          captions.push(adaptationSets[i])
        }
      }
      const newlistCaptions = captions.map((caption, index) => {
        const lang = caption.getAttribute('lang')
        return {
          lang: lang,
          index: index,
        }
      })
      setlistCaptions(newlistCaptions)
    } catch (error) {}
  }

  useEffect(() => {
    // Add eventlisteners
    if (options?.src) {
      if (streamRef.current) {
        resetStreamHandlers()
        streamRef.current.addEventListener('play', updatePlayButton)
        streamRef.current.addEventListener('pause', updatePlayButton)
        streamRef.current.addEventListener('loadedmetadata', initializeVideo)
        streamRef.current.addEventListener('timeupdate', updateTimeElapsed)
        streamRef.current.addEventListener('timeupdate', updateProgress)
        streamRef.current.addEventListener('volumechange', updateVolumeIcon)
        streamRef.current.addEventListener('click', togglePlay)
        streamRef.current.addEventListener('click', animatePlayback)
        streamRef.current.addEventListener('mousemove', showControls)
        streamRef.current.addEventListener('mouseleave', hideControls)
      }
      if (videoControlsRef.current) {
        videoControlsRef.current.addEventListener('mousemove', showControls)
        videoControlsRef.current.addEventListener('mouseleave', hideControls)
      }
      if (seekRef.current) {
        seekRef.current.addEventListener('mousemove', updateSeekTooltip)
        seekRef.current.addEventListener('input', skipAhead)
      }
      if (volumeRef.current) {
        volumeRef.current.addEventListener('input', updateVolume)
      }
      if (videoContainerRef.current) {
        videoContainerRef.current.addEventListener(
          'fullscreenchange',
          updateFullscreenButton,
        )
      }
      const videoWorks = !!streamRef.current?.canPlayType
      if (videoWorks && videoControlsRef.current) {
        streamRef.current.controls = false
        videoControlsRef.current.classList.remove('hidden')
      }
    }

    return () => {
      if (options?.src) {
        if (streamRef.current) {
          streamRef.current.removeEventListener('play', updatePlayButton)
          streamRef.current.removeEventListener('pause', updatePlayButton)
          streamRef.current.removeEventListener(
            'loadedmetadata',
            initializeVideo,
          )
          streamRef.current.removeEventListener('timeupdate', updateTimeElapsed)
          streamRef.current.removeEventListener('timeupdate', updateProgress)
          streamRef.current.removeEventListener(
            'volumechange',
            updateVolumeIcon,
          )
          streamRef.current.removeEventListener('click', togglePlay)
          streamRef.current.removeEventListener('click', animatePlayback)
          streamRef.current.removeEventListener('mouseenter', showControls)
          streamRef.current.removeEventListener('mouseleave', hideControls)
        }
        if (videoControlsRef.current) {
          videoControlsRef.current.removeEventListener(
            'mouseenter',
            showControls,
          )
          videoControlsRef.current.removeEventListener(
            'mouseleave',
            hideControls,
          )
        }
        if (seekRef.current) {
          seekRef.current.removeEventListener('mousemove', updateSeekTooltip)
          seekRef.current.removeEventListener('input', skipAhead)
        }
        if (volumeRef.current) {
          volumeRef.current.removeEventListener('input', updateVolume)
        }
        if (videoContainerRef.current) {
          videoContainerRef.current.removeEventListener(
            'fullscreenchange',
            updateFullscreenButton,
          )
        }
      }
    }
  }, [options?.src, streamRef?.current, playbackAnimationRef?.current])

  useEffect(() => {
    let interval: NodeJS.Timeout
    let delayTimeout: NodeJS.Timeout

    const updateLoadingPercentage = () => {
      setLoadingPercentage((prev) => {
        if (prev < 90) {
          return prev + 18
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }

    interval = setInterval(updateLoadingPercentage, 500)

    delayTimeout = setTimeout(() => {
      clearInterval(interval)
      if (loadingPercentage <= 90) {
        setLoadingPercentage(91)
      }
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(delayTimeout)
    }
  }, [loadingPercentage])

  useEffect(() => {
    if (canPlay) {
      setLoadingPercentage(100)
      setLoading(false)
    }
  }, [canPlay])

  // Time and btn will be reset to its original state
  function resetStreamHandlers() {
    if (timeElapsedRef.current) {
      timeElapsedRef.current.innerText = `00:00`
    }
    const playIcon = playButtonRef?.current?.querySelector('.play')
    const pauseIcon = playButtonRef?.current?.querySelector('.pause')
    if (playIcon && pauseIcon) {
      playButtonRef?.current?.setAttribute('data-title', 'Play')
      playIcon?.classList?.remove('hidden')
      pauseIcon?.classList?.add('hidden')
    }
  }

  // togglePlay toggles the playback state of the video.
  // If the video playback is paused or ended, the video is played
  // otherwise, the video is paused
  function togglePlay() {
    if (streamRef?.current?.paused || streamRef?.current?.ended) {
      streamRef.current?.play()
    } else {
      streamRef.current?.pause()
    }
  }

  // updatePlayButton updates the playback icon and tooltip
  // depending on the playback state
  function updatePlayButton() {
    const playIcon = playButtonRef?.current?.querySelector('.play')
    const pauseIcon = playButtonRef?.current?.querySelector('.pause')

    if (streamRef?.current?.paused) {
      playButtonRef?.current?.setAttribute('data-title', 'Play')
      playIcon?.classList?.remove('hidden')
      pauseIcon?.classList?.add('hidden')
    } else {
      playButtonRef?.current?.setAttribute('data-title', 'Pause')
      playIcon?.classList?.add('hidden')
      pauseIcon?.classList?.remove('hidden')
    }
  }

  // initializeVideo sets the video duration, and maximum value of the
  // progressBar
  function initializeVideo() {
    const videoDuration = Math.round(streamRef?.current?.duration)
    seekRef?.current?.setAttribute('max', String(videoDuration))
    progressBarRef?.current?.setAttribute('max', String(videoDuration))
    const time = formatTimeToHourMinuteSecond(videoDuration)
    if (durationRef?.current) {
      durationRef.current.innerText = `${
        time.hours !== '00' ? time.hours + ':' : ''
      }${time.minutes}:${time.seconds}`
      durationRef.current.setAttribute(
        'datetime',
        `${time.hours !== '00' ? time.hours + 'h ' : ''}${time.minutes}m ${
          time.seconds
        }s`,
      )
    }
    const markers = videoControlsRef.current?.querySelectorAll('.marker')

    // Loop through each marker in the array
    if (timeQuiz && markers) {
      timeQuiz.forEach((marker: any, index: number) => {
        const percentage = (Number(marker[0]?.time) / videoDuration) * 100
        const leftStyle = `${percentage}%`
        const markerElement = markers[index] as HTMLElement

        // Thêm style left vào marker
        markerElement.style.left = leftStyle
      })
    }
  }

  // updateTimeElapsed indicates how far through the video
  // the current playback is by updating the timeElapsed element
  function updateTimeElapsed() {
    if (streamRef?.current && streamRef?.current?.readyState) {
      const time = formatTimeToHourMinuteSecond(
        Math.round(streamRef.current?.currentTime || 0),
      )
      if (timeElapsedRef.current) {
        timeElapsedRef.current.innerText = `${
          time.hours !== '00' ? time.hours + ':' : ''
        }${time.minutes}:${time.seconds}`
        timeElapsedRef.current.setAttribute(
          'datetime',
          `${time.hours !== '00' ? time.hours + 'h ' : ''}${time.minutes}m ${
            time.seconds
          }s`,
        )
      }
    }
  }

  // updateProgress indicates how far through the video
  // the current playback is by updating the progress bar
  function updateProgress() {
    let currentTime = Math.ceil(streamRef?.current?.currentTime || 0)
    if (seekRef?.current) {
      seekRef.current.value = String(currentTime)
    }
    if (progressBarRef?.current) {
      progressBarRef.current.value = currentTime
    }
  }

  // updateSeekTooltip uses the position of the mouse on the progress bar to
  // roughly work out what point in the video the user will skip to if
  // the progress bar is clicked at that point
  function updateSeekTooltip(event: MouseEvent) {
    const skipTo = Math.round(
      (event.offsetX / (event.target as HTMLElement).clientWidth) *
        parseInt((event.target as HTMLElement).getAttribute('max') || '0', 10),
    )
    const t = formatTimeToHourMinuteSecond(skipTo)
    if (
      progressBarRef?.current &&
      seekRef?.current &&
      seekTooltipRef?.current
    ) {
      const rect = progressBarRef.current.getBoundingClientRect()
      seekRef.current.setAttribute('data-seek', String(skipTo))
      seekTooltipRef.current.textContent = `${
        t.hours !== '00' ? t.hours + ':' : ''
      }${t.minutes}:${t.seconds}`
      seekTooltipRef.current.style.left = `${event.pageX - rect.left}px`
    }
  }

  // skipAhead jumps to a different point in the video when the progress bar
  // is clicked
  function skipAhead(event: Event) {
    const skipTo =
      event.target instanceof HTMLInputElement ? event.target.value : '0'
    streamRef.current.currentTime = parseInt(skipTo, 10)
    if (progressBarRef?.current) {
      progressBarRef.current.value = Number(skipTo)
    }
    if (seekRef?.current) {
      seekRef.current.value = skipTo
    }
  }

  // updateVolume updates the video's volume
  // and disables the muted state if active
  function updateVolume() {
    if (streamRef?.current?.muted) {
      streamRef.current.muted = false
    }
    if (volumeRef?.current) {
      streamRef.current.volume = Number(volumeRef.current.value)
      setValueVolume(Number(volumeRef.current.value))
    }
  }

  // updateVolumeIcon updates the volume icon so that it correctly reflects
  // the volume of the video
  function updateVolumeIcon() {
    if (!volumeButtonRef.current) return

    const volumeMute = volumeButtonRef.current.querySelector('.volume-mute')
    const volumeLow = volumeButtonRef.current.querySelector('.volume-low')
    const volumeHigh = volumeButtonRef.current.querySelector('.volume-high')

    if (!volumeMute || !volumeLow || !volumeHigh) return

    const isMuted = streamRef.current.muted || streamRef.current.volume === 0
    const isLowVolume =
      streamRef.current.volume > 0 && streamRef.current.volume <= 0.5

    volumeButtonRef.current.setAttribute(
      'data-title',
      isMuted ? 'Unmute' : 'Mute',
    )
    volumeMute.classList.toggle('hidden', !isMuted)
    volumeLow.classList.toggle('hidden', isMuted || !isLowVolume)
    volumeHigh.classList.toggle('hidden', isMuted || isLowVolume)
  }

  // toggleMute mutes or unmutes the video when executed
  // When the video is unmuted, the volume is returned to the value
  // it was set to before the video was muted
  function toggleMute() {
    if (streamRef?.current) {
      streamRef.current.muted = !streamRef.current.muted
      if (streamRef.current.muted && volumeRef.current) {
        volumeRef.current.setAttribute('data-volume', volumeRef.current.value)
        volumeRef.current.value = '0'
        setValueVolume(0)
      } else if (volumeRef.current) {
        volumeRef.current.value = String(volumeRef.current.dataset.volume)
        setValueVolume(Number(volumeRef.current.dataset.volume))
      }
    }
  }

  // animatePlayback displays an animation when
  // the video is played or paused
  function animatePlayback() {
    const playIcon = playbackAnimationRef?.current?.querySelector('.play')
    const pauseIcon = playbackAnimationRef?.current?.querySelector('.pause')

    if (playIcon && pauseIcon) {
      playIcon.classList.toggle('hidden')
      pauseIcon.classList.toggle('hidden')
    }

    if (playbackAnimationRef?.current) {
      playbackAnimationRef.current.animate(
        [
          {
            opacity: 1,
            transform: 'scale(1)',
          },
          {
            opacity: 0,
            transform: 'scale(1.3)',
          },
        ],
        {
          duration: 500,
        },
      )
    }
  }

  // toggleFullScreen toggles the full screen state of the video
  // If the browser is currently in fullscreen mode,
  // then it should exit and vice versa.
  function toggleFullScreen() {
    if (document?.fullscreenElement) {
      document.exitFullscreen()
    } else if (
      videoContainerRef?.current &&
      videoContainerRef?.current?.requestFullscreen
    ) {
      videoContainerRef?.current?.requestFullscreen()
    }
  }

  // updateFullscreenButton changes the icon of the full screen button
  // and tooltip to reflect the current full screen state of the video
  function updateFullscreenButton() {
    const fullScreenIcon =
      fullscreenButtonRef?.current?.querySelector('.fullscreen')
    const fullScreenExitIcon =
      fullscreenButtonRef?.current?.querySelector('.fullscreen-exit')

    if (fullscreenButtonRef?.current && fullScreenIcon && fullScreenExitIcon) {
      const isFullScreen = document.fullscreenElement !== null
      setIsFullscreen(isFullScreen)
      fullscreenButtonRef.current.setAttribute(
        'data-title',
        `${isFullScreen ? 'Exit' : 'Enter'} full screen`,
      )
      fullScreenIcon.classList.toggle('hidden', isFullScreen)
      fullScreenExitIcon.classList.toggle('hidden', !isFullScreen)
    }
  }

  // hideControls hides the video controls when not in use
  // if the video is paused, the controls must remain visible
  function hideControls() {
    if (streamRef?.current?.paused) {
      return
    }
    if (videoControlsRef?.current) {
      videoControlsRef.current.classList.add('hide')
    }
  }

  // showControls displays the video controls
  function showControls() {
    if (videoControlsRef.current) {
      videoControlsRef.current.classList.remove('hide')
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = setTimeout(hideControls, 3000)
    }
  }

  // Event handler for changing video speed
  const handlePlaybackRateChange = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLLIElement
    const selectedSpeed = target?.dataset?.speed
    if (selectedSpeed) {
      const newPlaybackRate = parseFloat(selectedSpeed)
      setPlaybackRate(newPlaybackRate)
      if (streamRef?.current?.playbackRate) {
        streamRef.current.playbackRate = newPlaybackRate
      }
    }
  }

  const handleLanguageChange = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLLIElement
    const selectedCC = target?.dataset?.cc
    setPlaybackCC(Number(selectedCC))
    updatePlayButton()
    setTimeout(() => {
      if (playerFunction) {
        playerFunction.setTextTrack(Number(selectedCC))
        updatePlayButton()
      } else {
        // console.error("Player function is not initialized yet.");
      }
    }, 500)
  }

  // Function to change the video quality based on the selected option
  const changeQuality = (number: number | string, bit: number | string) => {
    updatePlayButton()
    setTimeout(() => {
      if (number === 'auto') {
        playerFunction.updateSettings({
          streaming: {
            abr: {
              autoSwitchBitrate: {
                video: true,
              },
            },
          },
        })
      } else {
        playerFunction.updateSettings({
          streaming: {
            abr: {
              autoSwitchBitrate: {
                video: false,
              },
            },
          },
        })
        playerFunction.setQualityFor('video', number, true)
      }
      updatePlayButton()
    }, 1000)
    setPlaybackQuality(bit)
  }

  // Hook to handle clicks outside of the settings panel to close it
  const toggleSettings = () => {
    setActiveSettings(!activeSettings)
  }

  // Hook to handle clicks outside of the settings panel to close it
  useClickOutside({
    ref: listSettingsRef,
    callback: () => setActiveSettings(false),
  })

  // Filter function to remove duplicate resolutions from the qualities list
  const filterUniqueResolutions = (qualities: Quality[]): Quality[] => {
    const resolutionMap: ResolutionMap = {} as ResolutionMap

    for (const quality of qualities) {
      const resolution = getResolution(quality.bitrate) as ResolutionTypes
      resolutionMap[resolution] = quality
    }

    return Object.values(resolutionMap).filter(
      (quality): quality is Quality => quality !== undefined,
    )
  }

  const togglePictureInPicture = async () => {
    const video = streamRef.current
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else {
        await video.play()
        await video.requestPictureInPicture()
      }
    } catch (err) {}
  }
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = async () => {
      if (document.pictureInPictureElement) {
        try {
          await document.exitPictureInPicture()
        } catch (err) {
          // console.error('Error exiting PiP on route change:', err);
        }
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])
  const questionConditions = activityId && document_id && grading_preference

  return (
    <>
      <div
        className={`${loading ? 'visible' : 'hidden'} flex-center relative h-full w-full pt-[56.26%]`}
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
          {thumbnail && (
            <Image
              src={
                thumbnail?.['950x535'] ??
                '/assets/images/default_thumbnail_video.png'
              }
              alt={'Thumbnail image'}
              className="h-full w-full object-contain"
              width={952}
              height={535.5}
              priority
            />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-overlay-loading opacity-80 transition-opacity">
          <LoadingIcon
            loading={loading}
            loadingPercentage={loadingPercentage}
            stroke="#ffffff"
          />
        </div>
      </div>
      {options?.src && (
        <>
          {cloudflarePlayer ? (
            <div
              className={`group ${
                !hideVideo ? styles.wrapper : styles.hideWrapper
              } ${loading ? 'hidden' : ''}`}
            >
              {!isFullscreen && (
                <div className={`popup-question`}>{children}</div>
              )}
              <Stream
                {...options}
                key={options?.src}
                streamRef={streamRef}
                controls
                responsive={false}
                className={`${styles.content}`}
                onSeeking={() => {
                  if (streamRef.current && pauseOnSeek) {
                    streamRef.current.pause()
                  }
                }}
                autoplay={false}
              ></Stream>
            </div>
          ) : (
            <div
              className={`sapp-video-custom video-container group ${
                !hideVideo ? styles.wrapper : styles.hideWrapper
              } ${loading ? 'hidden' : ''}`}
              ref={videoContainerRef}
            >
              {!isFullscreen && (
                <div className={`popup-question`}>{children}</div>
              )}
              <div
                className="playback-animation flex-center"
                ref={playbackAnimationRef}
              >
                <svg className="icon-svg playback-icons h-6 w-6">
                  <path
                    className="play hidden"
                    d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"
                  ></path>
                  <path
                    className="pause"
                    d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"
                  ></path>
                </svg>
              </div>

              {seeking && (
                <div className="loadingOverlay">
                  <LoadingIcon stroke="#404041" />
                </div>
              )}
              <video
                {...options}
                key={options.src}
                ref={streamRef}
                controls={false}
                className={`${styles.content}`}
                poster={
                  thumbnail?.['950x535'] ??
                  '/assets/images/default_thumbnail_video.png'
                }
                onSeeking={() => {
                  if (streamRef?.current && pauseOnSeek && openQuestion) {
                    streamRef.current.pause()
                  }
                }}
                autoPlay={false}
                // disablePictureInPicture
                controlsList="nodownload"
              />
              {isFullscreen && questionConditions && (
                <FullScreenQuizComponent
                  finishAll={finishAll}
                  isConfirmQuestion={isConfirmQuestion}
                  modalOpen={modalOpen}
                  activityId={activityId}
                  tabId={tabId || ''}
                  quizId={quizId || ''}
                  questionRef={questionRef}
                  activeQuestion={activeQuestion}
                  document_id={document_id}
                  grading_preference={grading_preference}
                  handleSubmitQuestion={handleSubmitQuestion}
                  handleCancelQuestion={handleCancelQuestion}
                />
              )}
              <div
                className="video-controls flex-center absolute bottom-0 left-0 right-0 hidden h-14 w-full rounded-b-lg px-5 py-3"
                ref={videoControlsRef}
              >
                <div className="flex-center flex w-full items-center gap-6">
                  <div className="left-controls flex items-center gap-4 text-white">
                    <button
                      className="btn-video mr-4 flex h-8 w-8 items-center justify-center rounded bg-[#E5E7EB] before:-right-4"
                      data-title="Play"
                      ref={playButtonRef}
                      onClick={() => {
                        togglePlay()
                        animatePlayback()
                      }}
                    >
                      <svg className="icon-svgplay playback-icons h-6 w-6">
                        <path
                          className="play"
                          d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"
                        ></path>
                        <path
                          className="pause hidden"
                          d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"
                        ></path>
                      </svg>
                    </button>

                    <div className="time flex-center mr-4 gap-1 text-xsm font-normal leading-normal text-[#E3E3E3]">
                      <time ref={timeElapsedRef}>00:00</time>
                      <span> / </span>
                      <time ref={durationRef}>00:00</time>
                    </div>
                  </div>
                  <div className="relative h-[6px] w-full text-justify">
                    <progress
                      className="pointer-events-none absolute top-0 h-[6px] w-full"
                      ref={progressBarRef}
                    />
                    <input
                      className="seek absolute top-0 z-10 m-0 w-full cursor-pointer"
                      min="0"
                      type="range"
                      step="1"
                      ref={seekRef}
                      defaultValue="0"
                    />
                    <div
                      className="seek-tooltip absolute top-[-50px] -ml-5 hidden bg-[#00000080] p-1 text-xsm font-semibold text-white"
                      ref={seekTooltipRef}
                    >
                      00:00
                    </div>
                    <>
                      {timeQuiz &&
                        timeQuiz.map((e: any, i: number) => {
                          return (
                            <div
                              key={i}
                              className="marker absolute top-0 z-[5] h-[6px] w-1.5 bg-primary"
                              title={e[0]?.question_topic?.name}
                            ></div>
                          )
                        })}
                    </>
                  </div>

                  <div className="right-controls flex-center flex items-center gap-4">
                    <div className="volume-controls relative flex h-8 items-center">
                      <button
                        data-title="Mute"
                        className="btn-video volume-button"
                        ref={volumeButtonRef}
                        onClick={toggleMute}
                      >
                        <svg
                          className="icon-svg volume-mute hidden"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {' '}
                            <path
                              d="M16.25 11.9998C16.25 11.5856 15.9142 11.2498 15.5 11.2498C15.0858 11.2498 14.75 11.5856 14.75 11.9998H16.25ZM7.0162 6.95791L7.14108 7.69744L7.0162 6.95791ZM8.59932 6.22002L8.18647 5.59387L8.18647 5.59387L8.59932 6.22002ZM7.72795 6.74438L8.03077 7.43053L7.72795 6.74438ZM3.33988 16.7225L3.02496 17.4032L3.33988 16.7225ZM1.53479 13.0282L0.786179 13.0738L1.53479 13.0282ZM1.95854 15.4228L2.6188 15.067L1.95854 15.4228ZM13.7001 20.0747L13.4578 19.3649L13.7001 20.0747ZM15.4127 14.6052L16.1619 14.64L15.4127 14.6052ZM14.2797 19.7797L14.7109 20.3934L14.2797 19.7797ZM8.81825 6.07566L9.2311 6.70181L9.2311 6.70181L8.81825 6.07566ZM13.7001 3.92487L13.4578 4.63468L13.7001 3.92487ZM14.2797 4.21984L14.7109 3.60621L14.2797 4.21984ZM3.33988 7.27707L3.02496 6.5964L3.33988 7.27707ZM1.53479 10.9714L0.786179 10.9258L1.53479 10.9714ZM1.95854 8.57679L2.6188 8.93254L1.95854 8.57679ZM9.91107 17.7452C9.56462 17.5182 9.09972 17.615 8.87269 17.9615C8.64566 18.3079 8.74247 18.7728 9.08893 18.9998L9.91107 17.7452ZM9.01216 6.84616L9.2311 6.70181L8.40541 5.44952L8.18647 5.59387L9.01216 6.84616ZM2.2834 12.9826C2.26225 12.6356 2.25 12.303 2.25 11.9998H0.75C0.75 12.3414 0.763733 12.7056 0.786179 13.0738L2.2834 12.9826ZM2.25 11.9998C2.25 11.6966 2.26225 11.364 2.2834 11.017L0.786179 10.9258C0.763733 11.294 0.75 11.6582 0.75 11.9998H2.25ZM14.75 11.9998C14.75 12.5116 14.7156 13.4508 14.6635 14.5704L16.1619 14.64C16.2137 13.525 16.25 12.5518 16.25 11.9998H14.75ZM6.00008 7.74979C6.48771 7.74979 6.81682 7.7522 7.14108 7.69744L6.89132 6.21838C6.71956 6.24738 6.5366 6.24979 6.00008 6.24979V7.74979ZM8.18647 5.59387C7.73856 5.8892 7.58448 5.98791 7.42513 6.05823L8.03077 7.43053C8.33163 7.29775 8.60506 7.11458 9.01216 6.84616L8.18647 5.59387ZM7.14108 7.69744C7.44756 7.64568 7.74641 7.55603 8.03077 7.43053L7.42513 6.05823C7.25452 6.13353 7.0752 6.18732 6.89132 6.21838L7.14108 7.69744ZM6.00008 17.7498C6.5366 17.7498 6.71956 17.7522 6.89132 17.7812L7.14108 16.3021C6.81682 16.2474 6.48771 16.2498 6.00008 16.2498V17.7498ZM6.00008 16.2498C4.55641 16.2498 4.06911 16.2335 3.6548 16.0418L3.02496 17.4032C3.80931 17.7661 4.69593 17.7498 6.00008 17.7498V16.2498ZM0.786179 13.0738C0.856484 14.2273 0.890091 15.021 1.29828 15.7785L2.6188 15.067C2.40052 14.6619 2.36045 14.2467 2.2834 12.9826L0.786179 13.0738ZM3.6548 16.0418C3.25445 15.8566 2.82804 15.4554 2.6188 15.067L1.29828 15.7785C1.66141 16.4525 2.33016 17.0817 3.02496 17.4032L3.6548 16.0418ZM14.6635 14.5704C14.5924 16.1011 14.541 17.1731 14.4015 17.9479C14.2626 18.7193 14.0651 19.0139 13.8485 19.1661L14.7109 20.3934C15.417 19.8972 15.7159 19.1131 15.8778 18.2137C16.0391 17.3178 16.0928 16.1266 16.1619 14.64L14.6635 14.5704ZM13.9423 20.7845C14.2142 20.6917 14.4759 20.5585 14.7109 20.3934L13.8485 19.1661C13.7297 19.2496 13.5952 19.318 13.4578 19.3649L13.9423 20.7845ZM9.2311 6.70181C10.5209 5.85139 11.426 5.2565 12.1402 4.90954C12.8525 4.56352 13.2087 4.54965 13.4578 4.63468L13.9423 3.21506C13.1241 2.93586 12.3108 3.15904 11.4848 3.56031C10.6607 3.96063 9.65858 4.62325 8.40541 5.44952L9.2311 6.70181ZM13.4578 4.63468C13.5952 4.68157 13.7297 4.74998 13.8485 4.83346L14.7109 3.60621C14.4759 3.44103 14.2142 3.30784 13.9423 3.21506L13.4578 4.63468ZM6.00008 6.24979C4.69593 6.24979 3.80931 6.23351 3.02496 6.5964L3.6548 7.95775C4.06911 7.76607 4.55641 7.74979 6.00008 7.74979V6.24979ZM2.2834 11.017C2.36045 9.75285 2.40052 9.33765 2.6188 8.93254L1.29828 8.22104C0.890091 8.97862 0.856484 9.77226 0.786179 10.9258L2.2834 11.017ZM3.02496 6.5964C2.33016 6.91785 1.66141 7.54708 1.29828 8.22104L2.6188 8.93254C2.82804 8.54419 3.25445 8.14298 3.6548 7.95775L3.02496 6.5964ZM9.08893 18.9998C10.1277 19.6806 10.9875 20.2245 11.7204 20.5488C12.4627 20.8771 13.2003 21.0377 13.9423 20.7845L13.4578 19.3649C13.2324 19.4418 12.9187 19.4386 12.3272 19.177C11.7264 18.9112 10.9698 18.439 9.91107 17.7452L9.08893 18.9998ZM16.1231 8.53978C16.0624 7.31263 15.9963 6.30685 15.827 5.52953C15.6552 4.7411 15.3503 4.05557 14.7109 3.60621L13.8485 4.83346C14.0443 4.97111 14.2254 5.22507 14.3614 5.84888C14.4997 6.48379 14.5631 7.36297 14.6249 8.61379L16.1231 8.53978Z"
                              fill="#fff"
                            ></path>{' '}
                            <path
                              d="M20 18C20 18 21.5 16.2 21.5 12C21.5 9.56658 20.9965 7.93882 20.5729 7"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                            <path
                              d="M18 15C18 15 18.5 14.1 18.5 12C18.5 11.1381 18.4158 10.4784 18.3165 10"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                            <path
                              d="M22 2L2 22"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                          </g>
                        </svg>
                        <svg
                          className="icon-svg volume-low hidden"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {' '}
                            <path
                              d="M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                            <path
                              d="M1.95863 8.57679C2.24482 8.04563 2.79239 7.53042 3.33997 7.27707C3.9393 6.99979 4.62626 6.99979 6.00018 6.99979C6.51225 6.99979 6.76828 6.99979 7.01629 6.95791C7.26147 6.9165 7.50056 6.84478 7.72804 6.74438C7.95815 6.64283 8.1719 6.50189 8.59941 6.22002L8.81835 6.07566C11.3613 4.39898 12.6328 3.56063 13.7001 3.92487C13.9048 3.9947 14.1029 4.09551 14.2798 4.21984C15.2025 4.86829 15.2726 6.37699 15.4128 9.3944C15.4647 10.5117 15.5001 11.4679 15.5001 11.9998C15.5001 12.5317 15.4647 13.4879 15.4128 14.6052C15.2726 17.6226 15.2025 19.1313 14.2798 19.7797C14.1029 19.9041 13.9048 20.0049 13.7001 20.0747C12.6328 20.4389 11.3613 19.6006 8.81834 17.9239L8.59941 17.7796C8.1719 17.4977 7.95815 17.3567 7.72804 17.2552C7.50056 17.1548 7.26147 17.0831 7.01629 17.0417C6.76828 16.9998 6.51225 16.9998 6.00018 16.9998C4.62626 16.9998 3.9393 16.9998 3.33997 16.7225C2.79239 16.4692 2.24482 15.9539 1.95863 15.4228C1.6454 14.8414 1.60856 14.237 1.53488 13.0282C1.52396 12.849 1.51525 12.6722 1.50928 12.4998"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                          </g>
                        </svg>
                        <svg
                          className={'icon-svg volume-high'}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {' '}
                            <path
                              d="M20 6C20 6 21.5 7.8 21.5 12C21.5 16.2 20 18 20 18"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                            <path
                              d="M18 9C18 9 18.5 9.9 18.5 12C18.5 14.1 18 15 18 15"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                            <path
                              d="M1.95863 8.57679C2.24482 8.04563 2.79239 7.53042 3.33997 7.27707C3.9393 6.99979 4.62626 6.99979 6.00018 6.99979C6.51225 6.99979 6.76828 6.99979 7.01629 6.95791C7.26147 6.9165 7.50056 6.84478 7.72804 6.74438C7.95815 6.64283 8.1719 6.50189 8.59941 6.22002L8.81835 6.07566C11.3613 4.39898 12.6328 3.56063 13.7001 3.92487C13.9048 3.9947 14.1029 4.09551 14.2798 4.21984C15.2025 4.86829 15.2726 6.37699 15.4128 9.3944C15.4647 10.5117 15.5001 11.4679 15.5001 11.9998C15.5001 12.5317 15.4647 13.4879 15.4128 14.6052C15.2726 17.6226 15.2025 19.1313 14.2798 19.7797C14.1029 19.9041 13.9048 20.0049 13.7001 20.0747C12.6328 20.4389 11.3613 19.6006 8.81834 17.9239L8.59941 17.7796C8.1719 17.4977 7.95815 17.3567 7.72804 17.2552C7.50056 17.1548 7.26147 17.0831 7.01629 17.0417C6.76828 16.9998 6.51225 16.9998 6.00018 16.9998C4.62626 16.9998 3.9393 16.9998 3.33997 16.7225C2.79239 16.4692 2.24482 15.9539 1.95863 15.4228C1.6454 14.8414 1.60856 14.237 1.53488 13.0282C1.52396 12.849 1.51525 12.6722 1.50928 12.4998"
                              stroke="#fff"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{' '}
                          </g>
                        </svg>
                      </button>

                      <div className="volume-process">
                        <input
                          ref={volumeRef}
                          className="volume w-full opacity-100"
                          defaultValue={valueVolume}
                          type="range"
                          max="1"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="volume-controls relative flex h-8 items-center">
                      <button
                        data-title="pip"
                        className="btn-video volume-button text-white"
                        onClick={togglePictureInPicture}
                      >
                        <PiPIcon />
                      </button>
                    </div>
                    <div
                      className={`settings-control icon-svg relative text-white ${
                        activeSettings ? 'active' : ''
                      }`}
                      ref={listSettingsRef}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 256 256"
                        onClick={() => toggleSettings()}
                      >
                        <path
                          fill="currentColor"
                          strokeMiterlimit="10"
                          strokeWidth="1"
                          d="M52.1 90H37.9a5.206 5.206 0 01-5.2-5.2v-2.114c0-.329-.191-.634-.454-.725a38.833 38.833 0 01-4.375-1.816c-.246-.118-.576-.046-.802.18l-1.516 1.516a5.165 5.165 0 01-3.677 1.523 5.163 5.163 0 01-3.677-1.524L8.16 71.799a5.207 5.207 0 010-7.354l1.516-1.516c.223-.223.299-.56.181-.8a38.922 38.922 0 01-1.818-4.377c-.092-.262-.396-.452-.725-.452H5.2A5.206 5.206 0 010 52.1V37.9c0-2.867 2.333-5.2 5.2-5.2h2.115c.329 0 .633-.19.724-.454a39.153 39.153 0 011.817-4.374c.12-.246.046-.576-.181-.802L8.16 25.555a5.207 5.207 0 010-7.354L18.201 8.159a5.165 5.165 0 013.677-1.522 5.17 5.17 0 013.677 1.522l1.516 1.517c.224.223.559.3.801.18a39.096 39.096 0 014.375-1.818c.263-.091.453-.395.453-.724V5.2c0-2.867 2.333-5.2 5.2-5.2h14.2c2.867 0 5.2 2.333 5.2 5.2v2.115c0 .329.19.633.453.724a39.111 39.111 0 014.375 1.818c.247.118.575.045.802-.181l1.516-1.516a5.207 5.207 0 017.354 0L81.84 18.2a5.207 5.207 0 010 7.354l-1.516 1.516c-.227.227-.301.556-.181.802a38.6 38.6 0 011.818 4.376c.09.262.395.452.724.452H84.8c2.867 0 5.2 2.333 5.2 5.2v14.2c0 2.867-2.333 5.2-5.2 5.2h-2.114c-.329 0-.634.19-.725.454a39.153 39.153 0 01-1.815 4.373c-.119.244-.044.58.179.803l1.516 1.516a5.207 5.207 0 010 7.354L71.799 81.84a5.166 5.166 0 01-3.677 1.523 5.165 5.165 0 01-3.678-1.525l-1.514-1.513c-.228-.226-.557-.302-.803-.182a38.6 38.6 0 01-4.376 1.818c-.262.09-.452.395-.452.724V84.8A5.205 5.205 0 0152.1 90zm-12.4-7h10.6v-.314c0-3.322 2.076-6.272 5.167-7.34a31.94 31.94 0 003.588-1.491c2.936-1.434 6.481-.822 8.824 1.521l.243.242 7.495-7.495-.242-.243c-2.345-2.344-2.955-5.891-1.519-8.825a31.997 31.997 0 001.488-3.585c1.068-3.093 4.019-5.169 7.341-5.169H83V39.7h-.314c-3.322 0-6.272-2.076-7.34-5.167a31.94 31.94 0 00-1.491-3.588c-1.434-2.936-.823-6.482 1.521-8.825l.242-.243-7.495-7.495-.243.243c-2.344 2.344-5.89 2.953-8.824 1.52a32.08 32.08 0 00-3.587-1.491c-3.091-1.067-5.168-4.017-5.168-7.34V7H39.7v.314c0 3.323-2.077 6.272-5.168 7.34-1.217.42-2.424.922-3.587 1.491-2.936 1.434-6.481.823-8.825-1.52l-.243-.243-7.495 7.495.243.243c2.343 2.344 2.954 5.89 1.52 8.825a31.98 31.98 0 00-1.49 3.587c-1.068 3.092-4.018 5.168-7.34 5.168H7v10.6h.314c3.323 0 6.272 2.077 7.34 5.168a31.985 31.985 0 001.491 3.588c1.435 2.933.824 6.479-1.52 8.823l-.243.243 7.496 7.495.242-.242c2.344-2.346 5.891-2.954 8.826-1.52a31.99 31.99 0 003.585 1.489c3.092 1.068 5.168 4.019 5.168 7.341V83zm5.328-12.598a25.41 25.41 0 01-17.991-7.439c-5.265-5.265-7.947-12.561-7.359-20.016.97-12.296 10.974-22.3 23.27-23.27 7.457-.588 14.751 2.095 20.016 7.359 5.265 5.266 7.947 12.561 7.36 20.017-.971 12.297-10.975 22.3-23.271 23.27-.677.053-1.352.079-2.025.079zm-.059-43.804c-.489 0-.979.02-1.471.058-8.899.702-16.14 7.943-16.842 16.843-.427 5.41 1.516 10.7 5.331 14.515s9.1 5.761 14.516 5.331c8.899-.701 16.141-7.941 16.843-16.842a18.442 18.442 0 00-5.331-14.516 18.427 18.427 0 00-13.046-5.389z"
                          transform="matrix(2.81 0 0 2.81 1.407 1.407)"
                        ></path>
                      </svg>
                      <>
                        <div className="settings-control-popup absolute -right-8 bottom-5 hidden w-44 rounded bg-[#00000099] py-1 text-center text-white">
                          {!activeQuality && !activeSpeed && !activeCC && (
                            <div className="px-4 py-1">
                              <div
                                className="flex items-center justify-between"
                                onClick={() => setActiveQuality(true)}
                              >
                                <span className="block w-16 text-left text-sm font-semibold">
                                  Quality:
                                </span>
                                <span className="flex items-center justify-between gap-1 text-xsm font-medium">
                                  {playbackQuality === 'Auto'
                                    ? 'Auto'
                                    : getResolution(Number(playbackQuality))}
                                  <ArrowIcon
                                    className={'h-4 w-3'}
                                    right={true}
                                    iconType={'chervon'}
                                  ></ArrowIcon>
                                </span>
                              </div>
                              <div
                                className="flex items-center justify-between"
                                onClick={() => setActiveSpeed(true)}
                              >
                                <span className="block w-16 text-left text-sm font-semibold">
                                  Speed:
                                </span>
                                <span className="flex items-center justify-between gap-1 text-xsm font-medium">
                                  {playbackRate === 1 ? 'Normal' : playbackRate}
                                  <ArrowIcon
                                    className={'h-4 w-3'}
                                    right={true}
                                    iconType={'chervon'}
                                  ></ArrowIcon>
                                </span>
                              </div>
                              {listCaptions.length > 0 && (
                                <div
                                  className="flex items-center justify-between"
                                  onClick={() => setActiveCC(true)}
                                >
                                  <span className="block w-16 text-left text-sm font-semibold">
                                    CC:
                                  </span>
                                  <span className="flex items-center justify-between gap-1 text-xsm font-medium">
                                    {playbackCC === -1
                                      ? 'Off'
                                      : listCaptions[playbackCC].lang}
                                    <ArrowIcon
                                      className={'h-4 w-3'}
                                      right={true}
                                      iconType={'chervon'}
                                    ></ArrowIcon>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          {activeQuality && (
                            <>
                              <h4
                                className="relative px-1.5 text-base font-semibold"
                                onClick={() => setActiveQuality(false)}
                              >
                                <ArrowIcon
                                  className={'absolute left-1 top-1 h-4 w-4'}
                                  iconType={'chervon'}
                                ></ArrowIcon>
                                Quality
                              </h4>
                              <ul
                                className="quality-options text-xs font-normal"
                                onClick={() => setActiveQuality(false)}
                              >
                                <li
                                  key={'auto-switch'}
                                  onClick={() => changeQuality('auto', 'Auto')}
                                  className={`text-xsm hover:bg-white hover:text-black ${
                                    'Auto' === playbackQuality
                                      ? 'bg-white text-black'
                                      : ''
                                  }`}
                                >
                                  Auto
                                </li>
                                {filterUniqueResolutions(listQualitys).map(
                                  (quality: any) => (
                                    <li
                                      key={quality?.qualityIndex}
                                      onClick={() =>
                                        changeQuality(
                                          parseFloat(quality?.qualityIndex),
                                          quality?.bitrate,
                                        )
                                      }
                                      className={`text-xsm hover:bg-white hover:text-black ${
                                        quality?.bitrate === playbackQuality
                                          ? 'bg-white text-black'
                                          : ''
                                      }`}
                                    >
                                      {getResolution(quality?.bitrate || 0)}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </>
                          )}
                          {activeSpeed && (
                            <>
                              <h4
                                className="relative px-1.5 text-base font-semibold"
                                onClick={() => setActiveSpeed(false)}
                              >
                                <ArrowIcon
                                  className={'absolute left-1 top-1 h-4 w-4'}
                                  iconType={'chervon'}
                                ></ArrowIcon>
                                Speed
                              </h4>
                              <ul
                                className="speed-options text-xs font-normal"
                                onClick={() => setActiveSpeed(false)}
                              >
                                {playbackSpeeds.map((speed: any) => (
                                  <li
                                    key={speed.value}
                                    onClick={handlePlaybackRateChange}
                                    data-speed={speed.value}
                                    className={`text-xsm hover:bg-white hover:text-black ${
                                      parseFloat(speed.value) === playbackRate
                                        ? 'bg-white text-black'
                                        : ''
                                    }`}
                                  >
                                    {speed.label}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                          {activeCC && listCaptions.length > 0 && (
                            <>
                              <h4
                                className="relative px-1.5 text-base font-semibold"
                                onClick={() => setActiveCC(false)}
                              >
                                <ArrowIcon
                                  className={'absolute left-1 top-1 h-4 w-4'}
                                  iconType={'chervon'}
                                ></ArrowIcon>
                                CC
                              </h4>
                              <ul
                                className="cc-options text-xs font-normal"
                                onClick={() => setActiveCC(false)}
                              >
                                <li
                                  key={-1}
                                  onClick={handleLanguageChange}
                                  data-cc={-1}
                                  className={`text-xsm hover:bg-white hover:text-black ${
                                    -1 === playbackCC
                                      ? 'bg-white text-black'
                                      : ''
                                  }`}
                                >
                                  Off
                                </li>
                                {listCaptions.map((cc: Caption) => (
                                  <li
                                    key={cc.index}
                                    onClick={handleLanguageChange}
                                    data-cc={cc.index}
                                    className={`text-xsm hover:bg-white hover:text-black ${
                                      cc.index === playbackCC
                                        ? 'bg-white text-black'
                                        : ''
                                    }`}
                                  >
                                    {cc.lang}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </>
                    </div>
                    <button
                      ref={fullscreenButtonRef}
                      data-title="Full screen"
                      className="btn-video fullscreen-button"
                      onClick={toggleFullScreen}
                    >
                      <Icon
                        type={'fullscreen'}
                        className={'fullscreen h-6 w-5 text-white'}
                      />
                      <Icon
                        type={'fullscreen-exit'}
                        className={
                          ' fullscreen-exit hidden h-5.5 w-5 text-white'
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default SAPPVideo
