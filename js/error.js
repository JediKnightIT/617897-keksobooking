'use strict';

(function () {
  // Создаём структуру данных
  var TIMEOUT = 5000;

  var node = document.createElement('div');
  // Создаём DOM-элемент, показывающий сообщение об ошибке
  var createErrorMessage = function (text) {
    node.classList.add('error');
    node.textContent = text;
    document.body.appendChild(node);
    setTimeout(function () {
      document.body.removeChild(node);
    }, TIMEOUT);
  };

  // Создаём объект в глобальной ОВ
  window.error = {
    createMessage: createErrorMessage
  };
})();
