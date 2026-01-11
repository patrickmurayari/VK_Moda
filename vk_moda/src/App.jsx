import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Routes, Route } from "react-router-dom"
import './App.css'

import Navbar from './components/layout/Navbar'
import NotFound from './components/common/NotFound'
import HeroSection from './components/home/HeroSection'
import SeccionCategorias from './components/home/SeccionCategorias'
import SeccionColeccion from './components/home/SeccionColeccion'
import Footer from "./components/layout/Footer"

const Bolsos = lazy(() => import("./components/Categorias/Bolsos"))
const Indumentaria = lazy(() => import("./components/Categorias/Indumentaria"))
const Joyeria = lazy(() => import("./components/Categorias/Joyeria"))
const Vestidos = lazy(() => import("./components/Categorias/Vestidos"))

const SeccionEditorialModa = lazy(() => import('./components/home/SeccionEditorialModa'))
const SeccionInspiracionModa = lazy(() => import('./components/home/SeccionInspiracionModa'))
const SeccionQuienesSomos = lazy(() => import('./components/home/SeccionQuienesSomos'))
const SeccionContacto = lazy(() => import('./components/home/SeccionContacto'))

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
            <DeferredSection Component={SeccionInspiracionModa} placeholderClassName="min-h-[320px]" />
            <DeferredSection id="quienes-somos" Component={SeccionQuienesSomos} placeholderClassName="min-h-[520px]" />
            <DeferredSection id="contactos" Component={SeccionContacto} placeholderClassName="min-h-[520px]" />
        </div>
    );
}

function App() {
  return (
    <>
      <Navbar />
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
          <Route path="/" element={<Home />}></Route>
          <Route path="/bolsos" element={<Bolsos />}></Route>
          <Route path="/indumentaria" element={<Indumentaria />}></Route>
          <Route path="/joyeria" element={<Joyeria />}></Route>
          <Route path="/vestidos" element={<Vestidos />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <div className="mt-4">
        <Footer/>
      </div>
    </>
  )
}

export default App
