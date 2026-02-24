export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  unit: string; // e.g., "kg", "bunch", "piece"
};

export type CartItem = Product & {
  quantity: number;
};

export type Category = {
  id: string;
  name: string;
};

export type PageContent = {
  title: string;
  content: string;
  image?: string;
  sections?: { title: string; content: string; icon?: string }[];
};

export type SiteContent = {
  about: PageContent;
  contact: PageContent & {
    email: string;
    phone: string;
    address: string;
  };
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
};

export type ViewState = 'home' | 'shop' | 'cart' | 'admin' | 'about' | 'contact' | 'checkout';
