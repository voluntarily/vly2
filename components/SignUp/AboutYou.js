import { UserOutlined } from '@ant-design/icons'
import { Avatar, Input } from 'antd'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import TagSelect from '../Form/Input/TagSelect'
import ImageUpload from '../Upload/ImageUpload'
import { HalfGrid } from '../VTheme/VTheme'

import { useDispatch, useSelector } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'

export const InputSpacer = styled.div`
  height: auto;
  margin-bottom: 2rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: 1rem 0 0 0;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    margin: 1rem 0 0 0;
  }
` // end inputContainer

export const AboutYou = ({ children, person, onChange }) => {
  const dispatch = useDispatch()
  const locations = useSelector(state => state.locations.data)

  useEffect(() => {
    dispatch(reduxApi.actions.locations.get())
  }, [])

  return (
    <HalfGrid>
      <div>
        <img src='/static/img/sign-up/aboutyou.svg' />
      </div>
      <div>
        <h1>
          <FormattedMessage
            id='AboutYou.title'
            defaultMessage='About You'
          />
        </h1>
        <InputSpacer>
          <label>
            <FormattedMessage
              id='AboutYou.label.nickname'
              defaultMessage='What do you want everyone to call you?'
            />
          </label>
          <Input
            id='nickname'
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder='nickname'
            value={person.nickname}
            onChange={(e) => onChange({ nickname: e.target.value })}
          />
        </InputSpacer>
        <InputSpacer>
          <Avatar shape='circle' size={64} src={person.imgUrlSm} style={{ marginRight: '2rem' }} />
          <ImageUpload setImgUrl={(imgUrl, sizeVariants) => onChange({ imgUrl: sizeVariants.lg, imgUrlSm: sizeVariants.sm })} usages='profile-photo' />
        </InputSpacer>
        <InputSpacer>
          <label>
            <FormattedMessage
              id='AboutYou.label.location'
              defaultMessage='Where are you located?'
            />
          </label>
          <TagSelect
            values={locations}
            value={person.locations}
            onChange={locations => onChange({ locations })}
            placeholder='Select one or more locations'
          />
        </InputSpacer>
        {children}
      </div>
    </HalfGrid>
  )
}

export default AboutYou
