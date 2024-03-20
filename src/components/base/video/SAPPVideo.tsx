import styles from '@styles/components/SAPPVideo.module.scss'
import { video_url } from '@utils/constants'
import { MutableRefObject, useEffect, useRef, useState } from 'react'

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
}

const SAPPVideo = ({
  options,
  pauseOnSeek = false,
  streamRef,
  hideVideo = false,
  openQuestion,
  timeLine,
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
  }, [options?.src, streamRef.current])

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
    const time = formatTime(Math.round(video.currentTime))
    if (timeElapsed) {
      timeElapsed.innerText = `${time.hours !== '00' ? time.hours + ':' : ''}${
        time.minutes
      }:${time.seconds}`
      timeElapsed.setAttribute(
        'datetime',
        `${time.hours !== '00' ? time.hours + 'h ' : ''}${time.minutes}m ${
          time.seconds
        }s`,
      )
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
    if (volumeButton) {
      volumeButton.setAttribute('data-title', 'Mute (m)')
      const volumeMute = volumeButton.querySelector('.volume-mute')
      const volumeLow = volumeButton.querySelector('.volume-low')
      const volumeHigh = volumeButton.querySelector('.volume-high')

      if (volumeMute && volumeLow && volumeHigh) {
        if (video.muted || video.volume === 0) {
          volumeMute.classList.remove('hidden')
          volumeLow.classList.add('hidden')
          volumeHigh.classList.add('hidden')
          volumeButton.setAttribute('data-title', 'Unmute (m)')
        } else if (video.volume > 0 && video.volume <= 0.5) {
          volumeMute.classList.add('hidden')
          volumeLow.classList.remove('hidden')
          volumeHigh.classList.add('hidden')
        } else {
          volumeMute.classList.add('hidden')
          volumeLow.classList.add('hidden')
          volumeHigh.classList.remove('hidden')
        }
      }
    }
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

    if (fullScreenIcon && fullScreenExitIcon) {
      if (
        document.fullscreenElement &&
        fullscreenButton &&
        fullScreenIcon &&
        fullScreenExitIcon
      ) {
        fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
        fullScreenIcon.classList.add('hidden')
        fullScreenExitIcon.classList.remove('hidden')
      } else if (fullscreenButton && fullScreenIcon && fullScreenExitIcon) {
        fullscreenButton.setAttribute('data-title', 'Full screen (f)')
        fullScreenIcon.classList.remove('hidden')
        fullScreenExitIcon.classList.add('hidden')
      }
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
                    <svg
                      className="volume-high ml-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <g fill="#fff" clipPath="url(#clip0_246_5900)">
                        <path d="M9.298.586a.532.532 0 00-.564.064L3.546 4.8h-2.48C.48 4.8 0 5.28 0 5.867v4.267c0 .588.479 1.066 1.067 1.066h2.479l5.187 4.15a.539.539 0 00.565.064.532.532 0 00.302-.48V1.067a.535.535 0 00-.302-.481zM12.3 4.229a.535.535 0 00-.75.759A4.197 4.197 0 0112.8 8a4.197 4.197 0 01-1.25 3.013.534.534 0 10.75.757A5.246 5.246 0 0013.867 8 5.254 5.254 0 0012.3 4.23z"></path>
                        <path d="M13.805 2.726a.534.534 0 00-.752.757A6.315 6.315 0 0114.933 8c0 1.711-.668 3.314-1.88 4.517a.536.536 0 00-.004.755.536.536 0 00.756.002A7.367 7.367 0 0016 8c0-1.998-.779-3.87-2.195-5.274z"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_246_5900">
                          <path fill="#fff" d="M0 0H16V16H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                  </button>

                  <div className="volume-process">
                    <input
                      ref={volumeRef}
                      className="volume w-full opacity-100"
                      value={valueVolume}
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
                  <svg
                    className="fullscreen ml-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M5.45457 16H0.363649C0.162648 16 0 15.8374 0 15.6364V10.5455C0 10.3445 0.162648 10.1818 0.363649 10.1818H1.09091C1.29191 10.1818 1.45456 10.3445 1.45456 10.5455V14.5454H5.45457C5.65557 14.5454 5.81822 14.7081 5.81822 14.9091V15.6364C5.81822 15.8374 5.65557 16 5.45457 16Z"
                      fill="white"
                    />
                    <path
                      d="M15.6364 16H10.5455C10.3445 16 10.1818 15.8374 10.1818 15.6364V14.9091C10.1818 14.7081 10.3445 14.5454 10.5455 14.5454H14.5454V10.5455C14.5454 10.3445 14.7081 10.1818 14.9091 10.1818H15.6364C15.8374 10.1818 16 10.3445 16 10.5455V15.6364C16 15.8374 15.8374 16 15.6364 16Z"
                      fill="white"
                    />
                    <path
                      d="M15.6364 5.81819H14.9091C14.7081 5.81819 14.5455 5.65554 14.5455 5.45454V1.45456H10.5455C10.3445 1.45456 10.1818 1.29191 10.1818 1.09091V0.363648C10.1818 0.162648 10.3445 0 10.5455 0H15.6364C15.8374 0 16 0.162648 16 0.363648V5.45457C16 5.65557 15.8374 5.81819 15.6364 5.81819Z"
                      fill="white"
                    />
                    <path
                      d="M5.45457 1.45455H1.45456V5.45457C1.45456 5.65557 1.29191 5.81822 1.09091 5.81822H0.363649C0.162648 5.81819 0 5.65557 0 5.45457V0.363682C0 0.162682 0.162648 3.37299e-05 0.363649 3.37299e-05H5.45457C5.65557 3.37299e-05 5.81822 0.162682 5.81822 0.363682V1.09094C5.81822 1.29191 5.65557 1.45455 5.45457 1.45455Z"
                      fill="white"
                    />
                  </svg>
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
