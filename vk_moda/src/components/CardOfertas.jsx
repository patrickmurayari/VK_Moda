
const CardOfertas = ({ products }) => {
    return (
        <div className="mt-20">
            
       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 ">
            {products &&
                products.map((elem, index) => (
                    <div
                        key={index}
                        className=" flex flex-col  items-center justify-center  w-full h-full p-4 md:p-8  transition-transform transform-gpu hover:scale-125 hover:transition-transform duration-300"
                    >
                         <div className="absolute top-5 right-0 md:right-10 z-50 bg-black text-white px-2 py-1">
                                Oferta
                            </div>
                        <img
                            className="  hover:brightness-50 mt-1 object-cover h-auto w-60 md:h-60 md:w-60"
                            src={elem.image}
                            alt="producto"
                        />
                        <div className="flex flex-col gap-2 items-center justify-start w-full">
                            <h6 className=" text-lg md:text-2xl  font-extralight font-montserrat_alternates   text-center">{elem.name}</h6>
                            
                        </div>
                    </div>
                ))}
        </div>
        </div>
    );
};


export default CardOfertas;