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
  var checkedElement = features.querySelector('input:checked');

  var defaultData = [];
  var filteredData = [];

  // Функция, фильтрующая элементы формы
  var selectFilterElement = function (element, value, item) {
    return element.value === 'any' ? true : element.value === item[value].toString();
  };

  // Функция, фильтрующая тип жилья
  var selectFilterType = function (item) {
    return selectFilterElement(type, 'type', item.offer);
  };

  // Функция, фильтрующая цену на жильё
  var selectFilterPrice = function (item) {
    var priceValue = priceRange[price.value];
    return priceValue ? item.offer.price >= priceValue.MIN && item.offer.price <= priceValue.MAX : true;
  };

  // Функция, фильтрующая число комнат
  var selectFilterRooms = function (item) {
    return selectFilterElement(rooms, 'rooms', item.offer);
  };

  // Функция, фильтрующая число гостей
  var selectFilterGuests = function (item) {
    return selectFilterElement(guests, 'guests', item.offer);
  };

  // Функция, фильтрующая перечень удобств
  var selectFilterFeatures = function (item) {
    return Array.from(checkedElement).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

})();
