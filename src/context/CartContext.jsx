// src/context/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart items from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      const parsedCart = localCart ? JSON.parse(localCart) : [];
      console.log("CartContext: Initializing cart from localStorage:", parsedCart); // Diagnostic log
      return parsedCart;
    } catch (error) {
      console.error("CartContext: Failed to parse cart items from localStorage:", error);
      return []; // Return empty array on error
    }
  });

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log("CartContext: Cart items saved to localStorage:", cartItems); // Diagnostic log
    } catch (error) {
      console.error("CartContext: Failed to save cart items to localStorage:", error);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      let updatedItems;

      if (existingItem) {
        // If item already exists, update its quantity
        updatedItems = prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        console.log(`CartContext: Updated quantity for existing item ${item.name}. New quantity: ${existingItem.quantity + 1}`); // Diagnostic log
      } else {
        // If new item, add with quantity 1
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
        console.log(`CartContext: Added new item ${item.name} to cart.`); // Diagnostic log
      }
      console.log("CartContext: New cart state after addToCart:", updatedItems); // Diagnostic log
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      console.log(`CartContext: Removed item with ID ${id}. New cart state:`, updatedItems); // Diagnostic log
      return updatedItems;
    });
  };

  // Update item quantity in cart
  const updateQuantity = (id, quantity) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        const updatedItems = prevItems.filter(item => item.id !== id); // Remove if quantity is 0 or less
        console.log(`CartContext: Removed item with ID ${id} due to quantity <= 0. New cart state:`, updatedItems); // Diagnostic log
        return updatedItems;
      }
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      console.log(`CartContext: Updated quantity for item with ID ${id}. New quantity: ${quantity}. New cart state:`, updatedItems); // Diagnostic log
      return updatedItems;
    });
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    console.log("CartContext: Cart cleared."); // Diagnostic log
  };

  // Calculate total price of items in cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get total number of items (sum of quantities)
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);


  // The value that will be supplied to any components consuming the context
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    cartItemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
