'use strict';

(function () {
  var node = document.createElement('div');
  var timeout = 5000;
  // Создаём DOM-элемент, показывающий сообщение об ошибке
  var createErrorMessage = function (text) {
    node.classList.add('error');
    node.textContent = text;
    document.body.appendChild(node);
    setTimeout(function () {
      document.body.removeChild(node);
    }, timeout);
  };

  window.error = {
    createMessage: createErrorMessage
  };
})();
