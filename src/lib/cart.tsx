import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Product } from "@/data/products";

type CartItem = {
  product: Product;
  quantity: number;
  isFree?: boolean;
  isBump?: boolean;
  bumpPrice?: number;
};


type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (product: Product, quantity?: number, isFree?: boolean, bumpPrice?: number) => void;
  remove: (slug: string, isFree?: boolean, isBump?: boolean) => void;
  updateQuantity: (slug: string, quantity: number, isFree?: boolean, isBump?: boolean) => void;

  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product: Product, quantity = 1, isFree = false, bumpPrice?: number) => {
    const isBump = bumpPrice !== undefined;
    setItems((current) => {
      const existingIndex = current.findIndex(
        (i) => i.product.slug === product.slug && i.isFree === isFree && !!i.isBump === isBump
      );

      if (existingIndex > -1) {
        const newItems = [...current];
        const existingItem = newItems[existingIndex];
        if (existingItem) {
          newItems[existingIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
          };
        }
        return newItems;

      }

      return [...current, { product, quantity, isFree, isBump, ...(bumpPrice !== undefined ? { bumpPrice } : {}) }];
    });
    setIsOpen(true);
  };

  const remove = (slug: string, isFree?: boolean, isBump?: boolean) => {
    setItems((current) =>
      current.filter((i) => !(i.product.slug === slug && i.isFree === isFree && !!i.isBump === !!isBump))
    );
  };

  const updateQuantity = (slug: string, quantity: number, isFree?: boolean, isBump?: boolean) => {
    if (quantity < 1) {
      remove(slug, isFree, isBump);
      return;
    }
    setItems((current) =>
      current.map((i) =>
        i.product.slug === slug && i.isFree === isFree && !!i.isBump === !!isBump ? { ...i, quantity } : i
      )
    );
  };


  const clear = () => setItems([]);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const total = items.reduce(
    (acc, i) => acc + (i.isFree ? 0 : i.isBump && i.bumpPrice != null ? i.bumpPrice : i.product.price) * i.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        isOpen,
        add,
        remove,
        updateQuantity,
        clear,
        open,
        close,
        toggle,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

