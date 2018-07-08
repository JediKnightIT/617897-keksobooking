'use strict';

(function () {
  // Создаём объекты с данными
  var UrlTypes = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };

  var SUCCESS_CODE = 200;

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
  // Создаём объект в глобальной ОВ
  window.backend = {
    load: function (onLoad, onError) {
      createXHR('GET', UrlTypes.LOAD, onLoad, onError);
    },
    upload: function (onLoad, onError, data) {
      createXHR('POST', UrlTypes.UPLOAD, onLoad, onError, data);
    }
  };
})();
