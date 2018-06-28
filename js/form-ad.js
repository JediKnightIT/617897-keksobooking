'use strict';
// Создаём словари
var realEstateTypeToMinPrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var roomToGuest = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 2, 3],
  '100': [0]
};

// Находим элементы в разметке и присваиваем их переменным
var adForm = document.querySelector('.ad-form');

var adTitle = adForm.querySelector('#title');

var adType = adForm.querySelector('#type');

var adPrice = adForm.querySelector('#price');

var adTimeIn = adForm.querySelector('#timein');

var adTimeOut = adForm.querySelector('#timeout');

var adRoomNumber = adForm.querySelector('#room_number');

var adCapacity = adForm.querySelector('#capacity');

var adFormReset = adForm.querySelector('.ad-form__reset');

// Функция-обработчик, устанавливающая зависимость минимальной цены от типа жилья
var onInputAdTypeChange = function () {
  adPrice.min = realEstateTypeToMinPrice[adType.value];
  adPrice.placeholder = realEstateTypeToMinPrice[adType.value];
};

// Добавляем обработчик события change
adType.addEventListener('change', onInputAdTypeChange);
