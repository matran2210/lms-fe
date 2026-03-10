import { useStoryline } from '@contexts/StorylineContext';
import { SAPPVideo } from '@lms/ui'
import { useRef } from 'react'

const VideoBlock = ({ src, docIndex }: { src: string, docIndex: number }) => {
  const streamRef = useRef<any>()
  const playedOnceRef = useRef(false);
  const {
    updateProgress,
    visibleDocumentCount,
    storylineDocument,
  } = useStoryline()

  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount - 1]

  const handlePlayVideo = async () => {
    if (playedOnceRef.current) return; // đã chạy rồi thì bỏ qua

    playedOnceRef.current = true;

    try {
      await streamRef.current?.play();
      if (visibleDocumentCount - 1 < docIndex) {
        await updateProgress(currentVisibleDocument?.id ?? '')
      }
    } catch {
    }
  };

  return <SAPPVideo streamRef={streamRef} options={{ src }} handlePlayVideo={handlePlayVideo}></SAPPVideo>
}

export default VideoBlock
