'use strict';

// Создаём данные
var ADS_QUANTITY = 8;

var ESC_KEYCODE = 27;

var authorData = {
  AVATARS: 'img/avatars/user'
};

var realEstateData = {
  location: {
    X_MIN: 300,
    X_MAX: 900,
    Y_MIN: 130,
    Y_MAX: 630
  },
  price: {
    MIN: 1000,
    MAX: 1000000
  },
  rooms: {
    MIN: 1,
    MAX: 5
  },
  guests: {
    MIN: 1,
    MAX: 25
  },
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  CHECKIN_CHECKOUT: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

var mainPinSize = {
  WIDTH: 65,
  HEIGHT: 80
};

var pinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

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

var pinActive;

// Находим элементы в разметке и присваиваем их переменным
var map = document.querySelector('.map');

var template = document.querySelector('template');

var mapPinTemplate = template.content.querySelector('.map__pin');

var similarPinElement = document.querySelector('.map__pins');

var adTemplate = template.content.querySelector('.map__card');

var similarAdElement = document.querySelector('.map__filters-container');

var disabledFieldset = document.querySelectorAll('fieldset');

var adForm = document.querySelector('.ad-form');

var mapPinMain = map.querySelector('.map__pin--main');

var inputAddress = adForm.querySelector('#address');

// Функция, возвращающая путь к расположению аватара
var getAvatarPath = function (number) {
  var numberAvatar = number > 9 ? number : '0' + number;
  return authorData.AVATARS + numberAvatar + '.png';
};

// Функция, возвращающая случайное целое число от min(включено) до max(включено).
var getRandomIntegerElement = function (min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

// Функция, возвращающая случайный элемент из массива
var getRandomArrayElement = function (array) {
  return array[Math.floor((Math.random() * array.length))];
};

// Функция, возвращающая случайную длину массива
var getArrayStringsRandomLength = function (array) {
  return array.slice(getRandomIntegerElement(0, array.length));
};

// Функция, возвращающая сгенерированные данные объекта недвижимости
var getDataObjectRealEstate = function (index) {

// Присваиваем переменным location сгенерированные координаты месторасположения недвижимости
  var locationX = getRandomIntegerElement(realEstateData.location.X_MIN, realEstateData.location.X_MAX);
  var locationY = getRandomIntegerElement(realEstateData.location.Y_MIN, realEstateData.location.Y_MAX);

  return {
    author: {
      avatar: getAvatarPath(index + 1)
    },
    offer: {
      title: realEstateData.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomIntegerElement(realEstateData.price.MIN, realEstateData.price.MAX),
      type: getRandomArrayElement(realEstateData.TYPES),
      rooms: getRandomIntegerElement(realEstateData.rooms.MIN, realEstateData.rooms.MAX),
      guests: getRandomIntegerElement(realEstateData.guests.MIN, realEstateData.guests.MAX),
      checkin: getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
      checkout: getRandomArrayElement(realEstateData.CHECKIN_CHECKOUT),
      features: getArrayStringsRandomLength(realEstateData.FEATURES),
      description: '',
      photos: realEstateData.PHOTOS
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// Функция, возвращающая массив из n сгенерированных объектов. Массив из 8 объявлений о сдаче недвижимости
var getRealEstateAds = function () {
  var realEstateAds = [];
  for (var i = 0; i < ADS_QUANTITY; i++) {
    realEstateAds.push(getDataObjectRealEstate(i));
  }

  return realEstateAds;
};

// Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
var createPinElement = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  // Обработчик событий, показывающий объявление о недвижимости при клике на пин
  pinElement.addEventListener('click', function () {
    showAd(pin);
    activatePin(pinElement);
  });

  return pinElement;
};

// Функция, отрисовывающая сгенерированный DOM-элемент меток на карте
var getRenderPinElement = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });

  return fragment;
};

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

// Вспомогательная функция для закрытия объявления при нажатии на ESC
var onAdCloseEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onElementAction();
  }
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

  // Обработчик событий, скрывающий объявление о недвижимости при клике на закрывающий крестик
  adClose.addEventListener('click', onElementAction);

  // Обработчик событий, скрывающий объявление при нажатии на ESC
  document.addEventListener('keydown', onAdCloseEsc);

  return adElement;
};

// Добавляем тегам fieldset атрибут disabled
var disableFieldsets = function (fieldset) {
  fieldset.forEach(function (item) {
    item.disabled = true;
  });
};

// Убираем у тегов fieldset атрибут disabled
var enableFieldsets = function (fieldset) {
  fieldset.forEach(function (item) {
    item.disabled = false;
  });
};

disableFieldsets(disabledFieldset);

// Функция, переводящая страницу в активное состояние, создающая DOM-элементы меток и объявлений о сдаче недвижимости
var startActiveMode = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  // Убираем атрибут disabled у тега fieldset
  enableFieldsets(disabledFieldset);

  var realEstateAds = getRealEstateAds();
  similarPinElement.appendChild(getRenderPinElement(realEstateAds));

  // Вычисляем координаты главного пина и записываем их в поле ввода адреса
  setAddressField(mainPinSize.HEIGHT);
};

// Добавляем обработчик события mouseup на элемент .map__pin--main, тем самым переводим страницу в активное состояние
mapPinMain.addEventListener('mouseup', startActiveMode);

// Функция, выделяющая активный пин
var activatePin = function (element) {
  removeActivePin();
  pinActive = element;
  pinActive.classList.add('map__pin--active');
};

// Функция, снимающая выделение активного пина
var removeActivePin = function () {
  if (pinActive) {
    pinActive.classList.remove('map__pin--active');
  }
};

// Функция, вызывающая показ объявления о недвижимости
var showAd = function (element) {
  hideAd();
  adActive = map.insertBefore(createAdElement(element), similarAdElement);
};

// Функция, скрывающая объявления о недвижимости
var hideAd = function () {
  if (adActive) {
    adActive.remove();
  }
};

// Функция-обработчик, скрывающая объявление о недвижимости и снимающая выделение активного пина
var onElementAction = function () {
  hideAd();
  removeActivePin();
};

// Функция, вычисляющая координаты главного пина и записывающая их в поле ввода адреса
var setAddressField = function (height) {
  var mainPinX = mapPinMain.offsetLeft + mainPinSize.WIDTH / 2;
  var mainPinY = mapPinMain.offsetTop + height;
  inputAddress.value = mainPinX + ', ' + mainPinY;
};

setAddressField(mainPinSize.HEIGHT / 2);
