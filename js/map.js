'use strict';

// Создаём данные
var ADS_QUANTITY = 8;

var ESC_KEYCODE = 27;

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

var pinSize = {
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

var mapPins = [];

var adActive;

var pinActive;

// Находим элементы в разметке и присваиваем их переменным
var map = document.querySelector('.map');

var template = document.querySelector('template');

var mapPinTemplate = template.content.querySelector('.map__pin');

var similarPinElement = document.querySelector('.map__pins');

var adTemplate = template.content.querySelector('.map__card');

var similarAdElement = document.querySelector('.map__filters-container');

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

// Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
var createPinElement = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  // Добавляем обработчик события click
  pinElement.addEventListener('click', function () {
    showAd(pin);
    activatePin(pinElement);
  });

  mapPins.push(pinElement);

  return pinElement;
};

// Функция, отрисовывающая сгенерированный DOM-элемент меток на карте
var getRenderPinElement = function (pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });

  return fragment;
};

// Функция, удаляющая все дочерние элементы
var removeChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

// Функция, возвращающая новый DOM узел (элемент списка)
var createFeatureElement = function (modifier) {
  var newFeatureElement = document.createElement('li');
  newFeatureElement.classList.add('popup__feature', 'popup__feature--' + modifier);

  return newFeatureElement;
};

// Функция, возвращающая новый DOM узел (изображение)
var createPhotoElement = function (pathPhoto) {
  var newPhotoElement = document.createElement('img');
  newPhotoElement.classList.add(photoElementConfig.CLASS);
  newPhotoElement.src = pathPhoto;
  newPhotoElement.style.width = photoElementConfig.WIDTH + 'px';
  newPhotoElement.style.height = photoElementConfig.HEIGHT + 'px';
  newPhotoElement.alt = photoElementConfig.ALT;

  return newPhotoElement;
};

// Функция-обработчик закрытия объявления при нажатии на ESC
var onAdCloseEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    onElementAction();
  }
};

// Функция, создающая DOM-элемент, соответствующий объявлениям о недвижимости
var createAdElement = function (ad) {
  var adElement = adTemplate.cloneNode(true);
  var adClose = adElement.querySelector('.popup__close');

  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = translationRealEstateTypes[ad.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featureParent = adElement.querySelector('.popup__features');
  removeChildElements(featureParent);

  ad.offer.features.forEach(function (item) {
    featureParent.appendChild(createFeatureElement(item));
  });

  adElement.querySelector('.popup__description').textContent = ad.offer.description;

  var photoParent = adElement.querySelector('.popup__photos');
  removeChildElements(photoParent);

  ad.offer.photos.forEach(function (item) {
    photoParent.appendChild(createPhotoElement(item));
  });

  adElement.querySelector('.popup__avatar').src = ad.author.avatar;

  // Добавляем обработчик события click
  adClose.addEventListener('click', onElementAction);

  // Добавляем обработчик события keydown
  document.addEventListener('keydown', onAdCloseEsc);

  return adElement;
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

// Функция, вызывающая показ объявления о недвижимости
var showAd = function (element) {
  hideAd();
  adActive = map.insertBefore(createAdElement(element), similarAdElement);
};

// Функция, скрывающая объявления о недвижимости
var hideAd = function () {
  if (adActive) {
    adActive.remove();
  }
};

// Функция, выделяющая активный пин
var activatePin = function (element) {
  removeActivePin();
  pinActive = element;
  pinActive.classList.add('map__pin--active');
};

// Функция, снимающая выделение активного пина
var removeActivePin = function () {
  if (pinActive) {
    pinActive.classList.remove('map__pin--active');
  }
};

// Функция-обработчик, скрывающая объявление о недвижимости, снимающая выделение активного пина и удаляющая оюработчик события по ESC
var onElementAction = function () {
  hideAd();
  removeActivePin();
  document.removeEventListener('keydown', onAdCloseEsc);
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

  similarPinElement.appendChild(getRenderPinElement(realEstateAds));

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

  mapPins.forEach(function (item) {
    similarPinElement.removeChild(item);
  });

  setAddressField(getPinMainCoordinates());

  mapPins = [];

  onElementAction();
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
