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

  var similarPinElement = document.querySelector('.map__pins');

  var adFormReset = document.querySelector('.ad-form__reset');

  var mapPinMain = map.querySelector('.map__pin--main');

  // Функция, возвращающая главный пин в исходное состояние
  var getPinMainInitialState = function () {
    mapPinMain.style.left = mainPinData.coordinates.X + 'px';
    mapPinMain.style.top = mainPinData.coordinates.Y + 'px';

    window.mainPin.setAddressField(window.mainPin.getPinMainCoordinates());

    mapPinMain.addEventListener('mousedown', window.page.onPinMainMouseDown);
  };

  // Функция, отключающая активное состояние карты с пинами
  var disableMap = function () {
    map.classList.add('map--faded');

    window.pin.mapPins.forEach(function (item) {
      similarPinElement.removeChild(item);
    });

    window.mainPin.setAddressField(window.mainPin.getPinMainCoordinates());

    window.pin.mapPins = [];

    window.realEstateAd.onElementAction();
  };

  // Функция, отключающая активное состояние страницы
  var disablePageActiveState = function () {
    window.form.disableForm();
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

        window.mainPin.setAddressField(window.mainPin.getPinMainCoordinates());
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

})();
