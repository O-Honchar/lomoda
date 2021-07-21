'use strict';

const headerCityButton = document.querySelector('.header__city-button');

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

headerCityButton.addEventListener('click', headerCityButtonHandler);
