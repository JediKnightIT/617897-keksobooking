'use strict';

// Создаём данные
var ADS_QUANTITY = 8;

var authorData = {
  AVATARS: 'img/avatars/user'
};

var realEstateData = {
  locationAddress: {
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
