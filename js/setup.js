'use strict';

(function () {
  window.setup = {
    // Функция, возвращающая случайное целое число от min(включено) до max(включено).
    getRandomIntegerElement: function (min, max) {
      return min + Math.floor(Math.random() * (max + 1 - min));
    },

    // Функция, возвращающая случайный элемент из массива
    getRandomArrayElement: function (array) {
      return array[Math.floor((Math.random() * array.length))];
    },

    // Функция, возвращающая случайную длину массива
    getArrayStringsRandomLength: function (array) {
      return array.slice(window.setup.getRandomIntegerElement(0, array.length));
    }
  };
})();
