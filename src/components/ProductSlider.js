// src/components/ProductSlider.js
import 'swiper/css/navigation'
import 'swiper/css';
import 'swiper/css/zoom'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import arrow from '../../public/icons/arrow.svg'

const ProductSlider = ({ images, productName }) => {

  if (!Array.isArray(images) || images.length === 0) {
    return <p>Нет изображений</p>;  // Если нет слайдов, можно показать это сообщение
  }

  console.log(images)

  return (
    <div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-left',
          prevEl: '.swiper-button-right'
        }}
        className='relative'
        centeredSlides={true}
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index}
          >
              <Image
                src={img}
                alt={productName}
                layout='intrinsic'
                width={400}
                height={500}
                className="object-cover rounded-md cursor-pointer m-auto"
                loading="lazy"
              />
          </SwiperSlide>
        ))}

        <Image
          src={arrow}
          alt='arrow'
          width={30}
          className='swiper-button-left'
        />

        <Image
          src={arrow}
          alt='arrow'
          height={30}
          className='swiper-button-right'
        />

      </Swiper>

    </div>

    // <Slider {...{
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   arrows: true,
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 3,
    //       }
    //     },
    //     {
    //       breakpoint: 768,
    //       settings: {
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //       }
    //     }
    //   ]
    // }}>
    //   {images.map((img, index) => (
    //     <div key={index}>
    //       <Image
    //         src={img}
    //         alt={productName}
    //         layout="intrinsic"
    //         width={400}
    //         height={500}
    //         className="object-cover rounded-md cursor-pointer"
    //         loading="lazy"
    //       />
    //     </div>
    //   ))}
    // </Slider>
  );
};

export default ProductSlider;