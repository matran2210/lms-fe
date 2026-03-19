'use client'
import Player from '@components/storyline/Player'
import { UserType } from '@lms/contexts'
import withAuthorization from 'src/HOC/withAuthorization'

function StoryLinePage() {
  return <Player />
}

export default withAuthorization([UserType.STUDENT])(StoryLinePage)
