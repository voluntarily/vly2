import * as ACTIONS from '../actions';

const sessionInitialState = {
	isAuthenticated: false,
	user: {},
	idToken: '',
	accessToken: '',
	person: {}
}

export const SessionReducer = (state = sessionInitialState, action) => {
	switch (action.type) {
		case ACTIONS.SET_SESSION:
			return {
				...state,
				isAuthenticated: action.isAuthenticated,
				user: action.user,
				idToken: action.idToken,
				accessToken: action.accessToken,
				person: action.person
			}
		default:
			return state
	}
}