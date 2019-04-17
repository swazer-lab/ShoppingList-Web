import React from 'react';
import { State as ServiceState } from '../../../types/service';

import { SearchBar } from '../';
import classNames from 'classnames';

import './styles.scss';

interface Props {
	progress: ServiceState['progress'],

	profilePhotoUrl?: string,
	profileAvatarUrl?: string,

	searchQuery?: string,

	onOpenProfileModalClick: () => void,
	onSearchQueryChange: (searchQuery: string) => void
	onFilterClick: () => void
}

const NavigationBar = (props: Props) => {
	const { progress, profilePhotoUrl, profileAvatarUrl, searchQuery, onOpenProfileModalClick, onSearchQueryChange, onFilterClick } = props;

	const progressClassNames = classNames('navigation_bar__progress', { navigation_bar__progress_show: progress.visible });

	const renderProgress = () => progress.visible && (
		<>
			<div className='navigation_bar__progress__spinner' />
			<span className='navigation_bar__progress__message'>{progress.message}</span>
		</>
	);

	return (
		<div className='navigation_bar'>
			<div className={progressClassNames}>
				{renderProgress()}
			</div>
			<SearchBar onSearchQueryChange={onSearchQueryChange} onFilterClick={onFilterClick}
			           searchQuery={searchQuery} />
			<div className='navigation_bar__auth' onClick={onOpenProfileModalClick}>
				<img
					className='navigation_bar__auth__photo'
					src={profilePhotoUrl ? profilePhotoUrl : profileAvatarUrl}
				/>
			</div>
		</div>
	);
};

export default NavigationBar;
