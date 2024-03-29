
import { FormattedMessage } from 'react-intl'
import { HalfGrid } from '../VTheme/VTheme'
import { ToggleUl, ToggleLi } from './SignUpStyles'
import Image from 'next/image'

export const ChooseParticipationButtons = ({ roleAsk, onChangeAsk, roleOffer, onChangeOffer }) =>
  <>

    <ToggleUl id='role_options'>
      <ToggleLi key='role_ask' icon='ask' checked={roleAsk} onChange={onChangeAsk}>
        <div>
          <h2>
            <FormattedMessage
              id='ChooseParticipation.title.ask'
              defaultMessage='Ask for help from volunteers'
            />
          </h2>
          <p>
            <FormattedMessage
              id='ChooseParticipation.bodyAsk'
              defaultMessage='Need volunteers to help you out with an Activity. See what is available and ask for help.'
            />
          </p>
        </div>

      </ToggleLi>
      <ToggleLi key='role_offer' icon='offer' checked={roleOffer} onChange={onChangeOffer}>
        <div>
          <h2>
            <FormattedMessage
              id='ChooseParticipation.title.offer'
              defaultMessage='Offer to help people'
            />
          </h2>
          <p>
            <FormattedMessage
              id='ChooseParticipation.bodyOffer'
              defaultMessage='Want to volunteer your time, or resources to help out someone in need? See what is needed and offer your skills.'
            />
          </p>
        </div>
      </ToggleLi>
    </ToggleUl>
  </>

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const ChooseParticipation = (props) =>
  <HalfGrid style={{ paddingTop: 0 }}>
    <div id='leftCol'>
      <Image width='64' height='64' alt='participation icon' style={{ width: '100%' }} src='/static/img/sign-up/chooseparticipation.svg' />
    </div>
    <div id='rightCol'>
      <ChooseParticipationButtons {...props} />
      {props.children}
    </div>
  </HalfGrid>

export default ChooseParticipation
