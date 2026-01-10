import MapaContacto from "../common/MapaContacto";
import { FiMapPin, FiClock, FiPhone, FiMail } from "react-icons/fi";

function SeccionContacto() {
    return (
        <div className='p-4 md:p-12 bg-neutral-50 rounded-xl shadow-elegant mt-8 md:mt-12' id="contactos">
            <div className='max-w-4xl mx-auto'>
                <h1 className='text-center text-3xl md:text-5xl font-elegant font-bold text-primary-900 mt-6 mb-2 tracking-wide'>Contáctanos</h1>
                <div className="w-24 h-1 bg-accent-600 mx-auto mb-12 rounded-full"></div>
                
                <div className="space-y-8 md:grid md:grid-cols-2 md:gap-10 md:items-start md:space-y-0">
                    {/* Información de Contacto */}
                    <div className='text-neutral-700 space-y-6 max-w-2xl mx-auto md:max-w-none md:mx-0'>
                        <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                            <FiMapPin className='text-accent-600 text-2xl mt-1 flex-shrink-0' />
                            <div>
                                <p className='font-semibold text-primary-900 text-lg'>Visítanos en:</p>
                                <p className='text-neutral-600 mt-1 font-medium'>V&A DISEÑO Y MODA</p>
                                <p className='text-neutral-600 text-sm'>Localidad: Zona Sur, Buenos Aires</p>
                                <p className='text-neutral-600 text-sm'>Argentina</p>
                                <a 
                                    href="https://www.google.com/maps/place/V%26A+DISE%C3%91O+Y+MODA/@-34.44548603723854,-58.98292763996581,15z/data=!4m6!3m5!1s0x95bc830071a4eb65:0x6abb3b406ef6f180!8m2!3d-34.44548603723854!4d-58.98292763996581!16s%2Fg%2F11s5v5v5v5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='text-accent-600 hover:text-primary-900 text-xs font-semibold mt-2 inline-block transition-colors'
                                >
                                    Ver en Google Maps →
                                </a>
                            </div>
                        </div>

                        <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                            <FiClock className='text-accent-600 text-2xl mt-1 flex-shrink-0' />
                            <div>
                                <p className='font-semibold text-primary-900 text-lg'>Nuestros Horarios:</p>
                                <p className='text-neutral-600 mt-1'>Lunes a Viernes: 10:00 - 13:00 | 16:00 - 20:00</p>
                                <p className='text-neutral-600'>Sábados: 10:00 - 13:00 | 16:00 - 20:00</p>
                                <p className='text-neutral-600 text-sm mt-2'>Domingos: Cerrado</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                            <FiPhone className='text-accent-600 text-2xl mt-1 flex-shrink-0' />
                            <div>
                                <p className='font-semibold text-primary-900 text-lg'>Llámanos:</p>
                                <a href="tel:+541126073801" className='text-accent-600 hover:text-accent-700 font-semibold mt-1 transition-colors'>
                                    (+54) 11 2607-3801
                                </a>
                            </div>
                        </div>

                        <div className='flex items-start gap-4 p-4 bg-white rounded-lg shadow-elegant hover:shadow-elegant-lg transition-shadow'>
                            <FiMail className='text-accent-600 text-2xl mt-1 flex-shrink-0' />
                            <div>
                                <p className='font-semibold text-primary-900 text-lg'>Escríbenos:</p>
                                <a href="mailto:murayarivirginia797@gmail.com" className='text-accent-600 hover:text-accent-700 font-semibold mt-1 transition-colors break-all'>
                                    murayarivirginia797@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Mapa */}
                    <div className="mt-12 md:mt-0">
                        <h3 className='text-center md:text-left text-2xl font-semibold text-primary-900 mb-6'>Ubicación</h3>
                        <div className="rounded-lg overflow-hidden shadow-elegant">
                            <MapaContacto />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeccionContacto;
