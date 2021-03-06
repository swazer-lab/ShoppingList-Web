import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import _ from 'lodash';
import { AppState } from '../../types/store';
import { Cart, CartItemStatusType } from '../../types/api';
import { VisibilityFilter } from '../../types/carts';

import { Modal, ProgressBar } from '../../components';
import ShareCart from './ShareCart';

import CreateCart from './CreateCart';
import UpdateCart from './UpdateCart';
import DiscardDialog from './DiscardDialog';
import CartObject from './CartObject';
import CopyCartModal from './CopyCartModal';
import { hideSnackbar, showSnackbar } from '../../actions/service';
import {
		addDraftCartItem,
		changeDraftCartItemStatus,
		changeDraftCartItemTitle,
		changeDraftCartNotes,
		changeDraftCartTitle,
		changeVisibilityFilter,
		clearDraftCart,
		copyCart,
		createCart,
		fetchCarts,
		pullCart,
		pushCart,
		removeCart,
		removeDraftCartItem,
		reorderCart,
		setDestinationCart,
		setDraftCart,
		setIsCartCopying,
		setIsCartStatusChanging,
		setIsCartUpdating,
		updateCart,
} from '../../actions/carts';

import language from '../../assets/language';
import { getCartStatus } from '../../config/utilities';
import VisibilityFilterComponent from './VisibilityFilterComponent';

import SharedUserInformation from './SharedUserInformation';

interface Props {
		dispatch: Function,
		progress: AppState['service']['progress'],
		snackbar: AppState['service']['snackbar'],

		carts: Array<Cart>,
		draftCart: Cart,

		visibilityFilter: VisibilityFilter,
		isCartUpdating: boolean,
		isCartCopying: boolean,
		isCartStatusChanging: boolean,

		email?: string,

		isLoading: boolean,
		totalCount: number,
		pageNumber: number,

		isLoggedIn: boolean,
		accessToken: string,

		isOpenSideBar?: boolean
}

