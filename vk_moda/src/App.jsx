import { Routes, Route} from "react-router-dom"
import './App.css'

import Navbar from './components/layout/Navbar'
import NotFound from './components/common/NotFound'
import HeroSection from './components/home/HeroSection'
import SeccionCategorias from './components/home/SeccionCategorias'
import SeccionColeccion from './components/home/SeccionColeccion'
import SeccionOfertas from './components/home/SeccionOfertas'
import SeccionQuienesSomos from './components/home/SeccionQuienesSomos'
import SeccionContacto from './components/home/SeccionContacto'
import Bolsos from "./components/Categorias/Bolsos"
import Indumentaria from "./components/Categorias/Indumentaria"
import Joyeria from "./components/Categorias/Joyeria"
import Vestidos from "./components/Categorias/Vestidos"
import Footer from "./components/layout/Footer"

function Home() {
    return (
        <div>
            <HeroSection />
            <SeccionCategorias />
            <SeccionColeccion />
            <SeccionOfertas />
            <SeccionQuienesSomos />
            <SeccionContacto />
        </div>
    );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/bolsos" element={<Bolsos />}></Route>
        <Route path="/indumentaria" element={<Indumentaria />}></Route>
        <Route path="/joyeria" element={<Joyeria />}></Route>
        <Route path="/vestidos" element={<Vestidos />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <div className="mt-4">
        <Footer/>
      </div>
    </>
  )
}

export default App
