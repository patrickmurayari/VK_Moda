import { lazy, Suspense } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'

import Navbar from './components/layout/Navbar'
import NotFound from './components/common/NotFound'
import HeroSection from './components/home/HeroSection'
import SeccionCategorias from './components/home/SeccionCategorias'
import SeccionColeccion from './components/home/SeccionColeccion'
import SeccionEditorialModa from './components/home/SeccionEditorialModa'
import SeccionInspiracionModa from './components/home/SeccionInspiracionModa'
import SeccionQuienesSomos from './components/home/SeccionQuienesSomos'
import SeccionContacto from './components/home/SeccionContacto'
import Footer from "./components/layout/Footer"

const Bolsos = lazy(() => import("./components/Categorias/Bolsos"))
const Indumentaria = lazy(() => import("./components/Categorias/Indumentaria"))
const Joyeria = lazy(() => import("./components/Categorias/Joyeria"))
const Vestidos = lazy(() => import("./components/Categorias/Vestidos"))

function Home() {
    return (
        <div>
            <HeroSection />
            <SeccionCategorias />
            <SeccionColeccion />
            <SeccionEditorialModa />
            <SeccionInspiracionModa />
            <SeccionQuienesSomos />
            <SeccionContacto />
        </div>
    );
}

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
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
