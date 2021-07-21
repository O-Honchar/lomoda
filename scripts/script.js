'use strict';

const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

// ------- city button -------
headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

const capitalize = (str) =>
    str.replace(/(^|\s)\S/g, letter => letter.toUpperCase());

const headerCityButtonHandler = () => {
    let city = prompt('Укажите Ваш город:')?.trim(); 
    if (city) {
        city = capitalize(city);
        headerCityButton.textContent = city;
        localStorage.setItem('lomoda-location', city);
    }
};

// ------- cart modal window -------
const cartModalOpenHandler = () => {
    cartOverlay.classList.add('cart-overlay-open');
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
};

const cartModalCloseHandler = event => {
    const target = event.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose();
    }
};

const cartModalCloseByEscHandler = event =>  {
    const eventKey = event.key || event.code;
    if (eventKey === 'Escape') {
        cartModalClose();
    }
};

headerCityButton.addEventListener('click', headerCityButtonHandler);

subheaderCart.addEventListener('click', cartModalOpenHandler);

cartOverlay.addEventListener('click', cartModalCloseHandler);

document.addEventListener('keydown', cartModalCloseByEscHandler);
