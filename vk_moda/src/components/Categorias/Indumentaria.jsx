import NavCategoria from "../NavCategoria"
import indumentaria1 from "../../img/Productos/indumentaria/indumentaria1.jpg"
import indumentaria2 from "../../img/Productos/indumentaria/indumentaria2.jpg"
import indumentaria3 from "../../img/Productos/indumentaria/indumentaria3.jpg"
import indumentaria4 from "../../img/Productos/indumentaria/indumentaria4.jpg"
import indumentaria5 from "../../img/Productos/indumentaria/indumentaria5.jpg"
import indumentaria6 from "../../img/Productos/indumentaria/indumentaria6.jpg"
import indumentaria7 from "../../img/Productos/indumentaria/indumentaria7.jpg"
import indumentaria8 from "../../img/Productos/indumentaria/indumentaria8.jpg"
import indumentaria9 from "../../img/Productos/indumentaria/indumentaria10.jpg"
import indumentaria10 from "../../img/Productos/indumentaria/indumentaria11.jpg"
import indumentaria11 from "../../img/Productos/indumentaria/indumentaria12.jpg"

import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

const products = [
    {
        id: 1,
        image: `${indumentaria1}`,
        name: "Camisola negra",
        precio :  "$12000",
    },
    {
        id: 2,
        image: `${indumentaria2}`,
        name: "VESTIDOS",
        precio :  "$3519",
    },
    {
        id: 3,
        image: `${indumentaria3}`,
        name: "Top crop con brillos",
        precio :  "$10000",
    },
    {
        id: 4,
        image: `${indumentaria4}`,
        name: "Top negro",
        precio :  "$7000",
    },
    {
        id: 5,
        image: `${indumentaria5}`,
        name: "Blusa con moño",
        precio :  "$10000",
    },
    {
        id: 6,
        image: `${indumentaria6}`,
        name: "Tunica violeta",
        precio :  "$15000",
    },
    {
        id: 7,
        image: `${indumentaria7}`,
        name: "Blusa satinada",
        precio :  "$12000",
    },
    {
        id: 8,
        image: `${indumentaria8}`,
        name: "Tunica rosada",
        precio :  "$13500",
    },
    {
        id: 9,
        image: `${indumentaria9}`,
        name: "Tunica color carmel",
        precio :  "$13500",
    },
    {
        id: 10,
        image: `${indumentaria10}`,
        name: "Conjunto",
        precio :  "$20000",
    },
    {
        id: 11,
        image: `${indumentaria11}`,
        name: "Blusa con moño",
        precio :  "$12000",
    },


]

const Indumentaria = () => {
    return (
        <div className="relative min-h-screen ">

            <NavCategoria />
            <div className=" flex justify-center mt-20 md:mt-20">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight  font-montserrat_alternates text-2xl mt-10 md:text-4xl">INDUMENTARIA</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1  md:grid-cols-4 gap-44 md:gap-10">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col  hover:scale-110  items-center justify-center w-full h-96 p-8 md:p-8  transition-transform transform-gpu hover:scale-105 hover:transition-transform duration-300"
                            >
                                <img
                                    className="rounded-3xl mt-1 object-cover h-auto  md:h-96 md:w-screen"
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
            <div className="flex justify-center mt-32 gap-2 md:mt-20">
                <img className="w-10 h-10" src={insta} alt="" />
                <img className="w-10 h-10" src={facebook} alt="" />
            </div>
        </div>
    )
}

export default Indumentaria;