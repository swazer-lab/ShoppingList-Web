import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { AppState } from '../../types/store';
import { Cart, CartItemStatusType } from '../../types/api';

import CreateCart from './CreateCart';
import UpdateCart from './UpdateCart';
import CartObject from './CartObject';

import { hideSnackbar, showSnackbar } from '../../actions/service';
import {
	addDraftCartItem,
	changeDraftCartItemStatus,
	changeDraftCartItemTitle,
	changeDraftCartNotes,
	changeDraftCartTitle,
	clearDraftCart,
	createCart,
	fetchCarts,
	pullCart,
	pushCart,
	removeCart,
	removeDraftCartItem,
	reorderCart,
	setDraftCart,
	updateCart,
} from '../../actions/carts';

import { useLocalStorage } from '../../config/localstorage';

import language from '../../assets/language';

interface Props {
	dispatch: Function,
	progress: AppState['service']['progress'],
	snackbar: AppState['service']['snackbar'],

	carts: Array<Cart>,
	draftCart: Cart,

	email?: string,

	isLoading: boolean,
	totalCount: number,
	pageNumber: number,
}

const Carts = (props: Props) => {
	const { dispatch, progress, snackbar, carts, draftCart, email } = props;
	const { isLoggedIn, accessToken } = useLocalStorage();

	const [isCartUpdating, setIsCartUpdating] = useState(false);

	useEffect(() => {
		if (isLoggedIn && accessToken) {
			dispatch(fetchCarts(false, 'replace', 1));
		}
	}, [isLoggedIn, accessToken]);

	useEffect(() => {
		const handleScroll = () => {
			const { dispatch, carts, isLoading, totalCount, pageNumber } = props;
			const reachedEnd = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
			const shouldFetchCarts = !isLoading && carts.length < totalCount;

			if (reachedEnd && shouldFetchCarts) {
				dispatch(fetchCarts(false, 'merge', pageNumber + 1));
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const onOpenUpdateCartModalClicked = (cart: Cart) => {
		dispatch(setDraftCart(cart));
		setIsCartUpdating(true);
	};
	const onCloseUpdateCartModalClicked = () => {
		dispatch(clearDraftCart());
		setIsCartUpdating(false);
	};

	const onCreateCartClicked = () => {
		dispatch(createCart());
	};

	const onUpdateCartClicked = () => {
		dispatch(updateCart());
		setIsCartUpdating(false);
	};
	const onRemoveCartClicked = (cart: Cart) => {
		if (snackbar.visible) {
			dispatch(hideSnackbar());
		}

		const cartIndex = carts.indexOf(cart);
		dispatch(pullCart(cartIndex));

		let isUndoClicked = false;

		const onUndoClicked = () => {
			isUndoClicked = true;

			dispatch(pushCart(cartIndex, cart));
			dispatch(hideSnackbar());
		};

		dispatch(showSnackbar(language.textRemovingCart, [{
			title: language.actionUndo,
			onClick: onUndoClicked,
		}]));

		setTimeout(() => {
			if (!isUndoClicked) {
				dispatch(removeCart(cart));
			}
		}, 3000);
	};

	const handleDraftCartTitleChange = (title: string) => dispatch(changeDraftCartTitle(title));
	const handleDraftCartNotesChange = (notes: string) => dispatch(changeDraftCartNotes(notes));

	const onAddDraftCartItemClicked = () => dispatch(addDraftCartItem());
	const onRemoveDraftCartItemClicked = (uuid: string) => dispatch(removeDraftCartItem(uuid));
	const handleDraftCartItemTitleChange = (uuid: string, title: string) => dispatch(changeDraftCartItemTitle(uuid, title));
	const handleDraftCartItemStatusChange = (uuid: string, status: CartItemStatusType) => dispatch(changeDraftCartItemStatus(uuid, status));

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		if (destination.index === source.index) {
			return;
		}

		const { dispatch, carts } = props;
		const cartId = carts[source.index].id;
		dispatch(reorderCart(cartId, source.index, destination.index));
	};

	const renderCarts = () => carts.map((cart, index) => (
		<Draggable key={cart.id} draggableId={cart.id} index={index}>
			{provided => (
				<div className='cart_object_container'
				     ref={provided.innerRef}
				     {...provided.draggableProps}
				     {...provided.dragHandleProps}
				>
					<CartObject
						key={cart.uuid}
						progress={progress}
						cart={cart}
						onOpenUpdateCartModalClick={onOpenUpdateCartModalClicked}
						onRemoveCartClick={onRemoveCartClicked}
						currentUserEmail={email}
					/>
				</div>
			)}
		</Draggable>
	));

	const createCartDraftCart = isCartUpdating ? {
		id: '',
		title: '',
		notes: '',
		uuid: '',
		reminderDate: '',
		items: [],
		users: [],
	} : draftCart;
	return (
		<div>
			<CreateCart
				draftCart={createCartDraftCart}
				onDraftCartTitleChange={handleDraftCartTitleChange}
				onAddDraftCartItemClick={onAddDraftCartItemClicked}
				onRemoveDraftCartItemClick={onRemoveDraftCartItemClicked}
				onDraftCartItemTitleChange={handleDraftCartItemTitleChange}
				onDraftCartItemStatusChange={handleDraftCartItemStatusChange}
				onCreateCartClick={onCreateCartClicked}
			/>
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

			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="list">
					{provided => (
						<div ref={provided.innerRef} {...provided.droppableProps}>
							{renderCarts()}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};

Carts.layoutOptions = {
	title: 'Carts',
	layout: 'Main',
	authorized: true,
};

const mapStateToProps = (state: AppState) => {
	const { progress, snackbar } = state.service;
	const { email } = state.profile;

	const { carts, draftCart, isLoading, totalCount, pageNumber } = state.carts;
	return {
		progress,
		snackbar,
		email,

		carts,
		draftCart,

		isLoading,
		totalCount,
		pageNumber,
	};
};

export default connect(mapStateToProps)(Carts);
