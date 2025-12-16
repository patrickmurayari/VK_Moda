import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import foto1 from "../../img/Coleccion/coleccionPic111.jpg"
import foto2 from "../../img/Coleccion/coleccionPic21.jpg"
import foto3 from "../../img/Coleccion/coleccionPic23.jpg"
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function CarrouselSwip() {
  return (
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex justify-center">
        <div className="w-full max-w-7xl relative">
          {/* Botones de navegación personalizados */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-accent-600 text-primary-900 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-elegant hover:shadow-elegant-lg -ml-6 md:-ml-8">
            <FiChevronLeft className="text-2xl" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay, EffectCoverflow]}
            spaceBetween={30}
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
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 1.5, spaceBetween: 24 },
              1024: { slidesPerView: 2, spaceBetween: 30 },
              1280: { slidesPerView: 2.2, spaceBetween: 30 },
            }}
            className="rounded-none overflow-visible"
          >
            <SwiperSlide>
              <div className="relative overflow-hidden group h-96 md:h-[500px]">
                <img 
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                  src={foto1} 
                  alt="Colección 1" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl font-elegant font-semibold">Colección Primavera</h3>
                  <p className="text-white/80 text-sm mt-2">Descubre las nuevas tendencias</p>
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl font-elegant font-semibold">Diseño Exclusivo</h3>
                  <p className="text-white/80 text-sm mt-2">Piezas únicas y elegantes</p>
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl font-elegant font-semibold">Moda Contemporánea</h3>
                  <p className="text-white/80 text-sm mt-2">Estilo y sofisticación</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-accent-600 text-primary-900 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-elegant hover:shadow-elegant-lg -mr-6 md:-mr-8">
            <FiChevronRight className="text-2xl" />
          </button>

          {/* Paginación personalizada */}
          <div className="swiper-pagination-custom flex justify-center gap-3 mt-8">
            <div className="swiper-pagination-bullet w-3 h-3 bg-neutral-300 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600"></div>
            <div className="swiper-pagination-bullet w-3 h-3 bg-neutral-300 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600"></div>
            <div className="swiper-pagination-bullet w-3 h-3 bg-neutral-300 rounded-full cursor-pointer transition-all duration-300 hover:bg-accent-600"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarrouselSwip;
