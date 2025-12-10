import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import foto1 from "../img/Coleccion/coleccionPic1.jpg"
import foto2 from "../img/Coleccion/coleccionPic2.jpg"
import foto3 from "../img/Coleccion/coleccionPic3.jpg"
import foto4 from "../img/Coleccion/coleccionPic4.jpg"
import foto5 from "../img/Coleccion/coleccionPic5.jpg"
import foto6 from "../img/Coleccion/coleccionPic6.jpg"
import foto7 from "../img/Coleccion/coleccionPic7.jpg"
import foto8 from "../img/Coleccion/coleccionPic8.jpg"
import foto9 from "../img/Coleccion/coleccionPic9.jpg"
import foto11 from "../img/Coleccion/coleccionPic11.jpg"

import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay'
function CarrouselSwip() {
  return (
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            scrollbar={{ draggable: true }}
            autoHeight={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="rounded-lg overflow-hidden shadow-elegant-lg"
          >
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto1} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto4} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto6} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto2} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto5} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto3} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto7} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto8} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto11} alt="Colección" />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative overflow-hidden rounded-lg shadow-elegant group">
                <img className='w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110' src={foto9} alt="Colección" />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default CarrouselSwip;
