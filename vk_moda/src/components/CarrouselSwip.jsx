import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import foto1 from "../img/foto1.jpg"
import foto2 from "../img/foto2.jpg"
function CarrouselSwip() {
  return (
    <div >
        <Swiper
         
      spaceBetween={40}
      slidesPerView={1}
     
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide><img className='w-screen' src={foto1} alt="" /></SwiperSlide>
      <SwiperSlide><img src={foto2} alt="" /></SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      ...
    </Swiper>
    </div>
  )
}

export default CarrouselSwip
