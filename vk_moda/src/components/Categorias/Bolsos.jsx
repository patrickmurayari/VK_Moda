import NavCategoria from "../NavCategoria"
import bolso1 from "../../img/Productos/bolsos/bolso1.jpg"
import bolso2 from "../../img/Productos/bolsos/bolso2.jpg"
import bolso3 from "../../img/Productos/bolsos/bolso3.jpg"
import bolso4 from "../../img/Productos/bolsos/bolso4.jpg"
import bolso5 from "../../img/Productos/bolsos/bolso5.jpg"
import bolso6 from "../../img/Productos/bolsos/bolso6.jpg"
import bolso7 from "../../img/Productos/bolsos/bolso7.jpg"
import bolso8 from "../../img/Productos/bolsos/bolso8.jpg"
import bolso9 from "../../img/Productos/bolsos/bolso9.jpg"
import bolso10 from "../../img/Productos/bolsos/bolso10.jpg"
import cartera1 from "../../img/Productos/bolsos/cartera1.jpg"
import cartera2 from "../../img/Productos/bolsos/cartera2.jpg"

import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

const products = [
    {
        id: 1,
        image: `${bolso1}`,
        name: "Bolso negro con stras",
        precio: "$17000",
    },
    {
        id: 2,
        image: `${bolso2}`,
        name: "VESTIDOS",
        precio: "$3519",
    },
    {
        id: 3,
        image: `${bolso3}`,
        name: "VESTIDOS",
        precio: "$3519",
    },
    {
        id: 4,
        image: `${bolso4}`,
        name: "About eco cuero con tirantes dorados",
        precio: "$12000",
    },
    {
        id: 5,
        image: `${bolso5}`,
        name: "Mini bag con stras incrustadas",
        precio: "$12000",
    },
    {
        id: 6,
        image: `${bolso6}`,
        name: "Small bag con tirantes de piel",
        precio: "$15000",
    },
    {
        id: 7,
        image: `${bolso7}`,
        name: "Small bag color rosa pálido",
        precio: "$13000",
    },
    {
        id: 8,
        image: `${bolso8}`,
        name: "VESTIDOS",
        precio: "$3519",
    },
    {
        id: 9,
        image: `${bolso9}`,
        name: "Bolso deportivo",
        precio: "$3519",
    },
    {
        id: 10,
        image: `${bolso10}`,
        name: "Mini bag",
        precio: "$10000",
    },
    {
        id: 11,
        image: `${cartera1}`,
        name: "Billetera",
        precio: "$7000",
    },
    {
        id: 12,
        image: `${cartera2}`,
        name: "Billetera",
        precio: "$3500",
    }


]


const Bolsos = () => {
    return (
        <div className="relative min-h-screen ">

            <NavCategoria />
            <div className=" mt-20 md:mt-20">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight  font-montserrat_alternates text-2xl mt-10 md:text-4xl">BOLSOS</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1   md:grid-cols-4 gap-24 md:gap-24">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center w-full h-96 p-8 md:p-8  transition-transform transform-gpu hover:scale-105 hover:transition-transform duration-300"
                            >
                                <img
                                    className="  rounded-3xl transition-transform mt-1 object-cover h-96 md:h-96 md:w-screen"
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
            <div className="flex justify-center gap-2 mt-20 md:mt-24">
                <img className="w-10 h-10" src={insta} alt="" />
                <img className="w-10 h-10" src={facebook} alt="" />
            </div>
        </div>
    )
}

export default Bolsos;