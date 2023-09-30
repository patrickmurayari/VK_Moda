// import vestidos from "../../img/Categoria/joya2.jpg"
import NavCategoria from "../NavCategoria"
import vestido1 from "../../img/Productos/vestidos/vestido1.jpg"
import vestido2 from "../../img/Productos/vestidos/vestido2.jpg"
import vestido3 from "../../img/Productos/vestidos/vestido3.jpg"
import vestido5 from "../../img/Productos/vestidos/vestido5.jpg"

import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

const products = [
    {
        id: 1,
        image: `${vestido2}`,
        name: "Vestido estampado con largo simetrico",
        precio: "$15000",
    },
    {
        id: 2,
        image: `${vestido1}`,
        name: "Vestido rojo de seda fría",
        precio: "$18000",
    },
    {
        id: 3,
        image: `${vestido3}`,
        name: "Vestido rosa pálido",
        precio: "$15000",
    },
    {
        id: 5,
        image: `${vestido5}`,
        name: "Vestido simétrico negro",
        precio: "$18000",
    },

]

const Vestidos = () => {
    return (
        <div className="relative min-h-screen ">

            <NavCategoria />
            <div className="flex justify-center mt-20 md:mt-20">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight  font-montserrat_alternates text-2xl mt-10 md:text-4xl">VESTIDOS</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1  md:grid-cols-4 gap-32 md:gap-20">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col  items-center justify-center w-full h-96 p-8 md:p-8  transition-transform transform-gpu md:hover:scale-105 hover:transition-transform duration-300"
                            >
                                <img
                                    className=" rounded-3xl  mt-1 object-cover h-96  md:h-96 md:w-screen"
                                    src={elem.image}
                                    alt="producto"
                                />
                                <div className="flex flex-col gap-2 items-center justify-start w-full">
                                    <h6 className=" text-lg md:text-lg  font-extralight  text-center">{elem.name}</h6>
                                    <div>
                                        <span className="font-bold items-center flex justify-center ">
                                            {elem.precio}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className=" mt-24 flex justify-center gap-2 md:mt-28">
                <img className="w-10 h-10" src={insta} alt="" />
                <img className="w-10 h-10" src={facebook} alt="" />
            </div>
        </div>
    )
}

export default Vestidos;