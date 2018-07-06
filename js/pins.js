'use strict';

(function () {
  // Создаём объекты с данными
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mapPins = [];

  var pinActive;

  // Находим элементы в разметке и присваиваем их переменным
  var template = document.querySelector('template');

  var mapPinTemplate = template.content.querySelector('.map__pin');

  var similarPinElement = document.querySelector('.map__pins');


  // Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
  var createPinElement = function (pin) {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    // Добавляем обработчик события click
    pinElement.addEventListener('click', function () {
      window.card.show(pin);
      activatePin(pinElement);
    });

    mapPins.push(pinElement);

    return pinElement;
  };

  // Функция, выделяющая активный пин
  var activatePin = function (element) {
    window.pins.hide();
    pinActive = element;
    pinActive.classList.add('map__pin--active');
  };

  // Создаём объект в глобальной ОВ
  window.pins = {
    // Функция, отрисовывающая сгенерированный DOM-элемент меток на карте
    create: function (pins) {
      var fragment = document.createDocumentFragment();
      pins.forEach(function (item) {
        fragment.appendChild(createPinElement(item));
      });
      return fragment;
    },
    // Функция, снимающая выделение активного пина
    hide: function () {
      if (pinActive) {
        pinActive.classList.remove('map__pin--active');
      }
    },
    // Функция, отключающая активное состояние карты с пинами
    disable: function () {
      mapPins.forEach(function (item) {
        similarPinElement.removeChild(item);
      });
      mapPins = [];
    }
  };
})();
