import React from 'react'
import { OpSectionGrid, ContentCard } from '../VTheme/VTheme'
import AddStory from '../../components/Story/AddStory'
import { StoryStackWithNew } from '../../components/Story/StoryStack'
import { stories } from '../../components/Story/EditableStory'

// start question

export const OpUpdatePanel = ({ op }) =>
  <>
    <OpSectionGrid>
      <div>
        <h2>Updates</h2>
        <>
          <AddStory />

        </>

      </div>

      <ContentCard>
        <h3>Story List</h3>

        <p>
          <StoryStackWithNew stories={stories} />
        </p><br />

      </ContentCard>

    </OpSectionGrid>
  </>

export default OpUpdatePanel