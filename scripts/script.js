'use strict';

const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

let hash = location.hash.substring(1);

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

// ------- request to DB -------
const getData = async () => {
    const response = await fetch('db.json');
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
};

const getGoods = (callback, property, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item[property] === value));
            } else {
                callback(data);
            }
        })
        .catch(err => {
            console.error(err);
        });
};

headerCityButton.addEventListener('click', headerCityButtonHandler);

subheaderCart.addEventListener('click', cartModalOpenHandler);

cartOverlay.addEventListener('click', cartModalCloseHandler);

document.addEventListener('keydown', cartModalCloseByEscHandler);

// ------- goods page -------
try {
    const goodsList = document.querySelector('.goods__list');
    if (!goodsList) {
        throw 'This is not a goods page!';
    }

    const goodsTitle = document.querySelector('.goods__title');
    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
    };

    const createCard = ({id, preview, cost, brand, name, sizes}) => {
        const li =
        `
            <li class="goods__item">
                <article class="good">
                    <a class="good__link-img" href="card-good.html#${id}">
                        <img class="good__img" src="goods-image/${preview}" alt="${brand} ${name}">
                    </a>
                    <div class="good__description">
                        <p class="good__price">${cost} &#8372;</p>
                        <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                        ${sizes
                            ? `<p class="good__sizes">Размеры (UKR): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`
                            : ''}
                        <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                    </div>
                </article>
            </li>
        `;

        return li;
    };

    const renderGoodsList = data => {
        const list = data.reduce(
            (acc, item) => acc + createCard(item), ''
        );
        goodsList.textContent = '';
        goodsList.insertAdjacentHTML('beforeend', list);
    };

    const locationHandler = () => {
        hash = location.hash.substring(1);
        changeTitle();
        getGoods(renderGoodsList, 'category', hash);
    };

    changeTitle();
    getGoods(renderGoodsList, 'category', hash);

    window.addEventListener('hashchange', locationHandler);

} catch (err) {
    console.warn(err);
}

// ------- product page -------
try {
    const cardGood = document.querySelector('.card-good');
    if (!cardGood) {
        throw 'This is not a product page!';
    }

    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');

    const renderSelectList = (selectList, data) => {
        const list = data.reduce(
            // (acc, item, idx) => acc + `<li class="card-good__select-item" data-id="${idx}">${item}</li>`, ''
            (acc, item) => acc + `<li class="card-good__select-item">${item}</li>`, ''
        );
        selectList.textContent = '';
        selectList.insertAdjacentHTML('beforeend', list);
    };

    const renderCardGood = ([{photo, brand, name, cost, color, sizes}]) => {
        cardGoodImage.src = `./goods-image/${photo}`;
        cardGoodImage.alt = `${brand} ${name}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₴`;
        if (color) {
            cardGoodColor.textContent = color[0];
            // cardGoodColor.dataset.id = 0;
            renderSelectList(cardGoodColorList, color);
        } else {
            cardGoodColor.hidden = true;
        }
        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            // cardGoodSizes.dataset.id = 0;
            renderSelectList(cardGoodSizesList, sizes);
        } else {
            cardGoodSizes.hidden = true;
        }
    };

    getGoods(renderCardGood, 'id', hash);

    cardGoodSelectWrapper.forEach(item =>
        item.addEventListener('click', event => {
            const target = event.target;

            if (target.classList.contains('card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }

            if (target.classList.contains('card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                // cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        })
    );

} catch (err) {
    console.warn(err);
}
