import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import { CartDrawer } from "./components/CartDrawer";
import { SiteHeader } from "./components/SiteHeader";
import { StoreFooter } from "./components/StoreFooter";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ToastProvider";
import { WishlistProvider } from "./components/WishlistProvider";

export const metadata = {
  title: "INSÔNIA | Skatewear",
  description: "E-commerce demonstrativo premium da INSÔNIA."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <main className="storefront">
                  <SiteHeader />
                  {children}
                  <StoreFooter />
                </main>
                <CartDrawer />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
