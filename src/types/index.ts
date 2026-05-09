/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Order {
  id: string;
  tableNumber?: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  type: 'dine-in' | 'takeaway' | 'delivery';
  createdAt: Date;
  estimatedPrepTime: number; // in minutes
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  performance: 'high' | 'medium' | 'low';
  dailyDemandForecast: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate?: Date;
  status: 'optimal' | 'low' | 'critical' | 'expired';
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'optimization' | 'alert' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable?: string;
}

export interface SalesData {
  time: string;
  amount: number;
  orders: number;
}
