import React from 'react'
import { ArrowRightStroke } from '@boxicons/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/a11y';


const ReviewSection = () => {
  return (
    <section id="customer" className="py-3 py-lg-4 ">
        <div className="container py-4 py-lg-5">
            <div className="d-md-flex align-items-center justify-content-between gap-4 mb-4">
                <div className="section-header">
                    <span className="srv-subtitle mb-3">Customer testimonials</span>
                    <h3 className="mb-2 fw-light">Connecting global markets, <span className="fw-bold">Delivering <span className="d-none d-lg-block"></span>Opportunities</span></h3>
                    <p>we are a dynamic and customer-centric export and import business committed to providing high-quality products and seamless trade solutions. With a passion for fostering global partnerships, we bridge the gap between India and the world, ensuring that goods flow effortlessly across borders.</p>
                </div>
                <div className="py-2">
                    <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">View All Treatments <ArrowRightStroke size={24} className="ms-2" /></a>
                </div>
            </div>
            <Swiper modules={[Navigation, Pagination, Autoplay, A11y]} a11y autoplay navigation spaceBetween={30} slidesPerView={3} onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)} breakpoints={{320:{slidesPerView:1,spaceBetween:10,},480:{slidesPerView:2,spaceBetween:15,},
    768: {slidesPerView: 3,spaceBetween: 20,},}}>
                <SwiperSlide>
                    <div className="swiper-slide h-auto mb-4">
                        <div className="rounded-4 p-4 h-100 border weCare-box">
                            <p className="mb-0">"We Care India Group has been an exceptional partner in our import-export journey. Their professionalism, attention to detail, and commitment to quality have made them a trusted ally in our global trade endeavors."</p>
                            <div className="mt-3 mb-0 d-flex align-items-center gap-2">
                                <img src="./media/canada.webp" alt="Client 1" className="rounded-circle object-fit-cover ms-3" width="60" height="60" />
                                <span className="fs-6 fw-light">-Alice Patterson, Vancouver <br /><strong>Canada</strong></span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="swiper-slide h-auto mb-4">
                        <div className="rounded-4 p-4 h-100 border weCare-box">
                            <p className="mb-0">"We Care India Group has been an exceptional partner in our import-export journey. Their professionalism, attention to detail, and commitment to quality have made them a trusted ally in our global trade endeavors."</p>
                            <div className="mt-3 mb-0 d-flex align-items-center gap-2">
                                <img src="./media/canada.webp" alt="Client 1" className="rounded-circle object-fit-cover ms-3" width="60" height="60" />
                                <span className="fs-6 fw-light">-Alice Patterson, Vancouver <br /><strong>Canada</strong></span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="swiper-slide h-auto mb-4">
                        <div className="rounded-4 p-4 h-100 border weCare-box">
                            <p className="mb-0">"We Care India Group has been an exceptional partner in our import-export journey. Their professionalism, attention to detail, and commitment to quality have made them a trusted ally in our global trade endeavors."</p>
                            <div className="mt-3 mb-0 d-flex align-items-center gap-2">
                                <img src="./media/canada.webp" alt="Client 1" className="rounded-circle object-fit-cover ms-3" width="60" height="60" />
                                <span className="fs-6 fw-light">-Alice Patterson, Vancouver <br /><strong>Canada</strong></span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="swiper-slide h-auto mb-4">
                        <div className="rounded-4 p-4 h-100 border weCare-box">
                            <p className="mb-0">"We Care India Group has been an exceptional partner in our import-export journey. Their professionalism, attention to detail, and commitment to quality have made them a trusted ally in our global trade endeavors."</p>
                            <div className="mt-3 mb-0 d-flex align-items-center gap-2">
                                <img src="./media/canada.webp" alt="Client 1" className="rounded-circle object-fit-cover ms-3" width="60" height="60" />
                                <span className="fs-6 fw-light">-Alice Patterson, Vancouver <br /><strong>Canada</strong></span>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
     </section>   
  )
}
export default ReviewSection