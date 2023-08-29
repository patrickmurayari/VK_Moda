
const CardOfertas = ({ products }) => {
    return (
        <div className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 ">
                {products &&
                    products.map((elem, index) => (
                        <div
                            key={index}
                            className=" flex flex-col  items-center justify-center  w-full h-full p-4 md:p-8  transition-transform transform-gpu md:hover:scale-125 hover:transition-transform duration-300"
                        >
                            <div className="absolute md:top-9 top-5 md:right-16 right-14 md:right-10 z-50 bg-black text-white px-2 py-1">
                                ¡Oferta!
                            </div>
                            <img
                                className="  hover:saturate-150 mt-1 object-cover h-auto w-60 md:h-60 md:w-60"
                                src={elem.image}
                                alt="producto"
                            />
                            <div className="flex flex-col gap-2 items-center justify-start w-full">
                                <h6 data-aos="fade" data-aos-duration="3000"  className=" text-lg md:text-lg  font-extralight  text-center">{elem.name}</h6>
                                <div>
                                    <h3 data-aos="fade" data-aos-duration="3000"  className="font-bold items-center flex justify-center ">
                                        {elem.precio}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};


export default CardOfertas;