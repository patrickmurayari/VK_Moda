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
    <div className="container"> {/* Agrega una clase contenedora para centrar */}
      <div className="row">
        <div className="col-lg-8 md:flex mx-auto"> {/* Utiliza una columna centrada */}
          <Swiper
           modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
            spaceBetween={2}
            slidesPerView={1}
            navigation
            autoplay={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            autoHeight={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            <SwiperSlide><img className='w-100' src={foto1} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto4} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto6} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto2} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto5} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto3} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto7} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto8} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto11} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto9} alt="" /></SwiperSlide>
            {/* ... Agrega más diapositivas según sea necesario */}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default CarrouselSwip;
