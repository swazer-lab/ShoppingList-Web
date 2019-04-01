import { morphism } from 'morphism';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { AppState } from '../types/store';

import { delete_profile_photo_api, fetch_profile_api, update_profile_api, update_profile_photo_api } from '../api';
import { profileMapper } from '../config/mapper';
import { get_photo_url } from '../config/urls';

import { hideProgress, setIsEmailConfirmed, showHttpErrorAlert, showProgress } from '../actions/service';
import {
	deleteProfilePhotoResult,
	fetchProfileResult,
	updateProfilePhotoResult,
	updateProfileResult,
} from '../actions/profile';

import language from '../assets/language';
import { ActionTypes, UpdateProfilePhotoAction } from '../types/profile';

function* fetchProfileSaga() {
	yield put(showProgress(language.textFetchingProfile));

	try {
		const response = yield call(fetch_profile_api);
		const data = yield morphism(profileMapper(), response.data);

		put(setIsEmailConfirmed(data.isConfirmed));

		yield put(fetchProfileResult(false, data));
	} catch (e) {
		yield all([
			put(fetchProfileResult(true)),
			put(showHttpErrorAlert(e)),
		]);
	} finally {
		yield put(hideProgress());
	}
}

function* updateProfileSaga() {
	const { draftProfile } = yield select((state: AppState) => state.profile);

	yield put(showProgress(language.textUpdatingProfile));

	try {
		const profile = yield morphism(profileMapper(true), draftProfile);
		yield call(update_profile_api, profile);

		yield put(updateProfileResult(false));
	} catch (e) {
		yield all([
			put(updateProfileResult(true)),
			put(showHttpErrorAlert(e)),
		]);
	} finally {
		yield put(hideProgress());
	}
}

function* updateProfilePhotoSaga(action: UpdateProfilePhotoAction) {
	const { photoData } = action;
	yield put(showProgress(language.textUpdatingProfilePhoto));

	try {
		const response = yield call(update_profile_photo_api, photoData);
		const data = get_photo_url(response.data);

		yield put(updateProfilePhotoResult(false, data));
	} catch (e) {
		yield all([
			put(updateProfilePhotoResult(true)),
			put(showHttpErrorAlert(e)),
		]);
	} finally {
		yield put(hideProgress());
	}
}

function* deleteProfilePhotoSaga() {
	yield put(showProgress(language.textDeletingProfilePhoto));

	try {
		const response = yield call(delete_profile_photo_api);

		yield put(deleteProfilePhotoResult(false));
	} catch (e) {
		yield all([
			put(deleteProfilePhotoResult(true)),
			put(showHttpErrorAlert(e)),
		]);
	} finally {
		yield put(hideProgress());
	}
}

export default [
	takeLatest(ActionTypes.fetch_profile, fetchProfileSaga),
	takeLatest(ActionTypes.update_profile, updateProfileSaga),
	takeLatest(ActionTypes.update_profile_photo, updateProfilePhotoSaga),
	takeLatest(ActionTypes.delete_profile_photo, deleteProfilePhotoSaga),
];
