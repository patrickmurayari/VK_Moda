import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import './App.css'

import Navbar from './components/layout/Navbar'
import NotFound from './components/common/NotFound'
import HeroSection from './components/home/HeroSection'
import SeccionCategorias from './components/home/SeccionCategorias'
import SeccionColeccion from './components/home/SeccionColeccion'
import Footer from "./components/layout/Footer"

// Admin imports
import Login from './pages/Login'
import ProtectedRoute from './components/admin/ProtectedRoute'
import DashboardLayout from './components/admin/DashboardLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductos from './pages/admin/AdminProductos'
import ProductoForm from './pages/admin/ProductoForm'
import AdminPedidos from './pages/admin/AdminPedidos'
import PedidoDetalle from './pages/admin/PedidoDetalle'
import OrderWizard from './pages/admin/OrderWizard'
import AdminClientes from './pages/admin/AdminClientes'
import AdminCategorias from './pages/admin/AdminCategorias'
import ClienteHistoria from './pages/admin/ClienteHistoria'

const CategoriaTemplate = lazy(() => import("./components/Categorias/CategoriaTemplate"))

const SeccionEditorialModa = lazy(() => import('./components/home/SeccionEditorialModa'))
const QuienesSomos = lazy(() => import('./pages/QuienesSomos'))

function DeferredSection({ id, Component, placeholderClassName = 'min-h-[240px]' }) {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref} id={shouldRender ? undefined : id} className={placeholderClassName}>
      {shouldRender ? (
        <Suspense
          fallback={
            <div className="min-h-[240px] flex items-center justify-center px-6">
              <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 shadow-elegant">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent-600 animate-pulse" aria-hidden="true" />
                  <p className="text-sm font-body text-neutral-700">Cargando…</p>
                </div>
              </div>
            </div>
          }
        >
          <Component />
        </Suspense>
      ) : null}
    </div>
  );
}

DeferredSection.propTypes = {
  id: PropTypes.string,
  Component: PropTypes.elementType.isRequired,
  placeholderClassName: PropTypes.string,
};

function Home() {
    return (
        <div>
            <HeroSection />
            <SeccionCategorias />
            <SeccionColeccion />
            <DeferredSection id="editorial" Component={SeccionEditorialModa} placeholderClassName="min-h-[520px]" />
        </div>
    );
}

function App() {
  const location = useLocation();
  
  // Condicional: verdadero si la ruta actual incluye '/login' o '/admin'
  const hideLayout = location.pathname.includes('/login') || location.pathname.includes('/admin');

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Se renderiza Navbar solo si hideLayout es false */}
      {!hideLayout && <Navbar />}

      <Suspense
        fallback={
          <div className="min-h-[40vh] flex items-center justify-center px-6">
            <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-accent-600 animate-pulse" aria-hidden="true" />
                <p className="text-sm font-body text-neutral-700">Cargando…</p>
              </div>
            </div>
          </div>
        }
      >
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/categoria/:slug" element={<CategoriaTemplate />}></Route>
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas de administración */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="pedidos/nuevo" element={<OrderWizard />} />
            <Route path="pedidos/:id" element={<PedidoDetalle />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="clientes/:id" element={<ClienteHistoria />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="productos/nuevo" element={<ProductoForm />} />
            <Route path="productos/editar/:id" element={<ProductoForm />} />
          </Route>
          
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>

      {/* Se renderiza Footer solo si hideLayout es false */}
      {!hideLayout && (
        <Footer/>
      )}
    </>
  )
}

export default App