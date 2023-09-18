// import vestidos from "../../img/Categoria/fotovestido.jpg"
import NavCategoria from "../NavCategoria"
import joya1 from "../../img/Productos/joyas/joya1.jpg"
import joya2 from "../../img/Productos/joyas/joya2.jpg"
import joya3 from "../../img/Productos/joyas/joya3.jpg"
import joya4 from "../../img/Productos/joyas/joya4.jpg"
import joya5 from "../../img/Productos/joyas/joya5.jpg"
import joya6 from "../../img/Productos/joyas/joya6.jpg"
import joya7 from "../../img/Productos/joyas/joya7.jpg"

import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

const products = [
    {
        id: 1,
        image: `${joya1}`,
        name: "Collar / Colgantes",
        precio: "$3519",
    },
    {
        id: 2,
        image: `${joya2}`,
        name: "Collar / Colgantes",
        precio: "$3519",
    },
    {
        id: 3,
        image: `${joya3}`,
        name: "Collar",
        precio: "$3519",
    },
    {
        id: 4,
        image: `${joya4}`,
        name: "Collar",
        precio: "$3519",
    },
    {
        id: 5,
        image: `${joya5}`,
        name: "Colgante",
        precio: "$3519",
    },
    {
        id: 6,
        image: `${joya6}`,
        name: " Collar",
        precio: "$3519",
    },
    {
        id: 7,
        image: `${joya7}`,
        name: "VESTIDOS",
        precio: "$3519",
    },

]

const Joyeria = () => {
    return (
        <div className="relative min-h-screen ">

            <NavCategoria />
            <div className=" flex justify-center mt-20 md:mt-20">
                <h1 data-aos="zoom-in-right" data-aos-duration="1500" className="text-black font-extralight  font-montserrat_alternates text-2xl mt-10 md:text-4xl">JOYERIA</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1  md:grid-cols-4 gap-24 md:gap-10">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col  hover:scale-110 items-center justify-center w-full h-96 p-8 md:p-8  transition-transform transform-gpu hover:transition-transform duration-300"
                            >
                                <img
                                    className="rounded-3xl mt-1 object-cover h-96  md:h-96 md:w-screen"
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
            <div className="flex mt-24 justify-center gap-2 md:mt-20">
                <img className="w-10 h-10" src={insta} alt="" />
                <img className="w-10 h-10" src={facebook} alt="" />
            </div>
        </div>
    )
}

export default Joyeria;