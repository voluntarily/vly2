/* Display a grid of goal cards from an personal goals
 */
import { GoalGroup } from '../../server/api/goal/goalGroup'

export const goalGroupHeading = goalGroup => {
  switch (goalGroup) {
    case GoalGroup.VP_NEW: return {
      title: {
        id: 'GoalSection.VP_NEW.title', defaultMessage: 'Getting Started as a Volunteer'
      },
      subtitle: {
        id: 'GoalSection.VP_NEW.subtitle', defaultMessage: 'Here are a few things we recommend doing:'
      }
    }
    case GoalGroup.OP_NEW: return {
      title: {
        id: 'GoalSection.OP_NEW.title', defaultMessage: 'Getting Started as a Teacher'
      },
      subtitle: {
        id: 'GoalSection.OP_NEW.subtitle', defaultMessage: 'Get up and running with your first activites:'
      }
    }
    case GoalGroup.AP_NEW: return {
      title: {
        id: 'GoalSection.AP_NEW.title', defaultMessage: 'Getting Started as an Activity Provider'
      },
      subtitle: {
        id: 'GoalSection.AP_NEW.subtitle', defaultMessage: 'Setup your organisation and first activities:'
      }
    }
    case GoalGroup.ORG_OP_NEW: return {
      title: {
        id: 'GoalSection.ORG_OP_NEW.title', defaultMessage: 'First steps for a new school'
      },
      subtitle: {
        id: 'GoalSection.ORG_OP_NEW.subtitle', defaultMessage: 'Setup your organisation and first activity:'
      }
    }
    case GoalGroup.ORG_VP_NEW: return {
      title: {
        id: 'GoalSection.ORG_OP_NEW.title', defaultMessage: 'First steps for a new business'
      },
      subtitle: {
        id: 'GoalSection.ORG_OP_NEW.subtitle', defaultMessage: 'Setup your organisation and bring in your volunteers'
      }
    }
    case GoalGroup.ORG_AP_NEW: return {
      title: {
        id: 'GoalSection.ORG_OP_NEW.title', defaultMessage: 'First steps for a new Activity Provider organisation'
      },
      subtitle: {
        id: 'GoalSection.ORG_OP_NEW.subtitle', defaultMessage: 'Setup your organisation and design your activities'
      }
    }
    case GoalGroup.OP_REGISTER: return {
      title: {
        id: 'GoalSection.OP_REGISTER.title', defaultMessage: 'Register as a Teacher'
      },
      subtitle: {
        id: 'GoalSection.OP_REGISTER.subtitle', defaultMessage: 'If you are not associated with a school you can still register to create events'
      }
    }
    case GoalGroup.VP_MORE: return {
      title: {
        id: 'GoalSection.VP_MORE.title', defaultMessage: 'More ways to help out'
      },
      subtitle: {
        id: 'GoalSection.VP_MORE.subtitle', defaultMessage: 'Do you have special skills you can volunteer?'
      }
    }
    case GoalGroup.OP_MORE: return {
      title: {
        id: 'GoalSection.VP_MORE.title', defaultMessage: 'Next steps for teachers'
      },
      subtitle: {
        id: 'GoalSection.VP_MORE.subtitle', defaultMessage: 'Finding and running new Activities'
      }
    }
    case GoalGroup.AP_MORE: return {
      title: {
        id: 'GoalSection.VP_MORE.title', defaultMessage: 'Next steps for Activity Providers'
      },
      subtitle: {
        id: 'GoalSection.VP_MORE.subtitle', defaultMessage: 'Creating and running new Activities'
      }
    }
    default: return {
      title: { id: goalGroup },
      subtitle: { id: 'GoalSection.Default.subtitle', defaultMessage: 'Next steps' }
    }
  }
}
