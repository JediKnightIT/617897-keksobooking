'use strict';

(function () {
  // Создаём данные
  var priceRange = {
    low: {
      MIN: 0,
      MAX: 9999
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50001,
      MAX: Infinity
    }
  };

  var PIN_QUANTITY = 5;

  // Находим элементы в разметке и присваиваем их переменным
  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelector('#housing-features');

  // Функция, фильтрующая элементы формы
  var selectFilterElement = function (element, value, item) {
    return element.value === 'any' ? true : element.value === item[value].toString();
  };

})();
