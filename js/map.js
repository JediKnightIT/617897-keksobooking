'use strict';

(function () {
  // Создаём объекты с данными
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

  var disabledFieldset = document.querySelectorAll('fieldset');

  var mapPins = map.querySelector('.map__pins');

  var mapPinMain = map.querySelector('.map__pin--main');

  var adFormReset = document.querySelector('.ad-form__reset');

  // Убираем у тегов fieldset атрибут disabled
  var activateFieldsets = function (fieldset) {
    fieldset.forEach(function (item) {
      item.disabled = false;
    });
  };

  // Функция, отрисовывающая DOM-элемент меток на карте
  var createMapPins = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      var pin = window.pins.create(item);
      fragment.appendChild(pin);
    });
    mapPins.appendChild(fragment);
  };

  var onLoadSuccess = function (data) {
    createMapPins(window.filter.activate(data));
  };

  // Функция-обработчик, при возникновении ошибки загрузки данных с сервера
  var onLoadError = function (message) {
    window.error.createMessage(message);
  };

  // Функция, переводящая страницу в активное состояние, создающая DOM-элементы меток и объявлений о сдаче недвижимости
  var activatePage = function () {
    // Загружаем данные с сервера
    window.backend.load(onLoadSuccess, onLoadError);

    map.classList.remove('map--faded');

    // Убираем атрибут disabled у тега fieldset
    activateFieldsets(disabledFieldset);

    // Добавляем обработчик события mousedown
    mapPinMain.removeEventListener('mousedown', onPinMainMouseDown);

    window.form.activate();
  };

  // Функция-обработчик, вызывающая функцию перевода страницы в активное состояние
  var onPinMainMouseDown = function () {
    activatePage();
  };

  // Функция, вычисляющая координаты главного пина
  var getCoordinates = function () {
    var pinMainCoordinates = {
      x: mapPinMain.offsetLeft + mainPinData.sizes.WIDTH / 2,
      y: mapPinMain.offsetTop + mainPinData.sizes.HEIGHT
    };
    return pinMainCoordinates;
  };

  // Функция, возвращающая главный пин в исходное состояние
  var getPinMainInitialState = function () {
    mapPinMain.style.left = mainPinData.coordinates.X + 'px';
    mapPinMain.style.top = mainPinData.coordinates.Y + 'px';

    window.form.setAddressField(getCoordinates());

    mapPinMain.addEventListener('mousedown', onPinMainMouseDown);
  };

  // Функция, отключающая активное состояние страницы
  var disablePageActiveState = function () {
    map.classList.add('map--faded');
    window.form.disable();
    window.pins.disable();
    window.card.remove();
    window.filter.disable();
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

        window.form.setAddressField(getCoordinates());
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

  window.map = {
    create: createMapPins,
    disablePageActiveState: disablePageActiveState
  };
})();
