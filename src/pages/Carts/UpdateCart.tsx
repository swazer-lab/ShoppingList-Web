import React, { FormEvent } from 'react';
import classNames from 'classnames';

import { Cart, CartItemStatusType } from '../../types/api';

import { Button } from '../../components/Button';
import CartItemObject from './CartItemObject';

import language from '../../assets/language';

import './styles.scss';

interface Props {
	draftCart: Cart,

	onDraftCartTitleChange: (title: string) => void,
	onDraftCartNotesChange: (notes: string) => void,

	onAddDraftCartItemClick: () => void,
	onRemoveDraftCartItemClick: (uuid: string) => void,
	onDraftCartItemTitleChange: (uuid: string, title: string) => void,
	onDraftCartItemStatusChange: (uuid: string, status: CartItemStatusType) => void,

	isVisible: boolean,

	onCloseUpdateCartModalClick: () => void,
	onUpdateCartClick: () => void,
}

const UpdateCart = (props: Props) => {
	const {
		draftCart,

		onDraftCartTitleChange,

		onCloseUpdateCartModalClick,

		onAddDraftCartItemClick,
		onRemoveDraftCartItemClick,
		onDraftCartItemTitleChange,
		onDraftCartItemStatusChange,

		isVisible,
		onUpdateCartClick,
	} = props;

	const handleDraftCartTitleChange = (e: FormEvent<HTMLInputElement>) => onDraftCartTitleChange(e.currentTarget.value);

	const onAddDraftCartItemClicked = () => onAddDraftCartItemClick();

	const onCloseUpdateCartModalClicked = () => {
		onCloseUpdateCartModalClick();
	};

	const onUpdateCartClicked = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onUpdateCartClick();
	};

	const { title, items } = draftCart;
	return (
		<div className={classNames('cart_object__update_cart', { cart_object__update_cart_open: isVisible })}
		     onClick={onCloseUpdateCartModalClicked}>
			<div className='update_cart'>
				<form
					className={classNames('update_cart__form cart_object__update_cart__modal', { cart_object__update_cart__modal_open: isVisible })}
					onSubmit={onUpdateCartClicked}
					onClick={(e: any) => e.stopPropagation()}>

					<input
						className='update_cart__form__title_input'
						type='text'
						placeholder={language.textEnterCartTitle}
						value={title}
						onChange={handleDraftCartTitleChange}
						required
					/>

					<div className='update_cart__form__cart_items'>
						{items.map(item => <CartItemObject key={item.uuid} cartItem={item} onRemoveDraftCartItemClick={onRemoveDraftCartItemClick} onDraftCartItemTitleChange={onDraftCartItemTitleChange} onDraftCartItemStatusChange={onDraftCartItemStatusChange}/>)}
					</div>

					<div className='update_cart__form__add_item_button' onClick={onAddDraftCartItemClicked}>
						<i className='material-icons update_cart__cart_item__close_button'
						   children='add'
						/>
						<span>{language.actionAddCartItem}</span>
					</div>

					<div className='update_cart__form__button_container'>
						<Button
							className='update_cart__form__button_container__close_button'
							mode='text'
							type='button'
							title='Close'
							onClick={onCloseUpdateCartModalClicked}
						/>

						<Button
							className='update_cart__form__button_container__submit_button'
							type='submit'
							title={language.actionUpdateCart}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateCart;
