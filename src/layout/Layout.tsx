import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../types/store';
import { Profile } from '../types/api';

import { NavigationBar, ProfileModal } from './';

import { navigate } from '../actions/service';
import { logout } from '../actions/auth';
import {
	changeDraftProfileName,
	changeDraftProfilePhoneNumber,
	updateProfile,
	updateProfilePhoto,
} from '../actions/profile';

import { useLocalStorage } from '../config/utilities';
import './styles.scss';

interface Props {
	dispatch: Function,
	children: any,

	layoutOptions?: any,
	progress: AppState['service']['progress'],

	name?: string,
	email?: string,
	phoneNumber?: string,
	photoUrl?: string,
	draftProfile: Profile,
}

const Layout = (props: Props) => {
	const { dispatch, children, layoutOptions, progress, name, email, phoneNumber, photoUrl, draftProfile } = props;
	const { isLoggedIn } = useLocalStorage();

	useEffect(() => {
		document.title = 'Shopping List | ' + layoutOptions.title;
	}, [layoutOptions.title]);

	if (layoutOptions.authorized && !isLoggedIn) {
		dispatch(navigate('Login'));
	}

	const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

	const onOpenProfileModalClicked = () => setIsProfileModalVisible(true);
	const onCloseProfileModalClicked = () => setIsProfileModalVisible(false);

	const onChangeDraftProfileName = (name: string) => dispatch(changeDraftProfileName(name));
	const onChangeDraftProfilePhoneNumber = (phoneNumber: string) => dispatch(changeDraftProfilePhoneNumber(phoneNumber));
	const onUpdateProfileClicked = () => dispatch(updateProfile());

	const onUpdateProfilePhotoClicked = (photoData: string) => dispatch(updateProfilePhoto(photoData));
	const onLogoutClicked = () => dispatch(logout());

	return (
		<div className='main_layout'>
			<NavigationBar
				progress={progress}
				profilePhotoUrl={photoUrl}
				onOpenProfileModalClick={onOpenProfileModalClicked}
			/>
			<ProfileModal
				isVisible={isProfileModalVisible}
				isLoading={progress.visible}
				onCloseProfileModalClick={onCloseProfileModalClicked}
				name={name}
				email={email}
				phoneNumber={phoneNumber}
				photoUrl={photoUrl}
				draftProfile={draftProfile}
				onDraftProfileNameChange={onChangeDraftProfileName}
				onDraftProfilePhoneNumberChange={onChangeDraftProfilePhoneNumber}
				onUpdateProfileClick={onUpdateProfileClicked}
				onUpdateProfilePhotoClick={onUpdateProfilePhotoClicked}
				onLogoutClick={onLogoutClicked}
			/>
			{children}
		</div>
	);
};

const mapStateToProps = (state: AppState) => {
	const { progress } = state.service;
	const { name, email, phoneNumber, photoUrl, draftProfile } = state.profile;

	return {
		progress,

		name,
		email,
		phoneNumber,
		photoUrl,
		draftProfile,
	};
};

export default connect(mapStateToProps)(Layout);
