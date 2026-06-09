import { useStoryline } from '@contexts/StorylineContext';
import { SAPPVideo } from '@lms/ui/video'
import { useRef } from 'react'

const VideoBlock = ({ src }: { src: string }) => {
  const streamRef = useRef<any>()
  const playedOnceRef = useRef(false);
  const {
    updateProgress,
    visibleDocumentCount,
    storylineDocument,
  } = useStoryline()

  const currentVisibleDocument = storylineDocument?.[visibleDocumentCount - 1]

  const handlePlayVideo = async () => {
    if (playedOnceRef.current) return;

    playedOnceRef.current = true;

    try {
      await streamRef.current?.play();
      await updateProgress(currentVisibleDocument?.id ?? '')
    } catch {
    }
  };

  return <SAPPVideo streamRef={streamRef} options={{ src }} handlePlayVideo={handlePlayVideo} />
}

export default VideoBlock
