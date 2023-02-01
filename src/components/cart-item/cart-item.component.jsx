import { CartItemContainer, ImgContainer, ItemDetails, Name, Price } from "./cart-item.styles.jsx";

const CartItem = ({ cartItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <CartItemContainer>
      <ImgContainer src={imageUrl} alt={`${name}`} />
      <ItemDetails>
        <Name>{name}</Name>
        <Price>{quantity} x ${price}</Price>
      </ItemDetails>
    </CartItemContainer>
  );
};

export default CartItem;
