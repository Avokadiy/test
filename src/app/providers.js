import CartProvider from "@/store/CartContext";

export default function Providers({ children }) {
    return <CartProvider>{children}</CartProvider>;
}