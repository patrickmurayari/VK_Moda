import { Routes, Route} from "react-router-dom"
import './App.css'

import Navbar from './components/layout/Navbar'
import NotFound from './components/common/NotFound'
import Carrouselhome from './components/CarrouselHome'
import Bolsos from "./components/Categorias/Bolsos"
import Indumentaria from "./components/Categorias/Indumentaria"
import Joyeria from "./components/Categorias/Joyeria"
import Vestidos from "./components/Categorias/Vestidos"
import Footer from "./components/layout/Footer"
import BotonWhatsApp from "./components/layout/BotonWhatsApp"


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Carrouselhome />}></Route>
        <Route path="/bolsos" element={<Bolsos />}></Route>
        <Route path="/indumentaria" element={<Indumentaria />}></Route>
        <Route path="/joyeria" element={<Joyeria />}></Route>
        <Route path="/vestidos" element={<Vestidos />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <div className="mt-4">
        <Footer/>
      </div>
      <BotonWhatsApp />
    </>
  )
}

export default App
