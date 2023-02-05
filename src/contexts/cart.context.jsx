import { createContext, useReducer } from "react";
import { createAction } from '../utils/reducer/reducer.util';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== existingCartItem.id);
  }

  return cartItems.map((cartItem) =>
    cartItem.id === existingCartItem.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) => {
  return cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
};

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  remoteItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  total: 0,
});

export const CART_ACTION_TYPES = {
  TOGGLE_CART_OPEN: "TOGGLE_CART_OPEN",
  SET_CART_ITEMS: "SET_CART_ITEMS"
};

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
};

const cartReducer = (state, action) => {
  const { type, payload } = action;
  // console.log(`type ${type}, payload ${JSON.stringify(payload)}`);
  switch (type) {
    case CART_ACTION_TYPES.TOGGLE_CART_OPEN:
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        ...payload
      };
    default:
      throw new Error(`Unhandled type ${type} in cartReducer`);
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);
  const { isCartOpen, cartItems, cartCount, cartTotal } = state;

  const setIsCartOpen = () => {
    dispatch(createAction(CART_ACTION_TYPES.TOGGLE_CART_OPEN));
  };

  const updateCartItemsReducer = (newCartItems) => {
    const newTotal = newCartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );
    const newCartCount = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    const payload = { cartItems: newCartItems, cartTotal: newTotal, cartCount: newCartCount}
    dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, payload));
  };

  const addItemToCart = (productToAdd) => {
    updateCartItemsReducer(addCartItem(cartItems, productToAdd));
  };

  const remoteItemFromCart = (cartItemToRemove) => {
    const items = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(items);
  };

  const clearItemFromCart = (cartItemToRemove) => {
    const items = clearCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(items);
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    remoteItemFromCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