const Carts = (props: Props) => {
		const [isShowDiscardDialog, setShowDiscardDialog] = useState(false);
		const [isShareModalVisible, setIsShareModalVisible] = useState(false);
		const [modalCart, setIsModalCart] = useState();
		const [isSharedUserModalVisible, setisSharedUserModalVisible] = useState(false);

		const { dispatch, progress, snackbar, carts, draftCart, email, visibilityFilter, isCartUpdating, isCartCopying, isCartStatusChanging, isLoggedIn, accessToken, isOpenSideBar } = props;

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
				dispatch(setIsCartUpdating(true));
		};

		const onCloseUpdateCartModalClicked = () => {
				const currentCart: any = carts.find(cart => cart.id === draftCart.id);

				const pickElement = (object: Cart) => {
						if (!object) return;

						const filterObject = _.pick(object, ['title', 'items']);

						return Object.assign({}, filterObject, {
								items: filterObject.items.map(elem => _.pick(elem, ['id', 'title', 'status'])),
						});
				};

				if (_.isEqual(pickElement(currentCart), pickElement(draftCart))) {
						dispatch(clearDraftCart());
						dispatch(setIsCartUpdating(false));
				} else {
						setShowDiscardDialog(true);
				}
		};

		const onClickChangesDiscard = async () => {
				onClickCancelDiscard();

				setTimeout(() => {
						dispatch(clearDraftCart());
						dispatch(setIsCartUpdating(false));
				}, 300);
		};

		const onClickCancelDiscard = () => {
				setShowDiscardDialog(false);
		};

		const onOpenCopyCartModalClicked = (cart: Cart) => {
				dispatch(setDraftCart(cart));
				dispatch(changeDraftCartTitle(cart.title + ' (Copy)'));
				dispatch(setIsCartCopying(true));
		};

		const onCloseCopyCartModalClicked = () => {
				dispatch(clearDraftCart());
				dispatch(setIsCartCopying(false));
		};

		const onCreateCartClicked = () => {
				dispatch(createCart());
		};

		const onUpdateCartClicked = () => {
				dispatch(updateCart());
		};

		const onCopyCartClicked = (hasToShare: boolean) => {
				dispatch(copyCart(hasToShare));
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
						dispatch(hideSnackbar());
						dispatch(pushCart(cartIndex, cart));
				};

				dispatch(showSnackbar(language.textRemovingCart, [{
						title: language.actionUndo,
						onClick: onUndoClicked,
				}]));

				setTimeout(() => {
						if (!isUndoClicked) {
								dispatch(hideSnackbar());
								dispatch(removeCart(cart));
						}
				}, 3000);
		};

		const handleDraftCartTitleChange = (title: string) => dispatch(changeDraftCartTitle(title));
		const handleDraftCartNotesChange = (notes: string) => dispatch(changeDraftCartNotes(notes));

		const onAddDraftCartItemClicked = () => dispatch(addDraftCartItem());
		const onRemoveDraftCartItemClicked = (uuid: string) => dispatch(removeDraftCartItem(uuid));
		const handleDraftCartItemTitleChange = (uuid: string, title: string) => dispatch(changeDraftCartItemTitle(uuid, title));

		const handleDraftCartItemStatusChange = (uuid: string, status: CartItemStatusType) => {
				dispatch(changeDraftCartItemStatus(uuid, status));
		};

		const handleDraftCartObjectItemStatusChange = (uuid: string, status: CartItemStatusType, cart?: Cart) => {
				dispatch(setIsCartStatusChanging(true));
				dispatch(setDraftCart(cart!));
				dispatch(changeDraftCartItemStatus(uuid, status));
				dispatch(updateCart());
		};

		const onCartMakeArchive = (cart: Cart) => {
				if (snackbar.visible) {
						dispatch(hideSnackbar());
				}

				const cartIndex = carts.indexOf(cart);

				dispatch(pullCart(cartIndex));

				let isUndoClicked = false;

				const onUndoClicked = () => {
						isUndoClicked = true;
						dispatch(hideSnackbar());
						dispatch(pushCart(cartIndex, cart));
				};

				dispatch(showSnackbar(language.textArchivingCart, [{
						title: language.actionUndo,
						onClick: onUndoClicked,
				}]));

				setTimeout(() => {
						if (!isUndoClicked) {
								dispatch(hideSnackbar());
								dispatch(setDestinationCart(cart, cartIndex, true));
						}
				}, 3000);
		};

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

		const onGetAllCarts = () => {
				dispatch(changeVisibilityFilter(VisibilityFilter.all));
		};

		const onGetActiveCarts = () => {
				dispatch(changeVisibilityFilter(VisibilityFilter.active));
		};

		const onGetCompletedCarts = () => {
				dispatch(changeVisibilityFilter(VisibilityFilter.completed));
		};

		const onOpenShareModalClicked = (cart: Cart) => {
				setIsModalCart(cart);
				setIsShareModalVisible(true);
		};

		const onOpenSharedUserInformationClicked = (cart: Cart) => {
				setIsModalCart(cart);
				setisSharedUserModalVisible(true);
		};

		const onCloseShareModalClick = (e: any) => {
				e.stopPropagation();
				setIsShareModalVisible(false);
		};

		const onCloseSharedUserInformation = (e: any) => {
				e.stopPropagation();
				setisSharedUserModalVisible(false);
		};

		const renderCarts = () => carts.map((cart, index) => (
				<div key={cart.uuid}>
						<Draggable draggableId={cart.uuid} index={index}>
								{(provided) => (
										<div className='cart_object_container'
										     ref={provided.innerRef}
										     {...provided.draggableProps}
										     {...provided.dragHandleProps}
										>
												{visibilityFilter === 'All' || getCartStatus(cart.items) === visibilityFilter ?
														<CartObject
																innerRef={provided.innerRef}
																progress={progress}
																cart={cart}
																cartIndex={index}
																onOpenUpdateCartModalClick={onOpenUpdateCartModalClicked}
																onRemoveCartClick={onRemoveCartClicked}
																currentUserEmail={email}
																onOpenCopyCartModalClick={onOpenCopyCartModalClicked}
																onDraftCartItemStatusChange={handleDraftCartObjectItemStatusChange}
																onOpenShareModalClick={onOpenShareModalClicked}
																onOpenSharedUserInformationClick={onOpenSharedUserInformationClicked}
																onArchiveCartClick={onCartMakeArchive}
														/> : null
												}
										</div>
								)}
						</Draggable>
				</div>
		));

		const createCartDraftCart = isCartUpdating || isCartCopying || isCartStatusChanging ? {
				id: '',
				title: '',
				notes: '',
				uuid: '',
				reminderDate: '',
				items: [],
				users: [],
		} : draftCart;

		return (
				<div className={isOpenSideBar ? 'container__open_side_bar' : 'container'}>
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
						<CopyCartModal
								isVisible={isCartCopying}
								draftCart={draftCart}
								onDraftCartTitleChange={handleDraftCartTitleChange}
								onCopyCartClick={onCopyCartClicked}
								onCloseCopyCartModalClick={onCloseCopyCartModalClicked}
						/>
						{carts.length > 0 ?
								<div className='carts_container'>
										{
												carts.length > 0 ?
														<VisibilityFilterComponent
																visibilityFilter={visibilityFilter}
																onGetAllCarts={onGetAllCarts}
																onGetActiveCarts={onGetActiveCarts}
																onGetCompletedCarts={onGetCompletedCarts} />
														: ''}
										<DragDropContext onDragEnd={onDragEnd}>
												<Droppable droppableId="list1" direction={'vertical'} key="list1">
														{provided => (
																<div ref={provided.innerRef} {...provided.droppableProps}>
																		{renderCarts()}
																		{provided.placeholder}
																</div>
														)}
												</Droppable>
												<div style={{ height: '10px' }}>

												</div>
										</DragDropContext>
										{modalCart &&
										<Modal
												isVisible={isShareModalVisible}
												onCloseModalClick={onCloseShareModalClick}
												title={language.textShareCartTitle}
												rightButtons={[{ iconName: 'close', onClick: onCloseShareModalClick }]}>

												<ProgressBar isLoading={progress.visible} />
												<ShareCart cart={modalCart} />
										</Modal>
										}
										{modalCart &&
										<Modal
												isVisible={isSharedUserModalVisible}
												onCloseModalClick={onCloseSharedUserInformation}
												title='Shared User Information'
												rightButtons={[{ iconName: 'close', onClick: onCloseSharedUserInformation }]}>
												<SharedUserInformation cartUsers={modalCart.users} />
										</Modal>
										}
										<DiscardDialog
												isShow={isShowDiscardDialog}
												onCancel={onClickCancelDiscard}
												onDiscard={onClickChangesDiscard}
										/>
								</div>
								:
								<div className='carts_container create_cart not_cart_here'>
										There is no carts here.
								</div>
						}
				</div>
		);
};

Carts.layoutOptions = {
		title: 'Carts',
		layout: 'Main',
		authorized: true,
};

const mapStateToProps = (state: AppState) => {
		const { progress, snackbar, isOpenSideBar } = state.service;
		const { email } = state.profile;
		const { isLoggedIn, accessToken } = state.storage;

		const { carts, draftCart, isLoading, totalCount, pageNumber, visibilityFilter, isCartUpdating, isCartCopying, isCartStatusChanging } = state.carts;

		return {
				progress,
				snackbar,
				email,

				carts,

				draftCart,
				visibilityFilter,
				isCartUpdating,
				isCartCopying,
				isCartStatusChanging,

				isLoading,
				totalCount,
				pageNumber,

				isLoggedIn,
				accessToken,
				isOpenSideBar,
		};
};

export default connect(mapStateToProps)(Carts);
