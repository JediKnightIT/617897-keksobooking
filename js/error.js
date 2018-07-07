'use strict';

(function () {
  var node = document.createElement('div');

  // Создаём DOM-элемент, показывающий сообщение об ошибке
  window.createErrorMessage = function (text) {
    node.classList.add('error');
    node.textContent = text;
    document.body.appendChild(node);
    setTimeout(function () {
      document.body.removeChild(node);
    }, 5000);
  };
})();
