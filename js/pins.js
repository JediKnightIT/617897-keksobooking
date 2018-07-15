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

  // Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
  var createPin = function (element) {
    var pin = mapPinTemplate.cloneNode(true);

    pin.style = 'left: ' + (element.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (element.location.y - pinSize.HEIGHT) + 'px';
    pin.querySelector('img').src = element.author.avatar;
    pin.querySelector('img').alt = element.offer.title;

    // Добавляем обработчик события click
    pin.addEventListener('click', function () {
      window.card.show(element);
      activatePin(pin);
    });

    pins.push(pin);

    return pin;
  };

  // Функция, отключающая активное состояние карты с пинами
  var disableActiveState = function () {
    pins.forEach(function (item) {
      mapPins.removeChild(item);
    });
    pins = [];
  };

  // Создаём объект в глобальной ОВ
  window.pins = {
    create: createPin,
    hide: hidePinActive,
    disable: disableActiveState
  };
})();
