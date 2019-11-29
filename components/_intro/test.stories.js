import { storiesOf } from '@storybook/react'
import ComingSoon from '../VTheme/ComingSoon'
import { FormGrid } from '../VTheme/FormStyles'
import styled from 'styled-components'
import { Divider } from 'antd'

const TestContainer = styled.div`
  height: 80vh;
`
const TestItem = styled.div`
  height: 10rem;
`

const ExamplePurple = styled.div`
  height: 10rem;
  background-color: purple;
`

storiesOf('Test Components', module)
  .add('Test Coming soon', () => (
    <div>
      <TestContainer>
        <ComingSoon>
          VP-123 - Free Ice Cream for participating volunteers
          <br /> anyone got any FE skills?
        </ComingSoon>
      </TestContainer>
      <Divider />
      <p>example of a filled container</p>
      <Divider />
      <FormGrid>
        <ExamplePurple />
        <div>
          <TestItem>
            {' '}
            <ComingSoon>
              VP-9000 - Police vetting for dogs
            </ComingSoon>
          </TestItem>
        </div>
      </FormGrid>

      <Divider />
      <p>example of use in a form</p>
      <Divider />
    </div>
  ))
