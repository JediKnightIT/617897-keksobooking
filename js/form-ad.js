'use strict';
// Создаём словари
var realEstateTypeToMinPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var roomToGuest = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 2, 3],
  '100': [0]
};

var invalidFields = [];

var mapPins = [];

// Находим элементы в разметке и присваиваем их переменным
var adForm = document.querySelector('.ad-form');

var adTitle = adForm.querySelector('#title');

var adType = adForm.querySelector('#type');

var adPrice = adForm.querySelector('#price');

var adTimeIn = adForm.querySelector('#timein');

var adTimeOut = adForm.querySelector('#timeout');

var adRoomNumber = adForm.querySelector('#room_number');

var adCapacity = adForm.querySelector('#capacity');

var adCapacityOption = adCapacity.querySelectorAll('option');

var adFormReset = adForm.querySelector('.ad-form__reset');

// Функция, устанавливающая зависимость минимальной цены от типа жилья
var getMinPriceFromTypeRealEstate = function () {
  adPrice.min = realEstateTypeToMinPrice[adType.value];
  adPrice.placeholder = adPrice.min;
};

// Функция-обработчик, устанавливающая зависимость минимальной цены от типа жилья
var onInputAdTypeChange = function () {
  getMinPriceFromTypeRealEstate();
};

// Добавляем обработчик события change
adType.addEventListener('change', onInputAdTypeChange);

// Функция, получающая значение элемента для синхронизации с другим элементом
var getElementValue = function (element, evt) {
  var value = evt.target.value;
  element.value = value;
};

// Функция-обработчик, синхронизирующая время заезда и выезда
var onInputTimeInChange = function (evt) {
  getElementValue(adTimeOut, evt);
};

// Добавляем обработчик события change
adTimeIn.addEventListener('change', onInputTimeInChange);

// Функция-обработчик, синхронизирующая время выезда и заезда
var onInputTimeOutChange = function (evt) {
  getElementValue(adTimeIn, evt);
};

// Добавляем обработчик события change
adTimeOut.addEventListener('change', onInputTimeOutChange);

// Функция выбора вариантов соответствия количество комнат - количество мест
var getNumberGuests = function () {
  var selectedOption = roomToGuest[adRoomNumber.value];

  adCapacityOption.forEach(function (item) {
    item.disabled = !selectedOption.includes(item.value);
  });

  adCapacity.value = selectedOption.includes(adCapacity.value) ? adCapacity.value : selectedOption[0];
};

// Функция-обработчик, приводящая в соответствие количество комнат с количеством гостей
var onInputRoomChange = function () {
  getNumberGuests();
};

// Добавляем обработчик события change
adRoomNumber.addEventListener('change', onInputRoomChange);
