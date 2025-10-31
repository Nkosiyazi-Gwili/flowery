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

export const validateCartItem = (item: CartItem): boolean => {
  return (
    item.product &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.product.price >= 0
  );
};

export const calculateItemTotal = (item: CartItem): number => {
  return item.product.price * item.quantity;
};

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

export const addToCart = (product: Product, quantity: number = 1): Cart => {
  const cart = getCart();
  
  // Check stock availability
  if (product.stock < quantity) {
    throw new Error(`Insufficient stock. Only ${product.stock} items available.`);
  }

  const existingItemIndex = cart.items.findIndex(
    item => item.product._id === product._id
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (newQuantity > product.stock) {
      throw new Error(`Cannot add more items. Only ${product.stock} available.`);
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({ product, quantity });
  }

  cart.total = calculateCartTotal(cart.items);
  saveCart(cart);
  return cart;
};

export const updateQuantity = (productId: string, newQuantity: number): Cart => {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(item => item.product._id === productId);

  if (itemIndex > -1) {
    // Check stock before updating quantity
    const product = cart.items[itemIndex].product;
    if (newQuantity > product.stock) {
      throw new Error(`Cannot update quantity. Only ${product.stock} items available.`);
    }

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = newQuantity;
    }

    // Recalculate total using the utility function
    cart.total = calculateCartTotal(cart.items);
    saveCart(cart);
  }

  return cart;
};

export const removeFromCart = (productId: string): Cart => {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.product._id !== productId);

  // Recalculate total using the utility function
  cart.total = calculateCartTotal(cart.items);
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

// Additional utility functions
export const getCartItem = (productId: string): CartItem | undefined => {
  const cart = getCart();
  return cart.items.find(item => item.product._id === productId);
};

export const isProductInCart = (productId: string): boolean => {
  return getCartItem(productId) !== undefined;
};

export const getCartSummary = (): { itemCount: number; totalAmount: number; items: CartItem[] } => {
  const cart = getCart();
  return {
    itemCount: getCartItemCount(),
    totalAmount: cart.total,
    items: cart.items
  };
};

// Validate entire cart
export const validateCart = (cart: Cart): boolean => {
  return cart.items.every(validateCartItem);
};