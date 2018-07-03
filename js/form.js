'use strict';

(function () {
  // Создаём объект в глобальной ОВ
  window.form = {
    invalidFields: [],
    // Функция-обработчик, приводящая в соответствие количество комнат с количеством гостей
    onInputRoomChange: function () {
      getNumberGuests();
    },
    // Функция, выделяющая неверно заполненное поле
    getInvalidField: function (field) {
      field.parentNode.classList.add('ad-form__element--invalid-field');
      window.form.invalidFields.push(field);
    },
    // Функция-обработчик, устанавливающая зависимость минимальной цены от типа жилья
    onInputAdTypeChange: function () {
      setPriceFromType();
    },
    // Добавляем тегам fieldset атрибут disabled
    disableFieldsets: function (fieldset) {
      fieldset.forEach(function (item) {
        item.disabled = true;
      });
    },
    // Убираем у тегов fieldset атрибут disabled
    enableFieldsets: function (fieldset) {
      fieldset.forEach(function (item) {
        item.disabled = false;
      });
    },
    // Функция, отключающая активное состояние формы
    disableForm: function () {
      adForm.reset();

      adForm.classList.add('ad-form--disabled');

      window.form.disableFieldsets(disabledFieldset);

      window.form.onInputAdTypeChange();

      window.form.invalidFields.forEach(function (field) {
        field.parentNode.classList.remove('ad-form__element--invalid-field');
      });
    }
  };

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

  // Находим элементы в разметке и присваиваем их переменным
  var adForm = document.querySelector('.ad-form');

  var disabledFieldset = document.querySelectorAll('fieldset');

  var adTitle = adForm.querySelector('#title');

  var adType = adForm.querySelector('#type');

  var adPrice = adForm.querySelector('#price');

  var adTimeIn = adForm.querySelector('#timein');

  var adTimeOut = adForm.querySelector('#timeout');

  var adRoomNumber = adForm.querySelector('#room_number');

  var adCapacity = adForm.querySelector('#capacity');

  var adCapacityOption = adCapacity.querySelectorAll('option');

  // Функция, устанавливающая зависимость минимальной цены от типа жилья
  var setPriceFromType = function () {
    adPrice.min = realEstateTypeToMinPrice[adType.value];
    adPrice.placeholder = adPrice.min;
  };

  // Добавляем обработчик события change
  adType.addEventListener('change', window.form.onInputAdTypeChange);

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

  // Добавляем обработчик события change
  adRoomNumber.addEventListener('change', window.form.onInputRoomChange);

  // Функция, снимающая выделение неверно заполненного поля
  var removeInvalidField = function (field) {
    field.parentNode.classList.remove('ad-form__element--invalid-field');
    window.form.invalidFields.splice(window.form.invalidFields.indexOf(field), 1);
  };

  // Функция, проверяющая валидность поля при помощи checkValidity
  var checkValidField = function (evt) {
    if (!evt.target.checkValidity()) {
      window.form.getInvalidField(evt.target);
    } else if (window.form.invalidFields.indexOf(evt.target) !== -1) {
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
})();
