import vestidos from "../../img/Categoria/joya2.jpg"

const products = [
    {
        id: 1,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 2,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 3,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 4,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 5,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 6,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 7,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },
    {
        id: 8,
        image: `${vestidos}`,
        name: "VESTIDOS",
        // description: "$3519",
    },

]

const Vestidos = () => {
    return (
        <div>
            <div className="bg-red-500">
                <h1 >Vestidossss</h1>
            </div>
            <div className="mt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">
                    {products &&
                        products.map((elem, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center w-full h-96 p-4 md:p-8 bg-red-200 transition-transform transform-gpu hover:scale-105 hover:transition-transform duration-300"
                            >
                                <img
                                    className="hover:brightness-50 mt-1 object-cover h-auto  md:h-60 md:w-screen"
                                    src={elem.image}
                                    alt="producto"
                                />
                                <div className="flex flex-col gap-2 items-center justify-start w-full">
                                    <h6 className="text-lg md:text-2xl font-extralight font-montserrat_alternates text-center">
                                        {elem.name}
                                    </h6>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Vestidos;