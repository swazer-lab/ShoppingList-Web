import { Action, ActionTypes, State } from '../types/profile';

const initialState: State = {
	id: '',
	name: '',
	email: '',
	phoneNumber: '',

	photoUrl: '',
	avatarUrl: (require('../assets/images/avatar.jpeg')),

	draftProfile: {
		id: '',
		name: '',
		phoneNumber: '',
		email: '',

		photoUrl: '',
		avatarUrl: (require('../assets/images/avatar.jpeg')),
	},
};

export default (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case ActionTypes.change_draft_profile_name:
			return {
				...state,
				draftProfile: {
					...state.draftProfile,
					name: action.name,
				},
			};
		case ActionTypes.change_draft_profile_phone_number:
			return {
				...state,
				draftProfile: {
					...state.draftProfile,
					phoneNumber: action.phoneNumber,
				},
			};


		case ActionTypes.fetch_profile_result:
			if (action.hasError) return state;

			return {
				...state,
				...action.profile,

				draftProfile: action.profile ? action.profile : state.draftProfile,
			};

		case ActionTypes.update_profile:
			if (action.hasError) return state;
			return {
				...state.draftProfile,
				draftProfile: {
					...state.draftProfile,
				},
			};

		case ActionTypes.update_profile_photo_result:
			if (action.hasError) return state;
			return {
				...state,
				photoUrl: action.photoUrl,
			};

		case ActionTypes.delete_profile_photo_result:
			if (action.hasError) return state;
			return {
				...state,
				photoUrl: undefined,
			};

		case ActionTypes.set_avatar_url:
			return {
				...state,
				avatarUrl: action.avatarUrl,
				draftProfile: {
					...state.draftProfile,
					avatarUrl: action.avatarUrl,
				},
			};

		case ActionTypes.clear_profile:
			return initialState;

		default:
			return state;
	}
}
