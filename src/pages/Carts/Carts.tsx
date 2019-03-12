import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../types/store';
import { Cart, CartItemStatusType } from '../../types/api';

import CreateCart from './CreateCart';
import UpdateCart from './UpdateCart';
import CartObject from './CartObject';

import {
	addDraftCartItem, changeDraftCartItemStatus, changeDraftCartItemTitle,
	changeDraftCartNotes,
	changeDraftCartTitle,
	clearDraftCart,
	fetchCarts,
	removeCart, removeDraftCartItem,
	setDraftCart,
	updateCart,
} from '../../actions/carts';
import { useLocalStorage } from '../../config/utilities';

interface Props {
	dispatch: Function,

	carts: Array<Cart>,
	draftCart: Cart,

	isLoading: boolean,
	totalCount: number,
	pageNumber: number,
}

const Carts = (props: Props) => {
	const { dispatch, carts, draftCart, isLoading, totalCount, pageNumber } = props;

	useEffect(() => {
		const { isLoggedIn } = useLocalStorage();
		if (isLoggedIn) dispatch(fetchCarts(false, 'merge', 1));
	}, []);

	useEffect(() => {
		const onScroll = () => {
			if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !isLoading && carts.length < totalCount)
				dispatch(fetchCarts(false, 'merge', pageNumber + 1));
		};

		window.addEventListener('scroll', onScroll, false);
		return () => {
			window.removeEventListener('scroll', onScroll, false);
		};
	}, []);

	const [isCartUpdating, setIsCartUpdating] = useState(false);

	const onOpenUpdateCartModalClicked = (cart: Cart) => {
		dispatch(setDraftCart(cart));
		setIsCartUpdating(true);
	};
	const onCloseUpdateCartModalClicked = () => {
		dispatch(clearDraftCart());
		setIsCartUpdating(false);
	};

	const onUpdateCartClicked = () => {
		dispatch(updateCart());
		setIsCartUpdating(false);
	};
	const onRemoveCartClicked = (cart: Cart) => {
		dispatch(removeCart(cart));
	};

	const onSetDraftCartClicked = (cart: Cart) => dispatch(setDraftCart(cart));
	const onClearDraftCartClicked = () => dispatch(clearDraftCart());

	const handleDraftCartTitleChange = (title: string) => dispatch(changeDraftCartTitle(title));
	const handleDraftCartNotesChange = (notes: string) => dispatch(changeDraftCartNotes(notes));

	const onAddDraftCartItemClicked = () => dispatch(addDraftCartItem());
	const onRemoveDraftCartItemClicked = (uuid: string) => dispatch(removeDraftCartItem(uuid));
	const handleDraftCartItemTitleChange = (uuid: string, title: string) => dispatch(changeDraftCartItemTitle(uuid, title));
	const handleDraftCartItemStatusChange = (uuid: string, status: CartItemStatusType) => dispatch(changeDraftCartItemStatus(uuid, status));

	const renderCarts = () => carts.map(cart => (
		<CartObject
			key={cart.uuid}
			cart={cart}
			onOpenUpdateCartModalClick={onOpenUpdateCartModalClicked}
			onCloseUpdateCartModalClick={onCloseUpdateCartModalClicked}
			onRemoveCartClick={onRemoveCartClicked}
		/>
	));

	return (
		<div>
			<CreateCart/>
			<UpdateCart
				draftCart={draftCart}

				onDraftCartTitleChange={handleDraftCartTitleChange}
				onDraftCartNotesChange={handleDraftCartNotesChange}

				onAddDraftCartItemClick={onAddDraftCartItemClicked}
				onRemoveDraftCartItemClick={onRemoveDraftCartItemClicked}
				onDraftCartItemTitleChange={handleDraftCartItemTitleChange}
				onDraftCartItemStatusChange={handleDraftCartItemStatusChange}

				isVisible={isCartUpdating}

				onCloseUpdateCartModalClick={onCloseUpdateCartModalClicked}
				onUpdateCartClick={onUpdateCartClicked}
			/>
			{renderCarts()}
		</div>
	);
};

const mapStateToProps = (state: AppState) => {
	const { carts, draftCart, isLoading, totalCount, pageNumber } = state.carts;

	return {
		carts,
		draftCart,

		isLoading,
		totalCount,
		pageNumber,
	};
};

export default connect(mapStateToProps)(Carts);
