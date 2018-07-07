'use strict';

(function () {
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

  var invalidFields = [];

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

  var inputAddress = adForm.querySelector('#address');

  var successMessage = document.querySelector('.success');

  // Добавляем тегам fieldset атрибут disabled
  var disableFieldsets = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = true;
    });
  };

  // Функция, устанавливающая зависимость минимальной цены от типа жилья
  var setPriceFromType = function () {
    adPrice.min = realEstateTypeToMinPrice[adType.value];
    adPrice.placeholder = adPrice.min;
  };

  // Функция-обработчик, устанавливающая зависимость минимальной цены от типа жилья
  var onInputAdTypeChange = function () {
    setPriceFromType();
  };

  // Функция, устанавливающая значение выбранного элемента
  var setElementValue = function (element, evt) {
    element.value = evt.target.value;
  };

  // Функция-обработчик, синхронизирующая время заезда и выезда
  var onInputTimeInChange = function (evt) {
    setElementValue(adTimeOut, evt);
  };

  // Функция-обработчик, синхронизирующая время выезда и заезда
  var onInputTimeOutChange = function (evt) {
    setElementValue(adTimeIn, evt);
  };

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

  // Функция, выделяющая неверно заполненное поле
  var getInvalidField = function (field) {
    field.parentNode.classList.add('ad-form__element--invalid-field');
    invalidFields.push(field);
  };

  // Функция-обработчик, осуществляющая проверку валидности формы
  var onInvalidForm = function (evt) {
    getInvalidField(evt.target);
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

  // Функция, закрывающая сообщение об успешной отправке формы
  var closeSuccessMessage = function () {
    successMessage.classList.add('hidden');
    document.removeEventListener('click', onSuccessWindowClick);
    document.removeEventListener('keydown', onSuccessEscPress);
  };

  // Функция-обработчик, закрывающая сообщение об успешной отправке формы по клику
  var onSuccessWindowClick = function () {
    closeSuccessMessage();
  };

  // Функция-обработчик, закрывающая сообщение об успешной отправке формы по нажатия на ESC
  var onSuccessEscPress = function (evt) {
    window.utils.pressEsc(evt, closeSuccessMessage);
  };

  // Функция-обработчик, успешной отправки данных формы
  var onLoadSuccess = function () {
    window.form.disable();
    successMessage.classList.remove('hidden');
    document.addEventListener('click', onSuccessWindowClick);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  // Функция-обработчик, возникающая при ошибке отправки данных формы
  var onLoadError = function (message) {
    window.createErrorMessage(message);
  };

  // Функция-обработчик, отправляющая данные на сервер
  var onFormSubmitClick = function (evt) {
    evt.preventDefault();
    // Создаём новый объект FormData
    var formData = new FormData(adForm);
    window.backend.upload(onLoadSuccess, onLoadError, formData);
  };

  var addFormListeners = function () {
    adType.addEventListener('change', onInputAdTypeChange);
    adTimeIn.addEventListener('change', onInputTimeInChange);
    adTimeOut.addEventListener('change', onInputTimeOutChange);
    adRoomNumber.addEventListener('change', onInputRoomChange);
    adTitle.addEventListener('change', onInputFieldValidity);
    adPrice.addEventListener('change', onInputFieldValidity);
    adForm.addEventListener('invalid', onInvalidForm, true);
    adForm.addEventListener('submit', onFormSubmitClick);
  };

  var removeFormListeners = function () {
    adType.removeEventListener('change', onInputAdTypeChange);
    adTimeIn.removeEventListener('change', onInputTimeInChange);
    adTimeOut.removeEventListener('change', onInputTimeOutChange);
    adRoomNumber.removeEventListener('change', onInputRoomChange);
    adTitle.removeEventListener('change', onInputFieldValidity);
    adPrice.removeEventListener('change', onInputFieldValidity);
    adForm.removeEventListener('invalid', onInvalidForm, true);
    adForm.removeEventListener('submit', onFormSubmitClick);
  };

  // Создаём объект в глобальной ОВ
  window.form = {
    // Функция, активирующая форму и проверяющая валидность полей формы
    activate: function () {
      adForm.classList.remove('ad-form--disabled');
      addFormListeners();
    },
    // Функция, отключающая активное состояние формы
    disable: function () {
      adForm.reset();

      adForm.classList.add('ad-form--disabled');

      disableFieldsets(disabledFieldset);

      setPriceFromType();

      invalidFields.forEach(function (field) {
        field.parentNode.classList.remove('ad-form__element--invalid-field');
      });

      removeFormListeners();
    },
    // Функция, записывающая координаты в поле ввода адреса
    setAddressField: function (coordinates) {
      inputAddress.value = coordinates.x + ', ' + coordinates.y;
    }
  };
})();
