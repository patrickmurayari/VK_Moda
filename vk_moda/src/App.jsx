import { Routes, Route} from "react-router-dom"
import './App.css'
import wplogo from "./img/wplogo.png"

import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import Carrouselhome from './components/CarrouselHome'
import Bolsos from "./components/Categorias/Bolsos"
import Indumentaria from "./components/Categorias/Indumentaria"
import Joyeria from "./components/Categorias/Joyeria"
import Vestidos from "./components/Categorias/Vestidos"
import Footer from "./components/Footer"


function App() {
  return (
    <>
      <div className="flex justify-end mt-8 ">
        <a href="https://api.whatsapp.com/send?phone=541126073801" target="_blank" rel="noopener noreferrer">
          <img src={wplogo} alt="WhatsApp" className="h-12  md:h-16 md:w-16 fixed bottom-4 z-50  right-2" />
          </a>
        </div>
      <Navbar />
        <Routes>
          <Route path="/" element={<Carrouselhome />}></Route>
          <Route path="/bolsos" element={<Bolsos />}></Route>
          <Route path="/indumentaria" element={<Indumentaria />}></Route>
          <Route path="/joyeria" element={<Joyeria />}></Route>
          <Route path="/vestidos" element={<Vestidos />}></Route>
         
        </Routes>
      <div className="mt-4">
      <Footer/>
        </div>  
    </>
  )
}

export default App
