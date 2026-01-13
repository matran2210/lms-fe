"use client"
import { Stream } from '@cloudflare/stream-react'
import { useRef } from 'react'

export const Player = () => {
  const videoIdOrSignedUrl = 'YOUR_VIDEO_ID_OR_SIGNED_URL'
  const streamRef = useRef<any>()

  // Tạo một hàm để thêm nút custom vào controls
  const addButtonToControls = () => {
    // Lấy đối tượng stream player từ streamRef
    const stream = streamRef.current
    if (stream) {
      // Lấy đối tượng controlBar từ stream
      const controlBar = stream.controlBar
      // Tạo một nút con cho controlBar
      const myButton = controlBar.addChild('button')
      // Đặt văn bản cho nút
      myButton.controlText('Download')
      // Thêm class cho nút
      myButton.addClass('vjs-download-button')
      // Đặt sự kiện click cho nút
      myButton.on('click', () => {
        // Lấy url của video
        const videoUrl = stream.currentSrc()
        // Mở url trong tab mới
        window.open(videoUrl, '_blank')
      })
    }
  }

  return (
    <div>
      <Stream src={videoIdOrSignedUrl} streamRef={streamRef} />
      <button onClick={addButtonToControls}>Add button to controls</button>
    </div>
  )
}
