import { State as ServiceState } from './service';
import { State as AuthState } from './auth';
import { State as CartsState } from './carts';

import { Action, AnyAction, Dispatch } from 'redux';

export interface AppState {
	service: ServiceState,
	auth: AuthState;
	carts: CartsState,
}

export interface Location {
	hash: string,
	pathname: string,
	search: string,
	state: any,
}

export interface ConnectedReduxProps<A extends Action = AnyAction> {
	dispatch: Dispatch<A>
}
