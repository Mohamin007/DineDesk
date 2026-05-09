/**
 * DineDesk Central Data Service
 * Manages operational datasets for the OS and AI context.
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

// --- Firestore Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
// --------------------------------

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  popularity: 'High' | 'Medium' | 'Low';
  ingredients: string[];
  stockLevel: number;
  description?: string;
  prepTime?: string;
  tags?: string[];
  image?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  status: 'Healthy' | 'Low' | 'Critical';
  image?: string;
}

const DEFAULT_MENU: MenuItem[] = [
  { id: 'm1', name: 'Signature Wagyu Burger', category: 'Burgers', price: 24.50, cost: 8.20, popularity: 'High', ingredients: ['Wagyu Beef', 'Truffle Aioli', 'Brioche', 'Aged Cheddar'], stockLevel: 45, prepTime: '12m', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' },
  { id: 'm2', name: 'Truffle Mushroom Pizza', category: 'Pizza', price: 21.00, cost: 6.50, popularity: 'High', ingredients: ['Wild Mushrooms', 'Truffle Oil', 'Mozzarella', 'Thyme'], stockLevel: 30, prepTime: '15m', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop' },
  { id: 'm3', name: 'Spicy Miso Ramen', category: 'Noodles', price: 18.50, cost: 5.20, popularity: 'Medium', ingredients: ['Chashu Pork', 'Miso Broth', 'Soft Egg', 'Nori'], stockLevel: 50, prepTime: '10m', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop' },
  { id: 'm4', name: 'Caesar Salad Premium', category: 'Salads', price: 16.00, cost: 4.00, popularity: 'Medium', ingredients: ['Romaine', 'Parmesan', 'Croutons', 'Anchovy Dressing'], stockLevel: 25, prepTime: '8m', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=600&auto=format&fit=crop' },
  { id: 'm5', name: 'Yuzu Cheesecake', category: 'Desserts', price: 12.00, cost: 3.50, popularity: 'High', ingredients: ['Yuzu', 'Cream Cheese', 'Graham Cracker'], stockLevel: 20, prepTime: '5m', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop' },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Wagyu Beef Paties', quantity: 45, unit: 'pcs', reorderPoint: 20, status: 'Healthy', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=600&auto=format&fit=crop' },
  { id: 'i2', name: 'Premium Flour', quantity: 15, unit: 'kg', reorderPoint: 10, status: 'Healthy', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop' },
  { id: 'i3', name: 'Truffle Oil', quantity: 2, unit: 'L', reorderPoint: 5, status: 'Low', image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?q=80&w=600&auto=format&fit=crop' },
];

const getStorageKeys = () => {
  const user = auth.currentUser;
  const demoEmail = JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || 'anonymous';
  const prefix = user ? user.uid : demoEmail;
  return {
    menu: `restaurant_os_menu_${prefix}`,
    inventory: `restaurant_os_inventory_${prefix}`
  };
};

const loadLocalData = () => {
  const keys = getStorageKeys();
  const savedMenu = localStorage.getItem(keys.menu);
  const savedInv = localStorage.getItem(keys.inventory);
  return {
    menu: savedMenu ? JSON.parse(savedMenu) : [...DEFAULT_MENU],
    inventory: savedInv ? JSON.parse(savedInv) : [...DEFAULT_INVENTORY]
  };
};

const persistLocalData = () => {
  const keys = getStorageKeys();
  localStorage.setItem(keys.menu, JSON.stringify(localMenu));
  localStorage.setItem(keys.inventory, JSON.stringify(localInventory));
};

const initialData = loadLocalData();
let localMenu: MenuItem[] = initialData.menu;
let localInventory: InventoryItem[] = initialData.inventory;
let listeners: (() => void)[] = [];

const notify = () => listeners.forEach(l => l());

export const dataService = {
  subscribe: (callback: () => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(l => l !== callback);
    };
  },

  getMenu: () => localMenu,
  getInventory: () => localInventory,
  
  getStats: () => ({
    dailyRevenue: 4250,
    activeOrders: 12,
    avgPrepTime: '18m',
    occupancy: '85%',
  }),

  getOperationalContext: () => {
    return {
      menu: localMenu,
      inventory: localInventory,
      stats: {
        dailyRevenue: 4250,
        activeOrders: 12,
        avgPrepTime: '18m',
        occupancy: '85%',
      }
    };
  },

  // CRUD Operations
  async addMenuItem(item: Omit<MenuItem, 'id'>) {
    const user = auth.currentUser;
    if (user) {
      const path = `users/${user.uid}/menu`;
      try {
        await addDoc(collection(db, path), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      localMenu = [newItem, ...localMenu];
      persistLocalData();
      notify();
    }
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    const user = auth.currentUser;
    if (user) {
      const path = `users/${user.uid}/menu/${id}`;
      try {
        await updateDoc(doc(db, path), updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      localMenu = localMenu.map(item => item.id === id ? { ...item, ...updates } : item);
      persistLocalData();
      notify();
    }
  },

  async deleteMenuItem(id: string) {
    const user = auth.currentUser;
    if (user) {
      const path = `users/${user.uid}/menu/${id}`;
      try {
        await deleteDoc(doc(db, path));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      localMenu = localMenu.filter(item => item.id !== id);
      persistLocalData();
      notify();
    }
  },

  async updateStock(id: string, newQuantity: number) {
    const user = auth.currentUser;
    if (user) {
      const path = `users/${user.uid}/inventory/${id}`;
      try {
        await updateDoc(doc(db, path), { quantity: newQuantity });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      localInventory = localInventory.map(item => {
        if (item.id === id) {
          const status = newQuantity <= item.reorderPoint / 2 ? 'Critical' : newQuantity <= item.reorderPoint ? 'Low' : 'Healthy';
          return { ...item, quantity: newQuantity, status };
        }
        return item;
      });
      persistLocalData();
      notify();
    }
  },

  // Initialize data sync
  init() {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        // Sync Menu
        const pathMenu = `users/${user.uid}/menu`;
        onSnapshot(collection(db, pathMenu), (snapshot) => {
          if (snapshot.empty) {
            // Check if we've already tried to seed to avoid infinite loops or overwrites
            const setupKey = `setup_seeded_${user.uid}`;
            if (!localStorage.getItem(setupKey)) {
              DEFAULT_MENU.forEach(async (item) => {
                const { id, ...rest } = item;
                const itemPath = `${pathMenu}/${id}`;
                try {
                  await setDoc(doc(db, itemPath), rest);
                } catch (error) {
                  handleFirestoreError(error, OperationType.WRITE, itemPath);
                }
              });
              localStorage.setItem(setupKey, 'true');
            }
          } else {
            localMenu = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
            notify();
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, pathMenu);
        });

        // Sync Inventory
        const pathInv = `users/${user.uid}/inventory`;
        onSnapshot(collection(db, pathInv), (snapshot) => {
          if (snapshot.empty) {
            const setupKeyInv = `setup_inv_seeded_${user.uid}`;
            if (!localStorage.getItem(setupKeyInv)) {
              DEFAULT_INVENTORY.forEach(async (item) => {
                const { id, ...rest } = item;
                const itemPath = `${pathInv}/${id}`;
                try {
                  await setDoc(doc(db, itemPath), rest);
                } catch (error) {
                  handleFirestoreError(error, OperationType.WRITE, itemPath);
                }
              });
              localStorage.setItem(setupKeyInv, 'true');
            }
          } else {
            localInventory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
            notify();
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, pathInv);
        });
      } else {
        // Reload local data when logged out (for demo mode)
        const local = loadLocalData();
        localMenu = local.menu;
        localInventory = local.inventory;
        notify();
      }
    });

    return () => unsubscribeAuth();
  }
};

export const useOperationalData = () => {
  const [data, setData] = useState({
    menu: dataService.getMenu(),
    inventory: dataService.getInventory()
  });

  useEffect(() => {
    return dataService.subscribe(() => {
      setData({
        menu: [...dataService.getMenu()],
        inventory: [...dataService.getInventory()]
      });
    });
  }, []);

  return data;
};
