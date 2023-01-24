const API_URL = 'https:chocolate-fuzzy-chanter.glitch.me/';

/*
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const addPreload = (element) => {
    element.classList.add('preload');
};
const removePreload = (element) => {
    element.classList.remove('preload');
};


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
};


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

// --------------------------------------------------------
const renderPrice = (wrapper, data) => {
    data.forEach((item) => {
        const priceItem = document.createElement('li');
        priceItem.classList.add('price__item');

        // Отрисовываем СТОИМОСТЬ НАШИХ УСЛУГ
        priceItem.innerHTML = `
            <span class="price__item-text">${item.name}</span>
            <span class="price__item-count">${item.price} руб</span>
        `
        wrapper.append(priceItem);
    });
};

const renderService = (wrapper, data) => {
    const labels = data.map(item => {
            const label = document.createElement('label');
            label.classList.add('radio');

            label.innerHTML = `
                <input class="radio__input" type="radio" name="service" value="${item.id}">
                <span class="radio__label">${item.name}</span>
            `;
            return label;
    })
    wrapper.append(...labels);
};


const initService = () => {
    const priceList = document.querySelector('.price__list');
    const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
    priceList.textContent = ''; 
    addPreload(priceList);

    reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>'; 
    addPreload(reserveFieldsetService);

    // Получаем данные с сервера
    fetch(`${API_URL}/api`)
    .then(response => response.json())
    .then(data => {
        // Отрисовываем полученные данные блока СТОИМОСТЬ НАШИХ УСЛУГ
        renderPrice(priceList, data);
        removePreload(priceList);
        return data;
    })
    .then(data => {
        renderService(reserveFieldsetService, data);
        removePreload(reserveFieldsetService);
        return data;
    })

};

const addDisabled = (arr) => {
    arr.forEach(element => {
        element.disabled = true;
        })
};

const removeDisabled = (arr) => {
    arr.forEach(element => {
        element.disabled = false;
        })
};

const renderSpec = (wrapper, data) => {
    const labels = data.map(item => {
            const label = document.createElement('label');
            label.classList.add('radio');

            label.innerHTML = `
                <input class="radio__input" type="radio" name="spec" value="${item.id}">
                <span class="radio__label radio__label_spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
            `;
            return label;
    })
    wrapper.append(...labels);
};

const renderMonth = (wrapper, data) => {
    const labels = data.map((item) => {
        const label = document.createElement('label');
        label.classList.add('radio');

        label.innerHTML = `
            <input class="radio__input" type="radio" name="month" value="${item}">
            <span class="radio__label">${
                new Intl.DateTimeFormat('ru-RU', {
                    month: 'long'
                }).format(new Date(item))}</span>
                `;
        return label;
    });
    wrapper.append(...labels);
};

const renderDay = (wrapper, data, month) => {
    const labels = data.map((day) => {
        const label = document.createElement('label');
        label.classList.add('radio');

        label.innerHTML = `
            <input class="radio__input" type="radio" name="day" value="${day}">
            <span class="radio__label">${
                new Intl.DateTimeFormat('ru-RU', {
                    month: 'long', day : "numeric"
                }).format(new Date(`${month}/${day}`))}</span>
                `;
        return label;
    });
    wrapper.append(...labels);
};

const renderTime = (wrapper, data) => {
    const labels = data.map((time) => {
        const label = document.createElement('label');
        label.classList.add('radio');

        label.innerHTML = `
            <input class="radio__input" type="radio" name="time" value="${time}">
            <span class="radio__label">${time}</span>
                `;
        return label;
    });
    wrapper.append(...labels);
};


const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form');
    const {fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn,} = reserveForm;

    addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn,]);

    reserveForm.addEventListener('change', async event => {
        const target = event.target;

        if (target.name === 'service') {
            addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);
            fieldspec.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
            addPreload(fieldspec);
            // Запрос на сервер
            const response = await fetch (`${API_URL}/api?service=${target.value}`);
            // Получение ответа
            const data = await response.json();
            
            renderSpec(fieldspec, data);
            removePreload(fieldspec);
            removeDisabled([fieldspec]);
        }

        if (target.name === 'spec') {
            addDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn]);
            addPreload(fieldmonth);
            
            const response = await fetch (`${API_URL}/api?spec=${target.value}`);
            
            const data = await response.json();
            fieldmonth.textContent = '';
            renderMonth(fieldmonth, data);
            removePreload(fieldmonth);
            removeDisabled([fielddata, fieldmonth]);
        }

        if (target.name === 'month') {
            addDisabled([fieldday, fieldtime, btn]);
            addPreload(fieldday);
            
            const response = await fetch (`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`);
            
            const data = await response.json();
            fieldday.textContent = '';
            renderDay(fieldday, data, reserveForm.month.value);
            removePreload(fieldday);
            removeDisabled([fieldday]);
        }

        if (target.name === 'day') {
            addDisabled([fieldtime, btn]);
            addPreload(fieldtime);
            
            const response = await fetch (`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
            
            const data = await response.json();
            fieldtime.textContent = '';
            renderTime(fieldtime, data,);
            removePreload(fieldtime);
            removeDisabled([fieldtime]);
        }

        if (target.name === 'time') {
            removeDisabled([btn]);
        }

    // reserveForm.addEventListener('', => {}
    })
};
// --------------------------------------------------------
const init = () => {

    initSlider();
    initService();
    initReserve();
};


window.addEventListener('DOMContentLoaded', init);

