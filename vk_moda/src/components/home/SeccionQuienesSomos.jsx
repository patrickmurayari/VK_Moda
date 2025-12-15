import fotoabout from "../../img/fotoabout11.jpg"
import about from "../../img/about1.jpg"

function SeccionQuienesSomos() {
    return (
        <div className="container mx-auto mt-20">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                <div data-aos="zoom-in" data-aos-duration="1500" className="md:w-1/2 mb-4 md:mb-0">
                    <img
                        className="w-full h-auto"
                        src={fotoabout}
                        alt="quienes somos"
                    />
                </div >
                <div data-aos="fade-up" data-aos-duration="1500" className="md:w-1/2 md:ml-12">
                    <h2 className="text-primary-900 font-elegant text-3xl md:text-4xl font-bold tracking-wide">Quiénes Somos</h2>
                    <div className="w-16 h-1 bg-accent-600 mt-4 rounded-full"></div>
                    <div id="Quienes-somos">
                        <p className="text-neutral-600 mt-8 leading-relaxed text-base md:text-lg">
                            Somos una marca con más de 20 años de experiencia en el mundo de la moda e indumentaria.
                            Nos enorgullece ofrecer una amplia gama de estilos, tallas y diseños que se adaptan a todos los gustos y
                            ocasiones.
                        </p>
                        <p className="text-neutral-600 mt-6 leading-relaxed text-base md:text-lg">
                            Nuestra pasión por la moda no se limita solo a ofrecer productos de alta calidad, sino que también nos destacamos
                            en la creación de prendas únicas que reflejen tu estilo personal. Nuestro equipo de expertos en diseño y confección
                            está listo para convertir tus ideas en realidad. Desde diseños personalizados que se ajustan perfectamente a tu
                            visión hasta adaptaciones únicas de prendas existentes, estamos comprometidos a brindarte una experiencia de moda
                            verdaderamente personalizada.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-20">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <div data-aos="fade-down" data-aos-duration="1500" className="md:w-3/4">
                            <h2 className="text-primary-900 font-elegant text-3xl md:text-4xl font-bold tracking-wide">Por Qué Elegirnos</h2>
                            <div className="w-16 h-1 bg-accent-600 mt-4 rounded-full"></div>
                            <p className="text-neutral-600 mt-8 leading-relaxed text-base md:text-lg">
                                Lo que nos distingue es nuestro compromiso con la calidad y la atención al detalle. Cada prenda que vendemos
                                y creamos está cuidadosamente elaborada para asegurarnos de que te sientas cómodo, seguro y elegante en
                                cada ocasión.
                            </p>
                            <p className="text-neutral-600 mt-6 leading-relaxed text-base md:text-lg">
                                Sabemos que la moda es una forma de expresión personal, y estamos aquí para ayudarte a
                                expresarte de la mejor manera posible.
                            </p>
                        </div>
                    </div>
                    <div data-aos="zoom-in" data-aos-duration="1500" className="md:w-1/2 md:ml-8">
                        <img
                            className="w-full h-auto"
                            src={about}
                            alt="Nuestra empresa"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeccionQuienesSomos;
