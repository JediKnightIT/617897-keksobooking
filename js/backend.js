'use strict';

(function () {
  var SUCCESS_CODE = 200;

  var UrlTypes = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking'
  };

  // Функция, создающая запрос к серверу
  var createXhr = function (method, url, onLoad, onError, data) {
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

  // Функция, получающая данные с сервера
  var getData = function (onLoad, onError) {
    createXhr('GET', UrlTypes.LOAD, onLoad, onError);
  };

  // Функция, отправляющая данные на сервер
  var sendData = function (onLoad, onError, data) {
    createXhr('POST', UrlTypes.UPLOAD, onLoad, onError, data);
  };
  // Создаём объект в глобальной ОВ
  window.backend = {
    load: getData,
    upload: sendData
  };
})();
