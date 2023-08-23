import './App.css'
import Navbar from './components/Navbar'
import Carrouselhome from './components/CarrouselHome'
import wplogo from "./img/wplogo.png"
import { Routes, Route, BrowserRouter, } from "react-router-dom"


function App() {
  return (

    <div>
      <div className="flex justify-end mt-8 ">
        <a href="https://api.whatsapp.com/send?phone=541131666991" target="_blank" rel="noopener noreferrer">
          <img src={wplogo} alt="WhatsApp" className="h-12  md:h-16 md:w-16 fixed bottom-4 z-50  right-2" />
        </a>
      </div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Carrouselhome />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App

{/* 
<Navbar/>
<Carrouselhome/>
<CarrouselSwip /> */}