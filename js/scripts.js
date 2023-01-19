const addPreload = (element) => {
    element.classList.add('preload');
}

const removePreload = (element) => {
    element.classList.remove('preload');
}


const startSlider = () => {
    const sliderItems = document.querySelectorAll('.slider__item');
    const sliderList = document.querySelector('.slider__list');
    const btnPrevSlid = document.querySelector('.slider__arrow_left');
    const btnNextSlid = document.querySelector('.slider__arrow_right');
    

    let activeSlide = 1;
    let position = 0;
// --------------------------------------------------------
    const checkSlide = () => {
        // document.documentElement.offsetWidth узнаем какого размера страница клиента 
        if ((activeSlide + 2 === sliderItems.length && document.documentElement.offsetWidth > 560) || (activeSlide === sliderItems.length)) {
            btnNextSlid.style.display = 'none';
        } else {
            btnNextSlid.style.display = '';
        }


        if (activeSlide === 1) {
            btnPrevSlid.style.display = 'none';
        } else {
            btnPrevSlid.style.display = '';
        }
        
    }
    checkSlide();


    const nextSlid = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * activeSlide;

        sliderList.style.transform =`translateX(${position}px)`
        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlide();
    }

    const prevSlid = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');
        position = -sliderItems[0].clientWidth * (activeSlide - 1 - 1);

        sliderList.style.transform =`translateX(${position}px)`;
        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlide();
    }

    btnPrevSlid.addEventListener('click', prevSlid);
    btnNextSlid.addEventListener('click', nextSlid);

    
    window.addEventListener('resize', () => {
        if (activeSlide + 2 > sliderItems.length && 
            document.documentElement.offsetWidth > 560) {
            activeSlide = sliderItems.length - 2;
            sliderItems[activeSlide]?.classList.add('slider__item_active');
        }

        position = -sliderItems[0].clientWidth * (activeSlide - 1);
        sliderList.style.transform =`translateX(${position}px)`;
        checkSlide();
    });
}


// --------------------------------------------------------
const initSlider = () => {
    const slider = document.querySelector('.slider');
    const sliderContainer = document.querySelector('.slider__container');


    sliderContainer.style.display = 'none';
    addPreload(slider);

    
    // Вызываем f только после полной загрузки стр(addEventListener слушает load/загрузку)
    window.addEventListener('load' , () => {
        sliderContainer.style.display = '';
        removePreload(slider);
        startSlider();
    });
};

window.addEventListener('DOMContentLoaded', initSlider);

