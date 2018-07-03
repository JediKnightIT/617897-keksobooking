'use strict';

(function () {
  // Создаём объект в глобальной ОВ
  window.pin = {
    mapPins: [],
    // Функция, отрисовывающая сгенерированный DOM-элемент меток на карте
    getRenderPinElement: function (pins) {
      var fragment = document.createDocumentFragment();
      pins.forEach(function (item) {
        fragment.appendChild(createPinElement(item));
      });

      return fragment;
    },
    // Функция, снимающая выделение активного пина
    removeActivePin: function () {
      if (pinActive) {
        pinActive.classList.remove('map__pin--active');
      }
    }
  };

  // Создаём объекты с данными
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinActive;

  // Находим элементы в разметке и присваиваем их переменным
  var template = document.querySelector('template');

  var mapPinTemplate = template.content.querySelector('.map__pin');

  // Функция, создающая DOM-элемент, соответствующиЙ меткам на карте
  var createPinElement = function (pin) {
    var pinElement = mapPinTemplate.cloneNode(true);

    pinElement.style = 'left: ' + (pin.location.x - pinSize.WIDTH / 2) + 'px; top: ' + (pin.location.y - pinSize.HEIGHT) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    // Добавляем обработчик события click
    pinElement.addEventListener('click', function () {
      window.realEstateAd.showAd(pin);
      activatePin(pinElement);
    });

    window.pin.mapPins.push(pinElement);

    return pinElement;
  };

  // Функция, выделяющая активный пин
  var activatePin = function (element) {
    window.pin.removeActivePin();
    pinActive = element;
    pinActive.classList.add('map__pin--active');
  };
})();
