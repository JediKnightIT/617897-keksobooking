'use strict';

// Создаём данные
var ADS_QUANTITY = 8;

var mainPinData = {
  sizes: {
    WIDTH: 65,
    HEIGHT: 80
  },
  coordinates: {
    X: 570,
    Y: 375
  },
  verticalRange: {
    Y_MIN: 130,
    Y_MAX: 630
  }
};


// Находим элементы в разметке и присваиваем их переменным
var map = document.querySelector('.map');

var similarPinElement = document.querySelector('.map__pins');

var disabledFieldset = document.querySelectorAll('fieldset');

var adForm = document.querySelector('.ad-form');

var adFormReset = adForm.querySelector('.ad-form__reset');

var mapPinMain = map.querySelector('.map__pin--main');

var inputAddress = adForm.querySelector('#address');

// Функция, возвращающая массив из n сгенерированных объектов. Массив из 8 объявлений о сдаче недвижимости
var getRealEstateAds = function () {
  var realEstateAds = [];
  for (var i = 0; i < ADS_QUANTITY; i++) {
    realEstateAds.push(window.getDataObjectRealEstate(i));
  }

  return realEstateAds;
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

// Функция, вычисляющая координаты главного пина
var getPinMainCoordinates = function () {
  var pinMainCoordinates = {
    x: mapPinMain.offsetLeft + mainPinData.sizes.WIDTH / 2,
    y: mapPinMain.offsetTop + mainPinData.sizes.HEIGHT
  };

  return pinMainCoordinates;
};

// Функция, записывающая координаты главного пина в поле ввода адреса
var setAddressField = function (coordinates) {
  inputAddress.value = coordinates.x + ', ' + coordinates.y;
};

// Функция-обработчик, вызывающая функцию перевода страницы в активное состояние
var onPinMainMouseDown = function () {
  activatePage();
};

// Функция, переводящая страницу в активное состояние, создающая DOM-элементы меток и объявлений о сдаче недвижимости
var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  // Убираем атрибут disabled у тега fieldset
  enableFieldsets(disabledFieldset);

  var realEstateAds = getRealEstateAds();

  similarPinElement.appendChild(window.pin.getRenderPinElement(realEstateAds));

  // Добавляем обработчик события mousedown
  mapPinMain.removeEventListener('mousedown', onPinMainMouseDown);

  // Вычисляем координаты главного пина и записываем их в поле ввода адреса
  setAddressField(getPinMainCoordinates());

  window.form.onInputRoomChange();

  adForm.addEventListener('invalid', function (evt) {
    window.form.getInvalidField(evt.target);
  }, true);
};

// Функция, отключающая активное состояние формы
var disableForm = function () {
  adForm.reset();

  adForm.classList.add('ad-form--disabled');

  disableFieldsets(disabledFieldset);

  window.form.onInputAdTypeChange();

  window.form.invalidFields.forEach(function (field) {
    field.parentNode.classList.remove('ad-form__element--invalid-field');
  });
};

// Функция, отключающая активное состояние карты с пинами
var disableMap = function () {
  map.classList.add('map--faded');

  window.pin.mapPins.forEach(function (item) {
    similarPinElement.removeChild(item);
  });

  setAddressField(getPinMainCoordinates());

  window.pin.mapPins = [];

  window.realEstateAd.onElementAction();
};

// Функция, возвращающая главный пин в исходное состояние
var getPinMainInitialState = function () {
  mapPinMain.style.left = mainPinData.coordinates.X + 'px';
  mapPinMain.style.top = mainPinData.coordinates.Y + 'px';

  setAddressField(getPinMainCoordinates());

  mapPinMain.addEventListener('mousedown', onPinMainMouseDown);
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

// Функция, инициализирующая страницу
var initializePage = function () {
  disablePageActiveState();

  // Добавляем обработчик события mousedown (Drag & Drop главного пина)
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Записываем начальные координаты главного пина
    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    // Функция-обработчик, перемещающая главный пин
    var onMouseMove = function (evtMove) {
      evtMove.preventDefault();

      // Определяем текущие координаты главного пина
      var currentPosition = {
        x: startPosition.x - evtMove.clientX,
        y: startPosition.y - evtMove.clientY
      };

      // Создаём объект для хранения отслеживаемых позиции при перемещении
      var newPosition = {
        x: mapPinMain.offsetLeft - currentPosition.x,
        y: mapPinMain.offsetTop - currentPosition.y
      };

      // Создаём объект для хранения координат при минимальных ограничениях размещения пина
      var minLimitCoordinates = {
        x: -mapPinMain.clientWidth / 2,
        y: mainPinData.verticalRange.Y_MIN - mainPinData.sizes.HEIGHT
      };

      // Создаём объект для хранения координат при максимальных ограничениях размещения пина
      var maxLimitCoordinates = {
        x: map.clientWidth - mapPinMain.clientWidth / 2,
        y: mainPinData.verticalRange.Y_MAX - mainPinData.sizes.HEIGHT
      };

      // Создаём условия по размещению пина по горизонтали
      if (newPosition.x < minLimitCoordinates.x || newPosition.x > maxLimitCoordinates.x) {
        newPosition.x = mapPinMain.offsetLeft;
      }

      // Создаём условия по размещению пина по вертикали
      if (newPosition.y < minLimitCoordinates.y || newPosition.y > maxLimitCoordinates.y) {
        newPosition.y = mapPinMain.offsetTop;
      }

      // Перезаписываем начальные координаты на текущие
      startPosition = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };

      mapPinMain.style.left = newPosition.x + 'px';
      mapPinMain.style.top = newPosition.y + 'px';

      setAddressField(getPinMainCoordinates());
    };

    // Функция-обработчик, прекращающая перемещение главного пина
    var onMouseUp = function (evtUp) {
      evtUp.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
};

initializePage();
