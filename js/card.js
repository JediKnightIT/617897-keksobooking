'use strict';

(function () {
  // Находим элементы в разметке и присваиваем их переменным
  var map = document.querySelector('.map');
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var similarCard = document.querySelector('.map__filters-container');

  var photoElementData = {
    CLASS: 'popup__photo',
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья'
  };

  var translationRealEstateTypes = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var cardActive;

  // Функция, возвращающая новый DOM узел (элемент списка)
  var createFeatureElement = function (modifier) {
    var newFeatureElement = document.createElement('li');
    newFeatureElement.classList.add('popup__feature');
    newFeatureElement.classList.add('popup__feature--' + modifier);

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
  var createCard = function (element) {
    var card = cardTemplate.cloneNode(true);
    var cardClose = card.querySelector('.popup__close');

    card.querySelector('.popup__title').textContent = element.offer.title;
    card.querySelector('.popup__text--address').textContent = element.offer.address;
    card.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = translationRealEstateTypes[element.offer.type];
    card.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;

    var featureParent = card.querySelector('.popup__features');
    window.utils.removeChildElements(featureParent);

    element.offer.features.forEach(function (item) {
      featureParent.appendChild(createFeatureElement(item));
    });

    card.querySelector('.popup__description').textContent = element.offer.description;

    var photoParent = card.querySelector('.popup__photos');
    window.utils.removeChildElements(photoParent);

    element.offer.photos.forEach(function (item) {
      photoParent.appendChild(createPhotoElement(item));
    });

    card.querySelector('.popup__avatar').src = element.author.avatar;

    // Добавляем обработчик события click
    cardClose.addEventListener('click', function () {
      removeActiveElement();
    });

    // Добавляем обработчик события keydown
    document.addEventListener('keydown', onCardCloseEsc);

    return card;
  };

  // Функция, скрывающая объявления о недвижимости
  var hide = function () {
    if (cardActive) {
      cardActive.remove();
    }
  };

  // Функция, скрывающая объявление о недвижимости, удаляющая выделение активного пина и удаляющая обработчик события по ESC
  var removeActiveElement = function () {
    hide();
    window.pins.hide();
    document.removeEventListener('keydown', onCardCloseEsc);
  };

  // Функция-обработчик закрытия объявления при нажатии на ESC
  var onCardCloseEsc = function (evt) {
    window.utils.isEscPress(evt, removeActiveElement);
  };

  // Функция, вызывающая показ объявления о недвижимости
  var showCard = function (element) {
    hide();
    cardActive = map.insertBefore(createCard(element), similarCard);
  };

  // Создаём объект в глобальной ОВ
  window.card = {
    show: showCard,
    remove: removeActiveElement
  };
})();
