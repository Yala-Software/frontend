
"use client";

import type { User } from '@/types';

// Mock user database
let mockUsers: User[] = [
  { id: "user1", name: "Alice Wonderland", username: "alicew", email: "alice@example.com", password: "password123", avatar: "https://placehold.co/100x100.png?text=A", createdAt: new Date(2023, 0, 15) },
  { id: "user2", name: "Bob The Builder", username: "bobthebuilder", email: "bob@example.com", password: "password123", avatar: "https://placehold.co/100x100.png?text=B", createdAt: new Date(2023, 1, 20) },
  { id: "defaultUser", name: "Test User", username: "testuser", email: "test@example.com", password: "password", avatar: `https://placehold.co/100x100.png?text=T`, createdAt: new Date() },
];

// --- User Management & Auth ---
export const api = {
  loginUser: async (email: string, password?: string): Promise<User | null> => {
    // console.log("API: loginUser called", { email });
    const user = mockUsers.find(u => u.email === email && (password ? u.password === password : true));
    if (user) {
      return {
        ...user,
        name: user.name || user.email.split('@')[0] || "User",
        username: user.username || user.email.split('@')[0] || "user",
        avatar: user.avatar || `https://placehold.co/100x100.png?text=${user.name ? user.name[0]?.toUpperCase() : 'U'}`,
        createdAt: user.createdAt || new Date(),
      };
    }
    return null;
  },

  registerUser: async (name: string, username: string, email: string, password?: string): Promise<User | null> => {
    // console.log("API: registerUser called", { name, username, email });
    if (mockUsers.some(u => u.email === email || u.username === username)) {
      return null;
    }
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      name,
      username,
      email,
      password: password || "password",
      avatar: `https://placehold.co/100x100.png?text=${name[0]?.toUpperCase() || 'U'}`,
      createdAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  fetchCurrentUser: async (userId: string): Promise<User | null> => {
    // console.log("API: fetchCurrentUser called", { userId });
    const user = mockUsers.find(u => u.id === userId);
     if (user) {
      return {
        ...user,
        name: user.name || user.email.split('@')[0] || "User",
        username: user.username || user.email.split('@')[0] || "user",
        avatar: user.avatar || `https://placehold.co/100x100.png?text=${user.name ? user.name[0]?.toUpperCase() : 'U'}`,
        createdAt: user.createdAt || new Date(),
      };
    }
    return null;
  },

  updateUserProfile: async (userId: string, updates: Partial<Pick<User, 'name' | 'username' | 'email'>>): Promise<User | null> => {
    // console.log("API: updateUserProfile called", { userId, updates });
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (updates.username && mockUsers.some(u => u.username === updates.username && u.id !== userId)) {
        throw new Error("Username already taken.");
      }
      if (updates.email && mockUsers.some(u => u.email === updates.email && u.id !== userId)) {
        throw new Error("Email already in use.");
      }

      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      if (updates.name && mockUsers[userIndex].name) { // Ensure name is not undefined
        mockUsers[userIndex].avatar = `https://placehold.co/100x100.png?text=${mockUsers[userIndex].name![0]?.toUpperCase() || 'U'}`;
      }
      return { ...mockUsers[userIndex] };
    }
    return null;
  },

  // --- Dashboard Specific APIs ---

  fetchMyAccounts: async (userId: string): Promise<any[]> => {
    // console.log("API: fetchMyAccounts called for userId:", userId);
    // Simulate fetching accounts for the logged-in user
    if (!userId) return []; // Or throw error
    return [
      { id: "acc1", name: "Main Checking", accountNumber: "**** **** **** 1234", balance: "5,250.75", currency: "USD", type: "Checking" },
      { id: "acc2", name: "High-Yield Savings", accountNumber: "**** **** **** 5678", balance: "15,820.00", currency: "USD", type: "Savings" },
      { id: "acc3", name: "Travel Rewards Card", accountNumber: "**** **** **** 9012", balance: "-875.20", currency: "USD", type: "Credit Card" },
      { id: "acc4", name: "Euro Account", accountNumber: "**** **** **** 3456", balance: "2,100.50", currency: "EUR", type: "Checking" },
      { id: "acc5", name: "Investment Portfolio", accountNumber: "INV-EFT-001", balance: "7,300.00", currency: "USD", type: "Investment" },
    ];
  },

  fetchTransactionHistory: async (userId: string): Promise<any[]> => {
    // console.log("API: fetchTransactionHistory called for userId:", userId);
    if (!userId) return [];
    return [
      { id: "txn1", date: "2024-07-15", type: "Conversion", from: "USD", to: "EUR", amountFrom: "100.00", amountTo: "92.00", status: "Completed" },
      { id: "txn2", date: "2024-07-14", type: "Transfer", toAccount: "Savings Account", amount: "50.00 USD", status: "Pending" }, // Adjusted for simpler display
      { id: "txn3", date: "2024-07-12", type: "Conversion", from: "GBP", to: "USD", amountFrom: "200.00", amountTo: "253.16", status: "Completed" },
      { id: "txn4", date: "2024-07-10", type: "Deposit", source: "External Bank", amount: "500.00 USD", status: "Failed" }, // Adjusted
    ];
  },

  performTransfer: async (userId: string, transferDetails: { fromAccount: string; toAccount: string; amount: number; currency: string; notes?: string }): Promise<{ success: boolean; message: string; transactionId?: string }> => {
    // console.log("API: performTransfer called for userId:", userId, "Details:", transferDetails);
    if (!userId) return { success: false, message: "User not authenticated." };
    if (transferDetails.amount <= 0) {
      return { success: false, message: "Transfer amount must be positive." };
    }
    // Simulate successful transfer
    return { success: true, message: `Transfer of ${transferDetails.amount} ${transferDetails.currency} to ${transferDetails.toAccount} initiated.`, transactionId: `txn-${Date.now()}` };
  },

  getCurrencyConversion: async (amount: number, fromCurrency: string, toCurrency: string, apiProvider: string): Promise<{ success: boolean; originalAmount?: number; convertedAmount?: number; rate?: number; message?: string }> => {
    // console.log("API: getCurrencyConversion called", { amount, fromCurrency, toCurrency, apiProvider });
    const mockRates: { [key: string]: number } = { // Relative to USD
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 157.0,
      CAD: 1.37,
    };

    if (!(fromCurrency in mockRates) || !(toCurrency in mockRates)) {
      return { success: false, message: "Currency not supported by mock API." };
    }
    if (amount <= 0) {
      return { success: false, message: "Amount must be positive." };
    }

    const rateFrom = mockRates[fromCurrency];
    const rateTo = mockRates[toCurrency];
    const result = (amount / rateFrom) * rateTo;

    return {
      success: true,
      originalAmount: amount,
      convertedAmount: parseFloat(result.toFixed(2)),
      rate: parseFloat((rateTo / rateFrom).toFixed(4)),
    };
  },
};
