import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import foto0 from "../../img/Coleccion/coleccionPic1.jpg"
import foto1 from "../../img/Coleccion/coleccionPic111.jpg"
import foto1b from "../../img/Coleccion/coleccionPic2.jpg"
import foto2 from "../../img/Coleccion/coleccionPic21.jpg"
import foto3 from "../../img/Coleccion/coleccionPic23.jpg"
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function CarrouselSwip() {
  return (
    <div className="w-full">
      {/* Mobile: ancho completo, Desktop: contenedor con max-width */}
      <div className="md:container md:mx-auto md:px-4 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full md:max-w-7xl relative">
            {/* Botones de navegación */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-accent-600 text-primary-900 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-elegant hover:shadow-elegant-lg -ml-4 md:-ml-6 lg:-ml-8">
              <FiChevronLeft className="text-xl md:text-2xl" />
            </button>

            <Swiper
              modules={[Navigation, Pagination, A11y, Autoplay, EffectCoverflow]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                el: '.swiper-pagination-custom',
              }}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 0 },
                640: { slidesPerView: 1, spaceBetween: 0 },
                768: { slidesPerView: 1.3, spaceBetween: 16 },
                1024: { slidesPerView: 1.8, spaceBetween: 20 },
                1280: { slidesPerView: 2, spaceBetween: 24 },
              }}
              className="rounded-none overflow-visible"
            >
              <SwiperSlide>
                <div className="relative overflow-hidden group h-96 md:h-[500px]">
                  <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    src={foto0} 
                    alt="Colección 2026" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-elegant font-bold tracking-wide">Nueva Colección 2026</h3>
                    <p className="text-white/90 text-sm md:text-base mt-3 font-light">Estilo actual, detalles que enamoran</p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative overflow-hidden group h-96 md:h-[500px]">
                  <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    src={foto1} 
                    alt="Colección 1" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-elegant font-bold tracking-wide">Colección Primavera</h3>
                    <p className="text-white/90 text-sm md:text-base mt-3 font-light">Descubre las nuevas tendencias</p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative overflow-hidden group h-96 md:h-[500px]">
                  <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    src={foto1b} 
                    alt="Colección 2026 - Look" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-elegant font-bold tracking-wide">Looks listos para salir</h3>
                    <p className="text-white/90 text-sm md:text-base mt-3 font-light">Combinaciones que realzan tu silueta</p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative overflow-hidden group h-96 md:h-[500px]">
                  <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    src={foto2} 
                    alt="Colección 2" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-elegant font-bold tracking-wide">Diseño Exclusivo</h3>
                    <p className="text-white/90 text-sm md:text-base mt-3 font-light">Piezas únicas y elegantes</p>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="relative overflow-hidden group h-96 md:h-[500px]">
                  <img 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                    src={foto3} 
                    alt="Colección 3" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-elegant font-bold tracking-wide">Moda Contemporánea</h3>
                    <p className="text-white/90 text-sm md:text-base mt-3 font-light">Estilo y sofisticación</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/95 hover:bg-accent-600 text-primary-900 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-elegant hover:shadow-elegant-lg -mr-4 md:-mr-6 lg:-mr-8">
              <FiChevronRight className="text-xl md:text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Paginación personalizada - Centrada y moderna */}
      <div className="swiper-pagination-custom flex justify-center items-center gap-4 mt-10 px-4">
        <div className="swiper-pagination-bullet w-2.5 h-2.5 bg-neutral-400 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600 hover:scale-125"></div>
        <div className="swiper-pagination-bullet w-2.5 h-2.5 bg-neutral-400 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600 hover:scale-125"></div>
        <div className="swiper-pagination-bullet w-2.5 h-2.5 bg-neutral-400 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600 hover:scale-125"></div>
      </div>
    </div>
  )
}

export default CarrouselSwip;
