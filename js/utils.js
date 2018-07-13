'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var DEBOUNCE_INTERVAL = 500;

  // Создаём объект в глобальной ОВ
  window.utils = {
    pressEsc: function (evt, callback) {
      if (evt.keyCode === ESC_KEYCODE) {
        callback();
      }
    },
    // Функция, удаляющая все дочерние элементы
    removeChildElements: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    // Функция, устранения 'дребезга' при фильтрации объявлений
    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
