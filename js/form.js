'use strict';
// Создаём словари
var realEstateTypeToMinPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var roomToGuest = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var pinMainStartCoordinates = {
  x: 570,
  y: 375
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
var setPriceFromType = function () {
  adPrice.min = realEstateTypeToMinPrice[adType.value];
  adPrice.placeholder = adPrice.min;
};

// Функция-обработчик, устанавливающая зависимость минимальной цены от типа жилья
var onInputAdTypeChange = function () {
  setPriceFromType();
};

// Добавляем обработчик события change
adType.addEventListener('change', onInputAdTypeChange);

// Функция, устанавливающая значение выбранного элемента
var setElementValue = function (element, evt) {
  element.value = evt.target.value;
};

// Функция-обработчик, синхронизирующая время заезда и выезда
var onInputTimeInChange = function (evt) {
  setElementValue(adTimeOut, evt);
};

// Добавляем обработчик события change
adTimeIn.addEventListener('change', onInputTimeInChange);

// Функция-обработчик, синхронизирующая время выезда и заезда
var onInputTimeOutChange = function (evt) {
  setElementValue(adTimeIn, evt);
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

// Функция, выделяющая неверно заполненное поле
var getInvalidField = function (field) {
  field.parentNode.classList.add('ad-form__element--invalid-field');
  invalidFields.push(field);
};

// Функция, снимающая выделение неверно заполненного поля
var removeInvalidField = function (field) {
  field.parentNode.classList.remove('ad-form__element--invalid-field');
  invalidFields.splice(invalidFields.indexOf(field), 1);
};

// Функция, проверяющая валидность поля при помощи checkValidity
var checkValidField = function (evt) {
  if (!evt.target.checkValidity()) {
    getInvalidField(evt.target);
  } else if (invalidFields.indexOf(evt.target) !== -1) {
    removeInvalidField(evt.target);
  }
};

// Функция-обработчик, осуществляющая проверку валидности поля формы
var onInputFieldValidity = function (evt) {
  checkValidField(evt);
};

// Добавляем обработчик события change
adTitle.addEventListener('change', onInputFieldValidity);

adPrice.addEventListener('change', onInputFieldValidity);

// Функция, отключающая активное состояние формы
var disableForm = function () {
  adForm.reset();

  adForm.classList.add('ad-form--disabled');

  window.disableFieldsets(window.disabledFieldset);

  onInputAdTypeChange();

  invalidFields.forEach(function (field) {
    field.parentNode.classList.remove('ad-form__element--invalid-field');
  });
};

// Функция, отключающая активное состояние карты с пинами
var disableMap = function () {
  window.map.classList.add('map--faded');

  mapPins.forEach(function (item) {
    window.similarPinElement.removeChild(item);
  });

  window.setAddressField(window.getPinMainCoordinates());

  mapPins = [];

  window.onElementAction();
};

// Функция, возвращающая главный пин в исходное состояние
var getPinMainInitialState = function () {
  window.mapPinMain.style.left = pinMainStartCoordinates.x + 'px';
  window.mapPinMain.style.top = pinMainStartCoordinates.y + 'px';

  window.mapPinMain.addEventListener('mousedown', window.onPinMainMouseDown);
};

// Функция, отключающая активное состояние страницы
var disablePageActiveState = function () {
  disableForm();
  disableMap();
  getPinMainInitialState();
};

// Добавляем обработчик события click
adFormReset.addEventListener('click', function (evt) {
  evt.preventDefault();
  disablePageActiveState();
});