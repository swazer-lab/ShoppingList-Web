import { Action as ReduxAction } from 'redux';

export enum ActionTypes {
	navigate = 'SERVICE_NAVIGATION__NAVIGATE',
	replace = 'SERVICE_NAVIGATION__REPLACE',
	go_back = 'SERVICE_NAVIGATION__GO_BACK',
	go_forward = 'SERVICE_NAVIGATION__GO_FORWARD',

	show_progress = 'SERVICE_PROGRESS__SHOW_PROGRESS',
	hide_progress = 'SERVICE_PROGRESS__HIDE_PROGRESS',

	show_alert = 'SERVICE_ALERT__SHOW_ALERT',
	clear_alert = 'SERVICE_ALERT__CLEAR_ALERT',

	setAccessToken = 'SERVICE_LOCALSTORAGE__SET_ACCESS_TOKEN',
	setIsLoggedIn = 'SERVICE_LOCALSTORAGE__SET_IS_LOGGED_IN',
	setActiveLanguage = 'SERVICE_LOCALSTORAGE__SET_ACTIVE_LANGUAGE',
}

export interface ServiceAction extends ReduxAction<ActionTypes> {
}

// Navigation
export interface NavigateAction extends ServiceAction {
	type: ActionTypes.navigate,
	routeName: string
}

export interface ReplaceAction extends ServiceAction {
	type: ActionTypes.replace,
	routeName: string
}

// Progress
export interface ShowProgressAction extends ServiceAction {
	type: ActionTypes.show_progress,
	message?: string,
}

// Alert
export type AlertType = 'info' | 'error' | 'warn' | 'success' | 'noConnection';

export interface ShowAlertAction extends ServiceAction {
	type: ActionTypes.show_alert,
	alertType: AlertType,
	title?: string,
	message: string,
	duration?: number,
}

// LocalStorage
export interface SetAccessTokenAction extends ServiceAction {
	type: ActionTypes.setAccessToken,
	accessToken: string,
}

export interface SetIsLoggedInAction extends ServiceAction {
	type: ActionTypes.setIsLoggedIn,
	isLoggedIn: boolean,
}

export interface SetActiveLanguageAction extends ServiceAction {
	type: ActionTypes.setActiveLanguage,
	activeLanguage: string,
}

export type Action = & ServiceAction & NavigateAction & ReplaceAction & ShowProgressAction & ShowAlertAction;

export interface State {
	progress: {
		visible: boolean,
		message: string
	},
	alert: {
		visible: boolean,
		type: AlertType,
		title?: string,
		message: string,
		duration?: number,
	}
}
