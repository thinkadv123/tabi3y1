import { Product, Category, SiteContent } from '../types';

const API_URL = '/api';

export const api = {
  // --- Auth ---
  login: async (username: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  saveProduct: async (product: Product, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to save product:', error);
      return false;
    }
  },

  updateProduct: async (product: Product, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  },

  deleteProduct: async (id: string, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  },

  // --- Categories ---
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },

  saveCategory: async (category: Category, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to save category:', error);
      return false;
    }
  },

  deleteCategory: async (id: string, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  },

  // --- Site Content ---
  getContent: async (): Promise<SiteContent> => {
    const response = await fetch(`${API_URL}/site`);
    return response.json();
  },

  saveContent: async (content: SiteContent, token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/site`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to save content:', error);
      return false;
    }
  }
};
