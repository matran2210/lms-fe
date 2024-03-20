import styles from '@styles/components/SAPPVideo.module.scss'
import { video_url } from '@utils/constants'
import { useEffect, useRef, useState, ReactNode } from 'react'
import Icon from '@components/icons'

interface TimeLineItem {
  time: number
  text: string
}

interface IProp {
  options: any
  pauseOnSeek?: boolean
  streamRef?: any
  hideVideo?: boolean
  openQuestion?: boolean
  timeLine?: TimeLineItem[]
  openFinishQuiz?: boolean
  children?: ReactNode
}

const SAPPVideo = ({
  options,
  pauseOnSeek = false,
  streamRef,
  hideVideo = false,
  openQuestion = false,
  timeLine,
  openFinishQuiz = false,
  children,
}: IProp) => {
  const [valueVolume, setValueVolume] = useState<number>(1)
  const playbackAnimationRef = useRef<HTMLDivElement>(null)
  const videoControlsRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLButtonElement>(null)
  const seekRef = useRef<HTMLInputElement>(null)
  const seekTooltipRef = useRef<HTMLDivElement>(null)
  const volumeButtonRef = useRef<any>(null)
  const volumeRef = useRef<any>(null)
  const fullscreenButtonRef = useRef<HTMLButtonElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLProgressElement>(null)
  const timeElapsedRef = useRef<HTMLTimeElement>(null)
  const durationRef = useRef<HTMLTimeElement>(null)
  const playbackIconsRef = useRef<NodeListOf<SVGElement>>(null)

  const video = streamRef.current
  const playbackAnimation = playbackAnimationRef.current
  const videoControls = videoControlsRef.current
  const playButton = playButtonRef.current
  const seek = seekRef.current
  const seekTooltip = seekTooltipRef.current
  const volumeButton = volumeButtonRef.current
  const volume = volumeRef.current
  const fullscreenButton = fullscreenButtonRef.current
  const videoContainer = videoContainerRef.current
  const progressBar = progressBarRef.current
  const timeElapsed = timeElapsedRef.current
  const duration = durationRef.current
  const playbackIcons = playbackIconsRef.current

  useEffect(() => {
    let player: any
    const initTerminal = async () => {
      const dashjs = await import('dashjs')
      if (options?.src && dashjs) {
        player = dashjs.MediaPlayer().create()
        player.initialize(
          streamRef.current,
          `${video_url}${options?.src}/manifest/video.mpd`,
          false,
        )

        // Add eventlisteners
        if (video) {
          video.addEventListener('play', updatePlayButton)
          video.addEventListener('pause', updatePlayButton)
          video.addEventListener('loadedmetadata', initializeVideo)
          video.addEventListener('timeupdate', updateTimeElapsed)
          video.addEventListener('timeupdate', updateProgress)
          video.addEventListener('volumechange', updateVolumeIcon)
          video.addEventListener('click', togglePlay)
          video.addEventListener('click', animatePlayback)
          video.addEventListener('mouseenter', showControls)
          video.addEventListener('mouseleave', hideControls)
        }
        if (videoControls) {
          videoControls.addEventListener('mouseenter', showControls)
          videoControls.addEventListener('mouseleave', hideControls)
        }
        if (seek) {
          seek.addEventListener('mousemove', updateSeekTooltip)
          seek.addEventListener('input', skipAhead)
        }
        if (volume) {
          volume.addEventListener('input', updateVolume)
        }
        if (videoContainer) {
          videoContainer.addEventListener(
            'fullscreenchange',
            updateFullscreenButton,
          )
        }
        document.addEventListener('keyup', keyboardShortcuts)
        const videoWorks = !!video?.canPlayType
        if (videoWorks && videoControls) {
          video.controls = false
          videoControls.classList.remove('hidden')
        }
      }
    }
    initTerminal()

    return () => {
      if (player) {
        player.reset()
        if (video) {
          video.removeEventListener('play', updatePlayButton)
          video.removeEventListener('pause', updatePlayButton)
          video.removeEventListener('loadedmetadata', initializeVideo)
          video.removeEventListener('timeupdate', updateTimeElapsed)
          video.removeEventListener('timeupdate', updateProgress)
          video.removeEventListener('volumechange', updateVolumeIcon)
          video.removeEventListener('click', togglePlay)
          video.removeEventListener('click', animatePlayback)
          video.removeEventListener('mouseenter', showControls)
          video.removeEventListener('mouseleave', hideControls)
        }
        if (videoControls) {
          videoControls.removeEventListener('mouseenter', showControls)
          videoControls.removeEventListener('mouseleave', hideControls)
        }
        if (seek) {
          seek.removeEventListener('mousemove', updateSeekTooltip)
          seek.removeEventListener('input', skipAhead)
        }
        if (volume) {
          volume.removeEventListener('input', updateVolume)
        }
        if (videoContainer) {
          videoContainer.removeEventListener(
            'fullscreenchange',
            updateFullscreenButton,
          )
        }
      }
    }
  }, [options?.src, streamRef.current, playbackAnimationRef.current])

  // Listen for changes in the 'openFinishQuiz' state.
  useEffect(() => {
    if (openFinishQuiz) {
      if (document?.fullscreenElement) {
        document.exitFullscreen()
      } else if (
        document?.fullscreenElement === undefined &&
        document?.fullscreenElement
      ) {
        document.exitFullscreen()
      }
    }
  }, [openFinishQuiz])

  // togglePlay toggles the playback state of the video.
  // If the video playback is paused or ended, the video is played
  // otherwise, the video is paused
  function togglePlay() {
    if (video?.paused || video?.ended) {
      video?.play()
    } else {
      video?.pause()
    }
  }

  // updatePlayButton updates the playback icon and tooltip
  // depending on the playback state
  function updatePlayButton() {
    const playIcon = playButton?.querySelector('.play')
    const pauseIcon = playButton?.querySelector('.pause')

    if (video?.paused) {
      playButton?.setAttribute('data-title', 'Play (k)')
      playIcon?.classList?.remove('hidden')
      pauseIcon?.classList?.add('hidden')
    } else {
      playButton?.setAttribute('data-title', 'Pause (k)')
      playIcon?.classList?.add('hidden')
      pauseIcon?.classList?.remove('hidden')
    }
  }

  // formatTime takes a time length in seconds and returns the time in
  // minutes and seconds
  function formatTime(timeInSeconds: number) {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds % 60)

    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')

    return {
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds,
    }
  }

  // initializeVideo sets the video duration, and maximum value of the
  // progressBar
  function initializeVideo() {
    const videoDuration = Math.round(video.duration)
    seek?.setAttribute('max', String(videoDuration))
    progressBar?.setAttribute('max', String(videoDuration))
    const time = formatTime(videoDuration)
    if (duration) {
      duration.innerText = `${time.hours !== '00' ? time.hours + ':' : ''}${
        time.minutes
      }:${time.seconds}`
      duration.setAttribute(
        'datetime',
        `${time.hours !== '00' ? time.hours + 'h ' : ''}${time.minutes}m ${
          time.seconds
        }s`,
      )
    }
    const markers = videoControls?.querySelectorAll('.marker')

    // Lặp qua từng điểm đánh dấu trong mảng
    if (timeLine && markers) {
      timeLine.forEach((marker: TimeLineItem, index: number) => {
        const percentage = (Number(marker?.time) / videoDuration) * 100
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
    if (video && video.readyState) {
      const time = formatTime(Math.round(video?.currentTime || 0))
      if (timeElapsed) {
        timeElapsed.innerText = `${
          time.hours !== '00' ? time.hours + ':' : ''
        }${time.minutes}:${time.seconds}`
        timeElapsed.setAttribute(
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
    let currentTime = Math.floor(video.currentTime)
    if (seek) {
      seek.value = String(currentTime)
    }
    if (progressBar) {
      progressBar.value = currentTime
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
    const t = formatTime(skipTo)
    if (progressBar && seek && seekTooltip) {
      const rect = progressBar.getBoundingClientRect()
      seek.setAttribute('data-seek', String(skipTo))
      seekTooltip.textContent = `${t.hours !== '00' ? t.hours + ':' : ''}${
        t.minutes
      }:${t.seconds}`
      seekTooltip.style.left = `${event.pageX - rect.left}px`
    }
  }

  // skipAhead jumps to a different point in the video when the progress bar
  // is clicked
  function skipAhead(event: Event) {
    const skipTo =
      event.target instanceof HTMLInputElement ? event.target.value : '0'
    video.currentTime = parseInt(skipTo, 10)
    if (progressBar) {
      progressBar.value = Number(skipTo)
    }
    if (seek) {
      seek.value = skipTo
    }
  }

  // updateVolume updates the video's volume
  // and disables the muted state if active
  function updateVolume() {
    if (video.muted) {
      video.muted = false
    }
    if (volume) {
      video.volume = Number(volume.value)
      setValueVolume(Number(volume.value))
    }
  }

  // updateVolumeIcon updates the volume icon so that it correctly reflects
  // the volume of the video
  function updateVolumeIcon() {
    if (!volumeButton) return

    const volumeMute = volumeButton.querySelector('.volume-mute')
    const volumeLow = volumeButton.querySelector('.volume-low')
    const volumeHigh = volumeButton.querySelector('.volume-high')

    if (!volumeMute || !volumeLow || !volumeHigh) return

    const isMuted = video.muted || video.volume === 0
    const isLowVolume = video.volume > 0 && video.volume <= 0.5

    volumeButton.setAttribute('data-title', isMuted ? 'Unmute (m)' : 'Mute (m)')
    volumeMute.classList.toggle('hidden', !isMuted)
    volumeLow.classList.toggle('hidden', isMuted || !isLowVolume)
    volumeHigh.classList.toggle('hidden', isMuted || isLowVolume)
  }

  // toggleMute mutes or unmutes the video when executed
  // When the video is unmuted, the volume is returned to the value
  // it was set to before the video was muted
  function toggleMute() {
    video.muted = !video.muted

    if (video.muted && volume) {
      volume.setAttribute('data-volume', volume.value)
      volume.value = 0
      setValueVolume(0)
    } else if (volume) {
      volume.value = volume.dataset.volume
      setValueVolume(volume.dataset.volume)
    }
  }

  // animatePlayback displays an animation when
  // the video is played or paused
  function animatePlayback() {
    const playIcon = playbackAnimation?.querySelector('.play')
    const pauseIcon = playbackAnimation?.querySelector('.pause')

    if (playIcon && pauseIcon) {
      playIcon.classList.toggle('hidden')
      pauseIcon.classList.toggle('hidden')
    }

    if (playbackAnimation) {
      playbackAnimation.animate(
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
      document?.fullscreenElement === undefined &&
      document?.fullscreenElement
    ) {
      document.exitFullscreen()
    } else if (
      videoContainer instanceof HTMLVideoElement &&
      videoContainer.requestFullscreen
    ) {
      videoContainer.requestFullscreen()
    } else if (videoContainer?.requestFullscreen) {
      videoContainer.requestFullscreen()
    }
  }

  // updateFullscreenButton changes the icon of the full screen button
  // and tooltip to reflect the current full screen state of the video
  function updateFullscreenButton() {
    const fullScreenIcon = fullscreenButton?.querySelector('.fullscreen')
    const fullScreenExitIcon =
      fullscreenButton?.querySelector('.fullscreen-exit')

    if (fullscreenButton && fullScreenIcon && fullScreenExitIcon) {
      const isFullScreen = document.fullscreenElement !== null
      fullscreenButton.setAttribute(
        'data-title',
        `${isFullScreen ? 'Exit' : 'Enter'} full screen (f)`,
      )
      fullScreenIcon.classList.toggle('hidden', isFullScreen)
      fullScreenExitIcon.classList.toggle('hidden', !isFullScreen)
    }
  }

  // hideControls hides the video controls when not in use
  // if the video is paused, the controls must remain visible
  function hideControls() {
    if (video.paused) {
      return
    }
    if (videoControlsRef.current) {
      videoControlsRef.current.classList.add('hide')
    }
  }

  // showControls displays the video controls
  function showControls() {
    if (videoControlsRef.current) {
      videoControlsRef.current.classList.remove('hide')
    }
  }

  // keyboardShortcuts executes the relevant functions for
  // each supported shortcut key
  function keyboardShortcuts(event: KeyboardEvent) {
    const { key } = event
    switch (key) {
      case 'k':
        togglePlay()
        animatePlayback()
        if (video.paused) {
          showControls()
        } else {
          setTimeout(() => {
            hideControls()
          }, 2000)
        }
        break
      case 'm':
        toggleMute()
        break
      case 'f':
        toggleFullScreen()
        break
    }
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
          <div className={`test`}>{children}</div>
          <div
            className="playback-animation flex-center"
            ref={playbackAnimationRef}
          >
            <svg className="playback-icons w-6 h-6">
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
                  className="bg-overlay-play w-8 h-8 mr-4 flex items-center justify-center before:-right-4"
                  data-title="Play (k)"
                  ref={playButtonRef}
                  onClick={() => {
                    togglePlay()
                    animatePlayback()
                  }}
                >
                  <svg className="playback-icons w-6 h-6">
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
                />
                <div
                  className="seek-tooltip hidden absolute top-[-50px] -ml-5 text-xsm p-1 font-semibold text-white bg-overlay-dark"
                  ref={seekTooltipRef}
                >
                  00:00
                </div>
                <>
                  {timeLine &&
                    timeLine.map((e: TimeLineItem, i: number) => {
                      return (
                        <div
                          key={i}
                          className="marker absolute top-0 w-1.5 h-1.5 bg-primary"
                          title={e?.text}
                        ></div>
                      )
                    })}
                </>
              </div>
              <div className="right-controls flex-center">
                <div className="volume-controls w-8 h-8 relative flex items-center">
                  <button
                    data-title="Mute (m)"
                    className="volume-button"
                    ref={volumeButtonRef}
                    onClick={toggleMute}
                  >
                    <svg className="volume-mute w-5.5 h-5.5 ml-3 scale-[0.8] hidden">
                      <path d="M12 3.984v4.219l-2.109-2.109zM4.266 3l16.734 16.734-1.266 1.266-2.063-2.063q-1.547 1.313-3.656 1.828v-2.063q1.172-0.328 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016h-3.984v-6h4.734l-4.734-4.734zM18.984 12q0-2.391-1.383-4.219t-3.586-2.484v-2.063q3.047 0.656 5.016 3.117t1.969 5.648q0 2.203-1.031 4.172l-1.5-1.547q0.516-1.266 0.516-2.625zM16.5 12q0 0.422-0.047 0.609l-2.438-2.438v-2.203q1.031 0.516 1.758 1.688t0.727 2.344z"></path>
                    </svg>
                    <svg className="volume-low w-5.5 h-6 ml-3 hidden">
                      <path d="M5.016 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6zM18.516 12q0 2.766-2.531 4.031v-8.063q1.031 0.516 1.781 1.711t0.75 2.32z"></path>
                    </svg>
                    <Icon
                      type={'volume'}
                      className={'volume-high ml-4 text-white'}
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
                <button
                  ref={fullscreenButtonRef}
                  data-title="Full screen (f)"
                  className="fullscreen-button"
                  onClick={toggleFullScreen}
                >
                  <Icon
                    type={'fullscreen'}
                    className={'fullscreen ml-4 text-white'}
                  />
                  <svg className="fullscreen-exit ml-3 w-5.5 h-6 hidden">
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
