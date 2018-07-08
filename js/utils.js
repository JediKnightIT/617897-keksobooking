'use strict';

(function () {
  // Создаём переменную с кодом клавиши ESC
  var ESC_KEYCODE = 27;

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
    }
  };
})();
