'use strict';

(function () {
  window.realEstateAd = {
    // Функция, вызывающая показ объявления о недвижимости
    showAd: function (element) {
      window.realEstateAd.hideAd();
      adActive = map.insertBefore(createAdElement(element), similarAdElement);
    },
    // Функция, скрывающая объявления о недвижимости
    hideAd: function () {
      if (adActive) {
        adActive.remove();
      }
    },
    // Функция-обработчик, скрывающая объявление о недвижимости, снимающая выделение активного пина и удаляющая обработчик события по ESC
    onElementAction: function () {
      window.realEstateAd.hideAd();
      window.pin.removeActivePin();
      document.removeEventListener('keydown', window.realEstateAd.onAdCloseEsc);
    },
    // Функция-обработчик закрытия объявления при нажатии на ESC
    onAdCloseEsc: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.realEstateAd.onElementAction();
      }
    }
  };

  var ESC_KEYCODE = 27;

  var translationRealEstateTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var photoElementConfig = {
    CLASS: 'popup__photo',
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья'
  };

  var adActive;

  var map = document.querySelector('.map');

  var template = document.querySelector('template');

  var adTemplate = template.content.querySelector('.map__card');

  var similarAdElement = document.querySelector('.map__filters-container');

  // Функция, удаляющая все дочерние элементы
  var removeChildElements = function (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  // Функция, возвращающая новый DOM узел (элемент списка)
  var createFeatureElement = function (modifier) {
    var newFeatureElement = document.createElement('li');
    newFeatureElement.classList.add('popup__feature', 'popup__feature--' + modifier);

    return newFeatureElement;
  };

  // Функция, возвращающая новый DOM узел (изображение)
  var createPhotoElement = function (pathPhoto) {
    var newPhotoElement = document.createElement('img');
    newPhotoElement.classList.add(photoElementConfig.CLASS);
    newPhotoElement.src = pathPhoto;
    newPhotoElement.style.width = photoElementConfig.WIDTH + 'px';
    newPhotoElement.style.height = photoElementConfig.HEIGHT + 'px';
    newPhotoElement.alt = photoElementConfig.ALT;

    return newPhotoElement;
  };

  // Функция, создающая DOM-элемент, соответствующий объявлениям о недвижимости
  var createAdElement = function (ad) {
    var adElement = adTemplate.cloneNode(true);
    var adClose = adElement.querySelector('.popup__close');

    adElement.querySelector('.popup__title').textContent = ad.offer.title;
    adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
    adElement.querySelector('.popup__type').textContent = translationRealEstateTypes[ad.offer.type];
    adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

    var featureParent = adElement.querySelector('.popup__features');
    removeChildElements(featureParent);

    ad.offer.features.forEach(function (item) {
      featureParent.appendChild(createFeatureElement(item));
    });

    adElement.querySelector('.popup__description').textContent = ad.offer.description;

    var photoParent = adElement.querySelector('.popup__photos');
    removeChildElements(photoParent);

    ad.offer.photos.forEach(function (item) {
      photoParent.appendChild(createPhotoElement(item));
    });

    adElement.querySelector('.popup__avatar').src = ad.author.avatar;

    // Добавляем обработчик события click
    adClose.addEventListener('click', window.realEstateAd.onElementAction);

    // Добавляем обработчик события keydown
    document.addEventListener('keydown', window.realEstateAd.onAdCloseEsc);

    return adElement;
  };
})();
