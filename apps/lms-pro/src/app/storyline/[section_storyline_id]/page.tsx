'use client'
import Player from '@components/storyline/Player'
import { StorylineProvider } from '@contexts/StorylineContext'
import { StorylineSidebarProvider } from '@contexts/StorylineSidebarContext'
import { LAYOUT } from '@lms/core'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import { StorylineAPI } from 'src/api/storyline'

function StoryLinePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const { section_storyline_id } = params
  const class_id = searchParams.get('class_id')
  const useGetData = (queryKey: string) => {
    const fetchData = async () => {
      const { data } = await StorylineAPI.getListStoryline({
        class_id: class_id as string,
        section_storyline_id: section_storyline_id as string,
      })
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled:
        class_id !== undefined && params.section_storyline_id !== undefined,
      retry: false,
    })
  }

  const { data: listStorylineData } = useGetData('storyline')
  return (
    <StorylineSidebarProvider>
      <StorylineProvider storylineData={listStorylineData}>
        <Player listStorylineData={listStorylineData} />
      </StorylineProvider>
    </StorylineSidebarProvider>
  )
}

export default StoryLinePage
StoryLinePage.layout = LAYOUT.FULLSCREEN_LAYOUT
