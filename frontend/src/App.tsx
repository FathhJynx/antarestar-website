import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import BirthdayDiscountModal from "./components/BirthdayDiscountModal";

// --- Lazy-Loaded Application Pages ---
const Home = React.lazy(() => import("./pages/Home"));
const Store = React.lazy(() => import("./pages/Store"));
const About = React.lazy(() => import("./pages/About"));
const Corporate = React.lazy(() => import("./pages/Corporate"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const MemberArea = React.lazy(() => import("./pages/MemberArea"));
const Affiliate = React.lazy(() => import("./pages/Affiliate"));
const AffiliateDashboard = React.lazy(() => import("./pages/AffiliateDashboard"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const ProductReviews = React.lazy(() => import("./pages/ProductReviews"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetail = React.lazy(() => import("./pages/OrderDetail"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Tracking = React.lazy(() => import("./pages/Tracking"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// --- Lazy-Loaded Admin Pages ---
const AdminLogin = React.lazy(() => import("./pages/Admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/Admin/Dashboard"));
const ProductManagement = React.lazy(() => import("./pages/Admin/ProductManagement"));
const CategoryManagement = React.lazy(() => import("./pages/Admin/CategoryManagement"));
const OrderManagement = React.lazy(() => import("./pages/Admin/OrderManagement"));
const UserManagement = React.lazy(() => import("./pages/Admin/UserManagement"));
const ContentManagement = React.lazy(() => import("./pages/Admin/ContentManagement"));
const DiscountManagement = React.lazy(() => import("./pages/Admin/DiscountManagement"));
const FlashSaleManagement = React.lazy(() => import("./pages/Admin/FlashSaleManagement"));
const SoldProducts = React.lazy(() => import("./pages/Admin/SoldProducts"));

// Aggressive Smart Caching Configuration for "100x Faster" Feel
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes (no redundant fetches)
      gcTime: 1000 * 60 * 15,   // Keep unused data in memory cache for 15 mins for instant back-navigation
      refetchOnWindowFocus: false, // Don't spam backend when switching windows
      retry: 1,                 // Don't loop infinitely on failure
    },
  },
});

// A lightweight, seamless loading skeleton for route transitions
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-sm"></div>
      <p className="text-xs uppercase tracking-[0.2em] font-black text-muted-foreground animate-pulse">Loading Workspace...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <BirthdayDiscountModal />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Store />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/product/:id/reviews" element={<ProductReviews />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/affiliate" element={<Affiliate />} />

                {/* Protected Routes */}
                <Route path="/member" element={<ProtectedRoute><MemberArea /></ProtectedRoute>} />
                <Route path="/affiliate/dashboard" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/orders/:id/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
                <Route path="/admin/sold-products" element={<AdminRoute><SoldProducts /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/content" element={<AdminRoute><ContentManagement /></AdminRoute>} />
                <Route path="/admin/discounts" element={<AdminRoute><DiscountManagement /></AdminRoute>} />
                <Route path="/admin/flash-sales" element={<AdminRoute><FlashSaleManagement /></AdminRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
