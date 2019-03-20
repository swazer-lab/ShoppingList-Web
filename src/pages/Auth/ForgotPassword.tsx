import React, { FormEvent } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../types/store';
import { AuthContainer, Button, Input } from '../../components';

import {
	changeEmail,
	changePassword,
	changeResetPasswordCode,
	resetPassword,
	sendForgotPasswordEmail,
} from '../../actions/auth';

import { useDocumentTitle } from '../../config/utilities';
import language from '../../assets/language';

import './styles.scss';

interface Props {
	dispatch: Function,

	email: string,
	password: string,
	resetPasswordCode: string,
	isResettingPassword: boolean,

	isLoading: boolean,
	errorMessage?: string,
}

const ForgotPassword = (props: Props) => {
	const { dispatch, email, password, resetPasswordCode, isResettingPassword, isLoading, errorMessage } = props;

	useDocumentTitle(language.titleForgotPassword);

	const handleEmailChange = (e: FormEvent<HTMLInputElement>) => dispatch(changeEmail(e.currentTarget.value));
	const handleResetPasswordCodeChange = (e: FormEvent<HTMLInputElement>) => dispatch(changeResetPasswordCode(e.currentTarget.value));
	const handlePasswordChange = (e: FormEvent<HTMLInputElement>) => dispatch(changePassword(e.currentTarget.value));

	const onSendForgotPasswordEmailClicked = (e: FormEvent<HTMLFormElement>) => {
		dispatch(sendForgotPasswordEmail());
		e.preventDefault();
	};
	const onResetPasswordClicked = (e: FormEvent<HTMLFormElement>) => {
		dispatch(resetPassword());
		e.preventDefault();
	};

	const message = errorMessage ? errorMessage : isResettingPassword ? language.textForgotPasswordSubTitleStep2 : language.textForgotPasswordSubTitleStep1;
	const renderForm = () => {
		if (!isResettingPassword) {
			return (
				<form onSubmit={onSendForgotPasswordEmailClicked}>
					<Input
						className='page_auth__input'
						value={email}
						onChange={handleEmailChange}
						type='email'
						placeholder={language.textEnterEmail}
						required
					/>

					<Button
						type='submit'
						className='page_auth__action_auth_button'
						title={language.actionSendResetPasswordEmail}
					/>
				</form>
			);
		} else {
			return (
				<form onSubmit={onResetPasswordClicked}>
					<Input
						className='page_auth__input'
						value={resetPasswordCode}
						onChange={handleResetPasswordCodeChange}
						type='text'
						placeholder={language.textEnterResetPasswordCode}
						required
					/>
					<Input
						className='page_auth__input'
						value={password}
						onChange={handlePasswordChange}
						type='password'
						placeholder={language.textEnterNewPassword}
						pattern='.{6,}'
						required
					/>

					<Button
						type='submit'
						className='page_auth__action_auth_button'
						title={language.actionResetPassword}
					/>
				</form>
			);
		}
	};

	return (
		<AuthContainer className='page_auth' isLoading={isLoading}>
			<div className='page_auth__content_container'>
				<h1 className='page_auth__title'>{language.titleForgotPassword}</h1>
				<p className='page_auth__subtitle'>{message}</p>
				{renderForm()}
			</div>
		</AuthContainer>
	);
};

const mapStateToProps = (state: AppState) => {
	const { email, password, resetPasswordCode, isResettingPassword, isLoading, errorMessage } = state.auth;

	return {
		email,
		password,
		resetPasswordCode,
		isResettingPassword,
		isLoading,
		errorMessage,
	};
};

export default connect(mapStateToProps)(ForgotPassword);
