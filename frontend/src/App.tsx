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
import GlobalStyler from "./components/antarestar/GlobalStyler";

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
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
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


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <GlobalStyler>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <BirthdayDiscountModal />
              <div className="cursor-none">
                <Suspense fallback={null}>
                  <Routes>
                    {/* Admin Routes (Moved up to prevent * match) */}
                    <Route path="/admin/login" element={<div className="cursor-auto"><AdminLogin /></div>} />
                    <Route path="/admin" element={<div className="cursor-auto"><AdminRoute><AdminDashboard /></AdminRoute></div>} />
                    <Route path="/admin/products" element={<div className="cursor-auto"><AdminRoute><ProductManagement /></AdminRoute></div>} />
                    <Route path="/admin/categories" element={<div className="cursor-auto"><AdminRoute><CategoryManagement /></AdminRoute></div>} />
                    <Route path="/admin/orders" element={<div className="cursor-auto"><AdminRoute><OrderManagement /></AdminRoute></div>} />
                    <Route path="/admin/sold-products" element={<div className="cursor-auto"><AdminRoute><SoldProducts /></AdminRoute></div>} />
                    <Route path="/admin/users" element={<div className="cursor-auto"><AdminRoute><UserManagement /></AdminRoute></div>} />
                    <Route path="/admin/content" element={<div className="cursor-auto"><AdminRoute><ContentManagement /></AdminRoute></div>} />
                    <Route path="/admin/discounts" element={<div className="cursor-auto"><AdminRoute><DiscountManagement /></AdminRoute></div>} />
                    <Route path="/admin/flash-sales" element={<div className="cursor-auto"><AdminRoute><FlashSaleManagement /></AdminRoute></div>} />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
                    <Route path="/affiliate/dashboard/*" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                    <Route path="/orders/:id/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />

                    {/* Catch All */}
                    <Route path="*" element={<div className="cursor-auto"><NotFound /></div>} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </CartProvider>
        </GlobalStyler>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
