import NavCategoria from "../NavCategoria"
import indumentaria1 from "../../img/Productos/indumentaria/indumentaria1.jpg"
import indumentaria2 from "../../img/Productos/indumentaria/indumentaria2.jpg"
import indumentaria3 from "../../img/Productos/indumentaria/indumentaria1.jpg"
import indumentaria4 from "../../img/Productos/indumentaria/indumentaria2.jpg"
import indumentaria5 from "../../img/Productos/indumentaria/indumentaria1.jpg"
import indumentaria6 from "../../img/Productos/indumentaria/indumentaria2.jpg"
import insta from "../../img/insta.png"
import facebook from "../../img/facebook.png"

const products = [
    {
        id: 1,
        image: `${indumentaria1}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 2,
        image: `${indumentaria2}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 3,
        image: `${indumentaria3}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 4,
        image: `${indumentaria4}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 5,
        image: `${indumentaria5}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 6,
        image: `${indumentaria6}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 7,
        image: `${indumentaria1}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 8,
        image: `${indumentaria2}`,
        name: "VESTIDOS",
        // description: "$3519",
    },

]

const Indumentaria = () => {
    return (
        <div className="relative min-h-screen ">

            <NavCategoria />
            <div className=" flex justify-center mt-20 md:mt-20">
                <h1 className="text-black font-extralight  font-montserrat_alternates text-2xl mt-10 md:text-4xl">INDUMENTARIA</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1  md:grid-cols-4 gap-4 md:gap-10">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col  items-center justify-center w-full h-96 p-8 md:p-8  transition-transform transform-gpu hover:scale-105 hover:transition-transform duration-300"
                            >
                                <img
                                    className="hover:brightness-50 mt-1 object-cover h-auto  md:h-96 md:w-screen"
                                    src={elem.image}
                                    alt="producto"
                                />
                                <div className="flex flex-col gap-2 items-center justify-start w-full">
                                    <h6 className="text-2xl text-black md:text-2xl font-extralight font-montserrat_alternates text-center">
                                        {elem.name}
                                    </h6>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="flex justify-center  mt-10 gap-2 md:mt-6">
                <img className="w-10 h-10" src={insta} alt="" />
                <img className="w-10 h-10" src={facebook} alt="" />
            </div>
        </div>
    )
}

export default Indumentaria;