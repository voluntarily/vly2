import { Icon, message } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { PersonalGoalStatus } from '../../server/api/personalGoal/personalGoal.constants'
import reduxApi, { withPersonalGoals } from '../../lib/redux/reduxApi'

const CardContainer = styled.a`
  width: 18.5rem;
  height: 23rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 24px 0 rgba(118, 118, 118, 0.5);
  background-color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  overflow: hidden;
  :hover {
    box-shadow: 8px 8px 32px 0 rgba(118, 118, 118, 0.8);
    transform: scale(1.02);
  }
  @media screen and (max-width: 768px) {
          width: calc(100vw - 2rem);
          margin-bottom: 1rem;
          height: auto;
  }
  position: relative;
` // end card container

const CardImage = styled.img`
  width: 100%;
` // end GoalCardImage

const CardTitle = styled.h1`
margin: 2rem 1rem 0.5rem 1rem;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.38px;
  line-height: 24px;
    @media screen and (max-width: 768px) {
      margin: 0rem 1rem 0.5rem 1rem;
  }
` // end GoalCardTitle

const CardSubtitle = styled.p`
  font-size: 16px;
  color: #000000;
  letter-spacing: -0.3px;
  margin: 0 1rem 1rem 1rem;
` // GoalCardSubtitle

// const CardDescription = styled.p`
//   font-size: 16px;
//   color: #000000;
//   letter-spacing: -0.3px;
//   margin: 0 1rem 1rem 1rem;
// ` // CardDescription

const StyledIconRight = styled(Icon)`
  font-size: 1rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;    
`
const StyledIconLeft = styled(Icon)`
  font-size: 3rem;
  position: absolute;
  top: 0.5rem; 
  left: 0.5rem;    
`

export const GoalStatusIcon = ({ status }) => {
  switch (status) {
    case PersonalGoalStatus.ACTIVE: return <StyledIconLeft type='paper-clip' />
    case PersonalGoalStatus.COMPLETED: return <StyledIconLeft type='trophy' />
    default: return ''
  }
}

const GoalCard = ({ goal, dispatch }) => {
  // if pg is set then show the personalGoal adornments, otherwise show the
  // plain goal.
  const pg = goal.personalGoal

  const handleClose = async e => {
    e.stopPropagation()
    pg.status = PersonalGoalStatus.HIDDEN
    // update personalGoal on server
    await dispatch(
      reduxApi.actions.personalGoals.put(
        { id: pg._id },
        { body: JSON.stringify(pg) }
      )
    )
    message.success('Goal hidden for 7 days')
  }

  const handleClickCard = e => {
    // console.log('handleClickCard:', goal)
  }
  // only show queued and active goals
  if (pg && ![PersonalGoalStatus.QUEUED, PersonalGoalStatus.ACTIVE].includes(pg.status)) { return '' }
  return (
    <CardContainer onClick={handleClickCard}>
      <CardImage src={goal.imgUrl} />
      <CardTitle>{goal.name}</CardTitle>
      {pg &&
        <>
          <GoalStatusIcon status={goal.status} />
          <StyledIconRight type='close-circle' onClick={handleClose} />
        </>}
      <CardSubtitle>{goal.subtitle}</CardSubtitle>
    </CardContainer>
  )
}

GoalCard.propTypes = {
  goal: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    description: PropTypes.string,
    startLink: PropTypes.string,
    category: PropTypes.string
  })
}

export const GoalCardTest = GoalCard
export default withPersonalGoals(GoalCard)
