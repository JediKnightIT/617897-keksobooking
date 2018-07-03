'use strict';

(function () {
  window.mainPin = {
    // Функция, вычисляющая координаты главного пина
    getPinMainCoordinates: function () {
      var pinMainCoordinates = {
        x: mapPinMain.offsetLeft + mainPinData.sizes.WIDTH / 2,
        y: mapPinMain.offsetTop + mainPinData.sizes.HEIGHT
      };

      return pinMainCoordinates;
    },
    // Функция, записывающая координаты главного пина в поле ввода адреса
    setAddressField: function (coordinates) {
      inputAddress.value = coordinates.x + ', ' + coordinates.y;
    }
  };

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

  var mapPinMain = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');

  var inputAddress = adForm.querySelector('#address');
})();
