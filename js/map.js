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
    "Большая уютная квартира",
    "Маленькая неуютная квартира",
    "Огромный прекрасный дворец",
    "Маленький ужасный дворец",
    "Красивый гостевой домик",
    "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря",
    "Неуютное бунгало по колено в воде"
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
  FACILITIES: [
    "wifi",
    "dishwasher",
    "parking",
    "washer",
    "elevator",
    "conditioner"
  ],
  PHOTOS: [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  ]
};

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
function getShuffleArrayElement (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temporaryValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

// Присваиваем переменным location сгенерированные координаты месторасположения недвижимости
var locationX = getRandomNumberElement(realEstateData.location.X_MIN,realEstateData.location.X_MAX);
var locationY = getRandomNumberElement(realEstateData.location.Y_MIN,realEstateData.location.Y_MAX);
