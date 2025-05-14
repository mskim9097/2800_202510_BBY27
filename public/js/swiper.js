const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1.2,
    spaceBetween: 13,
    freeMode: true,
    grabCursor: true,
        breakpoints: {
            300: {
                slidesPerView: 1,
            },
            350: {
                slidesPerView: 1.2,
            },
            450: {
                slidesPerView: 1.8,
            },
            768: {
                slidesPerView: 2.5,
            },
            1024: {
                slidesPerView: 3,
            },
        }
});
setTimeout(() => {
    swiper.update();
}, 100);