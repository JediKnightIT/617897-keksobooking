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

// Функция, выделающая неверно заполненное поле
var getInvalidField = function (field) {
  field.classList.add('ad-form__element--invalid-field');
  invalidFields.push(field);
};

// Функция, снимающая выделение неверно заполненного поля
var removeInvalidField = function (field) {
  field.classList.remove('ad-form__element--invalid-field');
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
var onInputFieldValidity = function () {
  checkValidField();
};

// Добавляем обработчик события change
adTitle.addEventListener('change', onInputFieldValidity);

adPrice.addEventListener('change', onInputFieldValidity);

// Функция, отключающая активное состояние страницы
var disablePageActiveState = function () {
  // Сбрасываем форму
  adForm.classList.add('ad-form--disabled');
  window.disableFieldsets(window.disabledFieldset);
  adForm.reset();
  onInputAdTypeChange();
  invalidFields.forEach(function (field) {
    field.classList.remove('ad-form__element--invalid-field');
  });

  // Возвращаем главный пин на начальные координаты
  window.mapPinMain.style.left = window.pinMainStartCoordinates.x + 'px';
  window.mapPinMain.style.top = window.pinMainStartCoordinates.y + 'px';

  // Сбрасываем карту и пины
  mapPins.forEach(function (item) {
    window.similarPinElement.removeChild(item);
  });
  window.setAddressField(window.getPinMainCoordinates());
  window.map.classList.add('map--faded');
  mapPins = [];
  window.onElementAction();
  window.mapPinMain.addEventListener('mouseup', window.onPinMainMouseup);
};

// Добавляем обработчик события click
adFormReset.addEventListener('click', function (evt) {
  evt.preventDefault();
  disablePageActiveState();
});
