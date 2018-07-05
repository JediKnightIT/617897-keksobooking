'use strict';

(function () {
  // Создаём переменную с кодом клавиши ESC
  var ESC_KEYCODE = 27;

  // Создаём объекты с данными
  var translationRealEstateTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var photoElementData = {
    CLASS: 'popup__photo',
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья'
  };

  var cardActive;

  // Находим элементы в разметке и присваиваем их переменным
  var map = document.querySelector('.map');

  var template = document.querySelector('template');

  var cardTemplate = template.content.querySelector('.map__card');

  var similarCardElement = document.querySelector('.map__filters-container');

  // Функция, возвращающая новый DOM узел (элемент списка)
  var createFeatureElement = function (modifier) {
    var newFeatureElement = document.createElement('li');
    newFeatureElement.classList.add('popup__feature', 'popup__feature--' + modifier);

    return newFeatureElement;
  };

  // Функция, возвращающая новый DOM узел (изображение)
  var createPhotoElement = function (pathPhoto) {
    var newPhotoElement = document.createElement('img');
    newPhotoElement.classList.add(photoElementData.CLASS);
    newPhotoElement.src = pathPhoto;
    newPhotoElement.style.width = photoElementData.WIDTH + 'px';
    newPhotoElement.style.height = photoElementData.HEIGHT + 'px';
    newPhotoElement.alt = photoElementData.ALT;

    return newPhotoElement;
  };

  // Функция, создающая DOM-элемент, соответствующий объявлениям о недвижимости
  var createCardElement = function (card) {
    var cardElement = cardTemplate.cloneNode(true);
    var cardClose = cardElement.querySelector('.popup__close');

    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = translationRealEstateTypes[card.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

    var featureParent = cardElement.querySelector('.popup__features');
    window.utils.removeChildElements(featureParent);

    card.offer.features.forEach(function (item) {
      featureParent.appendChild(createFeatureElement(item));
    });

    cardElement.querySelector('.popup__description').textContent = card.offer.description;

    var photoParent = cardElement.querySelector('.popup__photos');
    window.utils.removeChildElements(photoParent);

    card.offer.photos.forEach(function (item) {
      photoParent.appendChild(createPhotoElement(item));
    });

    cardElement.querySelector('.popup__avatar').src = card.author.avatar;

    // Добавляем обработчик события click
    cardClose.addEventListener('click', function () {
      window.card.remove();
    });

    // Добавляем обработчик события keydown
    document.addEventListener('keydown', onCardCloseEsc);

    return cardElement;
  };

  // Функция, скрывающая объявления о недвижимости
  var hide = function () {
    if (cardActive) {
      cardActive.remove();
    }
  };

  // Функция-обработчик закрытия объявления при нажатии на ESC
  var onCardCloseEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.remove();
    }
  };

  // Создаём объект в глобальной ОВ
  window.card = {
    // Функция, вызывающая показ объявления о недвижимости
    show: function (element) {
      hide();
      cardActive = map.insertBefore(createCardElement(element), similarCardElement);
    },
    // Функция, скрывающая объявление о недвижимости, удаляющая выделение активного пина и удаляющая обработчик события по ESC
    remove: function () {
      hide();
      window.pins.hide();
      document.removeEventListener('keydown', onCardCloseEsc);
    }
  };
})();
