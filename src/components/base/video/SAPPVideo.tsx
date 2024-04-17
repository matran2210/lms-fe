import styles from '@styles/components/SAPPVideo.module.scss'
import { video_url } from '@utils/constants'
import { useEffect, useRef, useState, ReactNode } from 'react'
import Icon from '@components/icons'
import { formatTimeToHourMinuteSecond, getResolution } from '@utils/helpers'
import useClickOutside from '@components/base/clickoutside/HookClick'
import ArrowIcon from '@components/base/pagination/ArrowIcon'

interface IProp {
  options: any
  pauseOnSeek?: boolean
  streamRef?: any
  hideVideo?: boolean
  openQuestion?: boolean
  timeQuiz?: any
  children?: ReactNode
}

const SAPPVideo = ({
  options,
  pauseOnSeek = false,
  streamRef,
  hideVideo = false,
  openQuestion = false,
  timeQuiz,
  children,
}: IProp) => {
  const [playerFunction, setPlayerFunction] = useState<any>()
  const [valueVolume, setValueVolume] = useState<number>(1)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [playbackQuality, setPlaybackQuality] = useState<number>(0)
  const [listQualitys, setListQualitys] = useState<any>([])
  const [activeSettings, setActiveSettings] = useState<boolean>(false)
  const [activeQuality, setActiveQuality] = useState<boolean>(false)
  const [activeSpeed, setActiveSpeed] = useState<boolean>(false)

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

  useEffect(() => {
    let player: any
    const initTerminal = async () => {
      if (options?.src) {
        const dashjs = await import('dashjs')
        if (dashjs) {
          player = dashjs.MediaPlayer().create()

          const audioVideoSettings = player.getSettings().streaming.abr
          audioVideoSettings.autoSwitchBitrate.video = false

          player.initialize(
            streamRef.current,
            `${video_url}${options?.src}/manifest/video.mpd`,
            false,
          )

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
        }
      }
    }
    initTerminal()
    return () => {
      if (player) {
        player.reset()
      }
    }
  }, [options?.src])

  useEffect(() => {
    // Add eventlisteners
    if (options?.src) {
      if (streamRef.current) {
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
    let currentTime = Math.floor(streamRef?.current?.currentTime || 0)
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

  // Function to change the video quality based on the selected option
  const changeQuantily = (number: number, bit: number) => {
    updatePlayButton()
    setTimeout(() => {
      playerFunction.setQualityFor('video', number, true)
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
  const filterUniqueResolutions = (qualities: any) => {
    const resolutionMap = {}

    for (const quality of qualities) {
      const resolution = getResolution(quality?.bitrate)
      resolutionMap[resolution] = quality
    }

    return Object.values(resolutionMap)
  }

  return (
    <>
      {options?.src && (
        <div
          className={`group sapp-video-custom video-container ${
            !hideVideo ? styles.wrapper : styles.hideWrapper
          }`}
          ref={videoContainerRef}
        >
          <div className={`popup-question`}>{children}</div>
          <div
            className="playback-animation flex-center"
            ref={playbackAnimationRef}
          >
            <svg className="icon-svg playback-icons w-6 h-6">
              <path
                className="hidden play"
                d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"
              ></path>
              <path
                className="pause"
                d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"
              ></path>
            </svg>
          </div>
          <video
            {...options}
            key={options.src}
            ref={streamRef}
            controls={false}
            className={`${styles.content}`}
            onSeeking={() => {
              if (streamRef?.current && pauseOnSeek && openQuestion) {
                streamRef.current.pause()
              }
            }}
            autoPlay={false}
            disablePictureInPicture
            controlsList="nodownload"
          />
          <div
            className="video-controls absolute right-0 left-0 bottom-0 py-3 px-4 h-14 w-full flex-center hidden"
            ref={videoControlsRef}
          >
            <div className="flex-center w-full">
              <div className="left-controls flex items-center text-white">
                <button
                  className="btn-video bg-overlay-play w-8 h-8 mr-4 flex items-center justify-center before:-right-4"
                  data-title="Play"
                  ref={playButtonRef}
                  onClick={() => {
                    togglePlay()
                    animatePlayback()
                  }}
                >
                  <svg className="icon-svg playback-icons w-6 h-6">
                    <path
                      className="play"
                      d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"
                    ></path>
                    <path
                      className="hidden pause"
                      d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"
                    ></path>
                  </svg>
                </button>

                <div className="time text-xsm text-gray-7 leading-normal font-normal flex-center gap-1 mr-4">
                  <time ref={timeElapsedRef}>00:00</time>
                  <span> / </span>
                  <time ref={durationRef}>00:00</time>
                </div>
              </div>
              <div className="video-progress relative h-1.5 w-full">
                <progress
                  className="w-full h-1.5 pointer-events-none absolute top-0"
                  ref={progressBarRef}
                ></progress>
                <input
                  className="seek z-10 absolute top-0 w-full cursor-pointer m-0"
                  min="0"
                  type="range"
                  step="1"
                  ref={seekRef}
                  defaultValue="0"
                />
                <div
                  className="seek-tooltip hidden absolute top-[-50px] -ml-5 text-xsm p-1 font-semibold text-white bg-overlay-dark"
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
                          className="marker absolute top-0 w-1.5 h-1.5 bg-primary z-[5]"
                          title={e[0]?.question_topic?.name}
                        ></div>
                      )
                    })}
                </>
              </div>
              <div className="right-controls flex-center">
                <div className="volume-controls w-8 h-8 relative flex items-center">
                  <button
                    data-title="Mute"
                    className="btn-video volume-button"
                    ref={volumeButtonRef}
                    onClick={toggleMute}
                  >
                    <svg className="icon-svg volume-mute w-5.5 h-5.5 ml-3 scale-[0.8] hidden">
                      <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
                    </svg>
                    <svg className="icon-svg volume-low w-5.5 h-6 ml-3 hidden">
                      <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
                    </svg>
                    <Icon
                      type={'volume'}
                      className={'icon-svg volume-high ml-4 text-white'}
                    />
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
                <div
                  className={`settings-control ml-4 text-white icon-svg relative ${
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
                    <div className="settings-control-popup hidden absolute bottom-5 -right-8 text-center rounded text-white py-1 text-white bg-overlay-control w-44">
                      {!activeQuality && !activeSpeed && (
                        <div className="px-4 py-1">
                          <div
                            className="flex items-center justify-between"
                            onClick={() => setActiveQuality(true)}
                          >
                            <span className="block w-16 text-sm font-semibold text-left">
                              Quality:
                            </span>
                            <span className="flex items-center justify-between gap-1 text-xsm font-medium">
                              {getResolution(Number(playbackQuality))}
                              <ArrowIcon
                                className={'w-3 h-4'}
                                right={true}
                                iconType={'chervon'}
                              ></ArrowIcon>
                            </span>
                          </div>
                          <div
                            className="flex items-center justify-between"
                            onClick={() => setActiveSpeed(true)}
                          >
                            <span className="block w-16 text-sm font-semibold text-left">
                              Speed:
                            </span>
                            <span className="flex items-center justify-between gap-1 text-xsm font-medium">
                              {playbackRate === 1 ? 'Normal' : playbackRate}
                              <ArrowIcon
                                className={'w-3 h-4'}
                                right={true}
                                iconType={'chervon'}
                              ></ArrowIcon>
                            </span>
                          </div>
                        </div>
                      )}
                      {activeQuality && (
                        <>
                          <h4
                            className="text-base font-semibold px-1.5 relative"
                            onClick={() => setActiveQuality(false)}
                          >
                            <ArrowIcon
                              className={'absolute left-1 top-1 w-4 h-4'}
                              iconType={'chervon'}
                            ></ArrowIcon>
                            Quality
                          </h4>
                          <ul
                            className="quality-options text-ssm font-normal"
                            onClick={() => setActiveQuality(false)}
                          >
                            {filterUniqueResolutions(listQualitys).map(
                              (quality: any) => (
                                <li
                                  key={quality?.qualityIndex}
                                  onClick={() =>
                                    changeQuantily(
                                      parseFloat(quality?.qualityIndex),
                                      quality?.bitrate,
                                    )
                                  }
                                  className={`hover:bg-white hover:text-black text-xsm ${
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
                            className="text-base font-semibold px-1.5 relative"
                            onClick={() => setActiveSpeed(false)}
                          >
                            <ArrowIcon
                              className={'absolute left-1 top-1 w-4 h-4'}
                              iconType={'chervon'}
                            ></ArrowIcon>
                            Speed
                          </h4>
                          <ul
                            className="speed-options text-ssm font-normal"
                            onClick={() => setActiveSpeed(false)}
                          >
                            {playbackSpeeds.map((speed: any) => (
                              <li
                                key={speed.value}
                                onClick={handlePlaybackRateChange}
                                data-speed={speed.value}
                                className={`hover:bg-white hover:text-black text-xsm ${
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
                    className={'icon-svg fullscreen ml-4 text-white'}
                  />
                  <svg className="icon-svg fullscreen-exit ml-3 w-5.5 h-6 hidden">
                    <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SAPPVideo
