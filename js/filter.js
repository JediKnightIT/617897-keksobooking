'use strict';

(function () {
  var PIN_QUANTITY = 5;

  // Находим элементы в разметке и присваиваем их переменным
  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelector('#housing-features');
  var filterElements = filter.querySelectorAll('select, input');

  var defaultData = [];
  var filteredData = [];

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
    var checkedElement = features.querySelectorAll('input:checked');

    return Array.from(checkedElement).every(function (element) {
      return item.offer.features.includes(element.value);
    });
  };

  // Функция, фильтрующая поля формы
  var filterFormFields = function () {
    filteredData = defaultData.slice();
    filteredData = filteredData.filter(selectFilterType);
    filteredData = filteredData.filter(selectFilterPrice);
    filteredData = filteredData.filter(selectFilterRooms);
    filteredData = filteredData.filter(selectFilterGuests);
    filteredData = filteredData.filter(selectFilterFeatures);
  };

  // Функция-обработчик, организующая работу фильтрации полей формы
  var onFormElementChange = window.utils.debounce(function () {
    filterFormFields();
    window.card.remove();
    window.pins.disable();
    window.map.create(filteredData.slice(0, PIN_QUANTITY));
  });

  // Функция, добавляющая элементам формы фильтра атрибут disabled и удаляющая событие change
  var disableElements = function () {
    filterElements.forEach(function (item) {
      item.disabled = true;
    });
    filter.removeEventListener('change', onFormElementChange);
  };

  // Функция, удаляющая элементам формы фильтра атрибут disabled и добавляющее событие change
  var activateElements = function () {
    filterElements.forEach(function (item) {
      item.disabled = false;
    });
    filter.addEventListener('change', onFormElementChange);
  };

  // Функция, активирующая фильтр
  var activateFilter = function (data) {
    defaultData = data.slice();
    activateElements();
    return defaultData.slice(0, PIN_QUANTITY);
  };

  // Функция, деактивирующая фильтр
  var disableFilter = function () {
    disableElements();
    filter.reset();
  };

  // Создаём объект в глобальной ОВ
  window.filter = {
    activate: activateFilter,
    disable: disableFilter
  };
})();
