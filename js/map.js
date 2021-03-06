'use strict';

(function () {
  // Находим элементы в разметке и присваиваем их переменным
  var map = document.querySelector('.map');
  var disabledFieldset = document.querySelectorAll('fieldset');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');

  var mainPinData = {
    sizes: {
      WIDTH: 65,
      HEIGHT: 80
    },
    coordinates: {
      X: 570,
      Y: 375
    },
    limit: {
      X_MIN: 0,
      Y_MIN: 130,
      Y_MAX: 630
    }
  };

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

  // Функция-обработчик, отрисовывающая DOM-элемент меток на карте
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
      x: mapPinMain.offsetLeft + Math.round(mainPinData.sizes.WIDTH / 2),
      y: mapPinMain.offsetTop + mainPinData.sizes.HEIGHT
    };
    return pinMainCoordinates;
  };

  // Функция, возвращающая главный пин в исходное состояние
  var getPinMainInitialState = function () {
    mapPinMain.style.left = mainPinData.coordinates.X + 'px';
    mapPinMain.style.top = mainPinData.coordinates.Y + 'px';

    window.form.setAddress(getCoordinates());

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

        // Перезаписываем начальные координаты на текущие
        startPosition = {
          x: evtMove.clientX,
          y: evtMove.clientY
        };

        var pinMainPosition = getCoordinates();

        var newPosition = {
          x: pinMainPosition.x - currentPosition.x,
          y: pinMainPosition.y - currentPosition.y
        };

        // Создаём условия по размещению пина по горизонтали
        if (newPosition.x >= mainPinData.limit.X_MIN && newPosition.x <= mapPins.offsetWidth) {
          mapPinMain.style.left = (mapPinMain.offsetLeft - currentPosition.x) + 'px';
        }

        // Создаём условия по размещению пина по вертикали
        if (newPosition.y >= mainPinData.limit.Y_MIN && newPosition.y <= mainPinData.limit.Y_MAX) {
          mapPinMain.style.top = (mapPinMain.offsetTop - currentPosition.y) + 'px';
        }

        window.form.setAddress(getCoordinates());
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

  // Создаём объект в глобальной ОВ
  window.map = {
    create: createMapPins,
    disablePageActiveState: disablePageActiveState
  };
})();
