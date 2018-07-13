'use strict';

(function () {
  // Находим элементы в разметке и присваиваем их переменным
  var template = document.querySelector('template');
  var mapPinTemplate = template.content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');

  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pins = [];

  var pinActive;

  // Функция, выделяющая активный пин
  var activatePin = function (element) {
    hidePinActive();
    pinActive = element;
    pinActive.classList.add('map__pin--active');
  };

  // Функция, снимающая выделение активного пина
  var hidePinActive = function () {
    if (pinActive) {
      pinActive.classList.remove('map__pin--active');
    }
  };

  // Создаём объект в глобальной ОВ
  window.pins = {
    // Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
    create: function (pin) {
      var pinElement = mapPinTemplate.cloneNode(true);

      pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.title;

      // Добавляем обработчик события click
      pinElement.addEventListener('click', function () {
        window.card.show(pin);
        activatePin(pinElement);
      });

      pins.push(pinElement);

      return pinElement;
    },
    hide: hidePinActive,
    // Функция, отключающая активное состояние карты с пинами
    disable: function () {
      pins.forEach(function (item) {
        mapPins.removeChild(item);
      });
      pins = [];
    }
  };
})();
