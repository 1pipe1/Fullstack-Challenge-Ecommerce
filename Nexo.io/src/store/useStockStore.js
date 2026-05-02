import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// Store de Zustand para manejar el inventario de productos
// Usa persist para guardar el inventario en localStorage
const useStockStore = create(

  persist(
    (set, get) => ({
      // Estado inicial: lista de productos vacía
      products: [],

      // Acción fetchProducts: Para traer la data inicial desde Firebase
      fetchProducts: async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          set({ products });
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },

      // Acción updateStock: Para restar productos cuando se venda algo en el carrito
      updateStock: async (soldItems) => {
        try {
          const currentProducts = get().products;
          const updatedProducts = currentProducts.map((product) => {
            const soldItem = soldItems.find(
              (item) => String(item.id) === String(product.id),
            );
            if (soldItem) {
              const newStock = product.stock - soldItem.quantity;
              return {
                ...product,
                stock: Math.max(0, newStock), // Evitar stock negativo
              };
            }
            return product;
          });

          // Actualizar estado local
          set({ products: updatedProducts });

          // Opcional: Actualizar en Firebase
          for (const item of soldItems) {
            const productRef = doc(db, "products", String(item.id));
            const product = updatedProducts.find(
              (p) => String(p.id) === String(item.id),
            );
            if (product) {
              await updateDoc(productRef, { stock: product.stock });
            }
          }
        } catch (error) {
          console.error("Error updating stock:", error);
        }
      },

      // Acción addStock: El puerto de entrada para los nuevos pedidos
      addStock: async (newProducts) => {
        try {
          const currentProducts = get().products;

          // Procesar cada nuevo producto
          const updatedProducts = [...currentProducts];

          for (const newProduct of newProducts) {
            const existingIndex = updatedProducts.findIndex(
              (p) => String(p.id) === String(newProduct.id),
            );

            if (existingIndex >= 0) {
              // Si el producto existe, incrementar el stock
              updatedProducts[existingIndex] = {
                ...updatedProducts[existingIndex],
                stock: updatedProducts[existingIndex].stock + newProduct.stock,
              };
            } else {
              // Si es un producto nuevo, agregarlo a la lista
              updatedProducts.push(newProduct);
            }
          }

          // Actualizar estado local
          set({ products: updatedProducts });

          // Opcional: Actualizar en Firebase
          for (const newProduct of newProducts) {
            const productRef = doc(db, "products", String(newProduct.id));
            const existingProduct = updatedProducts.find(
              (p) => String(p.id) === String(newProduct.id),
            );

            if (existingProduct) {
              await updateDoc(productRef, { stock: existingProduct.stock });
            }
          }
        } catch (error) {
          console.error("Error adding stock:", error);
        }
      },

      // Función auxiliar para obtener producto por ID
      getProductById: (productId) => {
        return get().products.find(
          (product) => String(product.id) === String(productId),
        );
      },

      // Función auxiliar para verificar si hay stock disponible
      hasStock: (productId, quantity = 1) => {
        const product = get().getProductById(productId);
        return product && product.stock >= quantity;
      },

      // Función auxiliar para obtener productos con bajo stock
      getLowStockProducts: (threshold = 5) => {
        return get().products.filter((product) => product.stock <= threshold);
      },
    }),
    {
      // Configuración de persistencia en localStorage
      name: "stock-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useStockStore;
