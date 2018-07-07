'use strict';

(function () {
  // Создаём объекты с данными
  var urlType = {
    LOAD: 'https://js.dump.academy/keksobooking',
    UPLOAD: 'https://js.dump.academy/keksobooking/data'
  };

  // Функция, создающая запрос к серверу
  var createXHR = function (method, url, onLoad, onError, data) {
    // Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();
    // Выполняем проверку метода, при помощи которого будет осуществляться запрос
    if (method === 'GET') {
      xhr.responseType = 'json';
    }
    // Добавляем обработчик события load
    xhr.addEventListener('load', function () {
      var SUCCESS_CODE = 200;
      // Выполняем проверку статуса запроса
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('В процессе загрузки произошла ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    // Добавляем обработчик события error
    xhr.addEventListener('error', function () {
      onError('В процессе загрузки произошла ошибка соединения: ' + xhr.status + ' ' + xhr.statusText);
    });
    // Добавляем обработчик события timeout
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться. Время ожидания ' + xhr.timeout + 'мс');
    });
    // Открываем запрос
    xhr.open(method, url);
    // Отправка данных
    xhr.send(data ? data : '');
  };

})();
