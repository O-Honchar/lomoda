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

// ------- scroll lock when cart is open -------
const disableScroll = () => {
    // document.body.style.overflow = 'hidden';
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText =
    `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableScroll = () => {
    // document.body.style.overflow = '';
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    });
};

// ------- cart modal window -------
const cartModalOpenHandler = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
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
