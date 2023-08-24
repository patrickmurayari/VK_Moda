import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import foto1 from "../img/Categoria/bolsofoto.jpg"
import foto2 from "../img/Categoria/fotojoyas.jpg"

function CarrouselSwip() {
  return (
    <div className="container"> {/* Agrega una clase contenedora para centrar */}
      <div className="row">
        <div className="col-lg-8 mx-auto"> {/* Utiliza una columna centrada */}
          <Swiper
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            <SwiperSlide><img className='w-100' src={foto1} alt="" /></SwiperSlide>
            <SwiperSlide><img className='w-100' src={foto2} alt="" /></SwiperSlide>
            <SwiperSlide>Slide 3</SwiperSlide>
            <SwiperSlide>Slide 4</SwiperSlide>
            {/* ... Agrega más diapositivas según sea necesario */}
          </Swiper>
        </div>
      </div>
    </div>
  )
}

export default CarrouselSwip;
