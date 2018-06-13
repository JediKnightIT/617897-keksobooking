'use strict';

// Создаём данные
var ADS_QUANTITY = 8;

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
  CHECKIN: [
    '12:00',
    '13:00',
    '14:00'
  ],
  CHECKOUT: [
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

var pinConfig = {
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

// Находим элементы в разметке и присваиваем их переменным
var map = document.querySelector('.map');

var mapPinTemplate = document.querySelector('template')
    .content.querySelector('.map__pin');

var similarPinElement = map.querySelector('.map__pins');

var adTemplate = document.querySelector('template')
    .content.querySelector('.map__card');

var similarAdElement = map.querySelector('.map');

var mapFiltersContainer = map.querySelector('.map__filters-container');


// Функция, возвращающая путь к расположению аватара
var getAvatarPath = function (number) {
  var numberAvatar = number > 9 ? number : '0' + number;
  return authorData.AVATARS + numberAvatar + '.png';
};

// Функция, возвращающая случайный элемент из массива
var getRandomArrayElement = function (array) {
  return array[Math.floor((Math.random() * array.length))];
};

// Функция, возвращающая случайное целое число между min и max
var getRandomNumberElement = function (min, max) {
  return Math.floor(Math.random() * (min - max) + min);
};

// Функция, возвращающая случайный элемент в перетасованном массиве
var getShuffleArrayElement = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temporaryValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// Присваиваем переменным location сгенерированные координаты месторасположения недвижимости
var locationX = getRandomNumberElement(realEstateData.location.X_MIN, realEstateData.location.X_MAX);
var locationY = getRandomNumberElement(realEstateData.location.Y_MIN, realEstateData.location.Y_MAX);

// Функция, возвращающая массив строк случайной длины
var getArrayStringsRandomLength = function () {
  var shuffleArray = getShuffleArrayElement(realEstateData.FEATURES);
  var randomIndex = getRandomArrayElement(shuffleArray);
  var arrayCopy = shuffleArray.slice(0, randomIndex);

  return arrayCopy;
};

// Функция, возвращающая сгенерированные данные объекта недвижимости
var getDataObjectRealEstate = function (index) {
  return {
    author: {
      avatar: getAvatarPath(++index)
    },
    offer: {
      title: realEstateData.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomNumberElement(realEstateData.price.MIN, realEstateData.price.MAX),
      type: getRandomArrayElement(realEstateData.TYPES),
      rooms: getRandomNumberElement(realEstateData.rooms.MIN, realEstateData.rooms.MAX),
      guests: getRandomNumberElement(realEstateData.guests.MIN, realEstateData.guests.MAX),
      checkin: getRandomArrayElement(realEstateData.CHECKIN),
      checkout: getRandomArrayElement(realEstateData.CHECKOUT),
      features: getArrayStringsRandomLength(),
      description: '',
      photos: getShuffleArrayElement(realEstateData.PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// Функция, возвращающая массив из n сгенерированных объектов. Объявления о сдаче недвижимости
var getRealEstateAds = function () {
  var realEstateAds = [];
  for (var i = 0; i < ADS_QUANTITY; i++) {
    realEstateAds.push(getDataObjectRealEstate(i));
  }

  return realEstateAds;
};

// Функция, создающая DOM-элементы, соответствующие меткам на карте
var createPinElement = function (object) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinElementImage = pinElement.querySelector('img');

  pinElement.style.left = (object.location.x - pinConfig.WIDTH / 2) + 'px';
  pinElement.style.top = (object.location.y - pinConfig.HEIGHT) + 'px';
  pinElementImage.src = object.author.avatar;
  pinElementImage.alt = object.offer.title;

  return pinElement;
};

// Функция, отрисовывающая сгенерированные DOM-элементы меток на карте
var getRenderPinElement = function (realEstateAds) {
  var fragment = document.createDocumentFragment();
  realEstateAds.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });

  return fragment;
};

// Функция, возвращающая новый DOM узел (элемент списка)
var createFeatureElement = function (nameFeature) {
  var newFeatureElement = document.createElement('li');
  newFeatureElement.classList.add('popup__feature ' + 'popup__feature--' + nameFeature);

  return newFeatureElement;
};

// Функция, возвращающая новый DOM узел (изображение)
var createPhotoElement = function (pathPhoto) {
  var newPhotoElement = document.createElement('img');
  newPhotoElement.classList.add(photoElementConfig.CLASS);
  newPhotoElement.scr = pathPhoto;
  newPhotoElement.style.width = photoElementConfig.WIDTH + 'px';
  newPhotoElement.style.height = photoElementConfig.HEIGHT + 'px';
  newPhotoElement.alt = photoElementConfig.ALT;

  return newPhotoElement;
};

// Функция, создающая DOM-элементы, соответствующие объявлениям о недвижимости
var createAdElement = function (object) {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = object.offer.title;
  adElement.querySelector('.popup__text--address').textContent = object.offer.address;
  adElement.querySelector('.popup__text--price').textContent = object.offer.price + 'U+20BD/ночь';
  adElement.querySelector('.popup__type').textContent = translationRealEstateTypes[object.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ',' + ' выезд до ' + object.offer.checkout;

  for (var i = 0; i < object.offer.features.length; i++) {
    adElement.querySelector('.popup__features').appendChild(createFeatureElement(i));
  }

  adElement.querySelector('.popup__description').textContent = object.offer.description;

  for (var j = 0; j < object.offer.photos.length; j++) {
    adElement.querySelector('.popup__photos').appendChild(createPhotoElement(j));
  }

  adElement.querySelector('.popup__avatar').src = object.author.avatar;

  return adElement;
};

// Функция, отрисовывающая сгенерированные DOM-элемент объявления
var getRenderAdElement = function (realEstateAds) {
  var fragment = document.createDocumentFragment();
  realEstateAds.forEach(function (item) {
    fragment.appendChild(createAdElement(item));
  });

  return fragment;
};

// Функция, запускающая активный режим и отрисовывающая метки и объявления о недвижимости
var startActiveMode = function () {
  // Временно удаляем класс
  map.classList.remove('map--faded');

  var RealEstateAds = getRealEstateAds(ADS_QUANTITY);

  similarPinElement.appendChild(getRenderPinElement(RealEstateAds));
  similarAdElement.insertBefore(getRenderAdElement(RealEstateAds[0]), mapFiltersContainer);

};

startActiveMode();
