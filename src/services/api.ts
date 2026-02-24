import { Product, Category, SiteContent, Order } from '../types';

const API_URL = '/api';

const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

export const api = {
  async login(username: string, password: string): Promise<string | null> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token;
  },

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  async saveProduct(product: Product, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(product)
    });
    return res.ok;
  },

  async updateProduct(product: Product, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(product)
    });
    return res.ok;
  },

  async deleteProduct(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.ok;
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
  },

  async saveCategory(category: Category, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(category)
    });
    return res.ok;
  },

  async deleteCategory(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    return res.ok;
  },

  async createOrder(order: any): Promise<boolean> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(order)
    });
    return res.ok;
  },

  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(token)
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status })
    });
    return res.ok;
  },

  async getContent(): Promise<SiteContent> {
    const res = await fetch(`${API_URL}/site`);
    return res.json();
  },

  async saveContent(content: SiteContent, token: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/site`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(content)
    });
    return res.ok;
  }
};
