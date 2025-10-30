import { Cart, CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'flowery_cart';

export const getCart = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }
  
  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (cartJson) {
      return JSON.parse(cartJson);
    }
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
  }
  
  return { items: [], total: 0 };
};

export const saveCart = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (product: Product, quantity: number = 1): Cart => {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    item => item.product._id === product._id
  );

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ product, quantity });
  }

  // Recalculate total
  cart.total = cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  saveCart(cart);
  return cart;
};

export const updateQuantity = (productId: string, newQuantity: number): Cart => {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.product._id === productId);

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = newQuantity;
    }

    // Recalculate total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    saveCart(cart);
  }

  return cart;
};

export const removeFromCart = (productId: string): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product._id !== productId);

  // Recalculate total
  cart.total = cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  saveCart(cart);
  return cart;
};

export const clearCart = (): Cart => {
  const emptyCart = { items: [], total: 0 };
  saveCart(emptyCart);
  return emptyCart;
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};