'use strict';

(function () {
  // Создаём структуру данных
  var fileData = {
    WIDTH: '70',
    HEIGHT: '70',
    BORDER: 'border-radius: 5px;',
    TYPES: ['gif', 'jpg', 'jpeg', 'png']
  };

  var photos = [];

  var DEFAULT_SRC = 'img/muffin-grey.svg';

  // Находим элементы в разметке и присваиваем их переменным
  var adForm = document.querySelector('.ad-form');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var avatar = adForm.querySelector('#avatar');

  var photoPreviewContainer = adForm.querySelector('.ad-form__photo-container');
  var photoPreview = adForm.querySelector('.ad-form__photo');
  var photo = adForm.querySelector('#images');

  // Функция, создающая параметры аватарке
  var createAvatarInput = function (src) {
    avatarPreview.src = src;
  };

  // Функция, создающая DOM-элемент поля фотографии
  var createPhotoInput = function (src) {
    var photoCloneNode = photoPreview.cloneNode();
    var image = document.createElement('img');
    image.src = src;
    image.width = fileData.WIDTH;
    image.height = fileData.HEIGHT;
    image.style = fileData.BORDER;
    photos.push(image);
    photoCloneNode.appendChild(image);
    photoPreviewContainer.insertBefore(photoCloneNode, photoPreview);
  };

  // Функция, выполняющая загрузку файла
  var fileLoad = function (evt, callback) {
    if (evt.files) {
      Array.from(evt.files).forEach(function (file) {
        if (file.type.match('image')) {
          var fileReader = new FileReader();

          fileReader.addEventListener('load', function () {
            callback(fileReader.result);
          });

          fileReader.readAsDataURL(file);
        } else {
          evt.value = '';
        }
      });
    }
  };

  // Функция-обработчик, загружающая аватарку пользователя
  var onInputAvatarChange = function (evt) {
    fileLoad(evt.target, createAvatarInput);
  };

  // Функция-обработчик, загружающая фотографии недвижимости
  var onInputPhotoChange = function (evt) {
    fileLoad(evt.target, createPhotoInput);
  };

  // Функция, сбрасывающая загруженные файлы
  var resetInputFile = function () {
    photos.forEach(function (item) {
      item.parentElement.remove();
    });
    avatarPreview.src = DEFAULT_SRC;
  };
  // Создаём объект в глобальной ОВ
  window.image = {
    // Добавляем сгруппированные события
    add: function () {
      avatar.addEventListener('change', onInputAvatarChange);
      photo.addEventListener('change', onInputPhotoChange);
    },
    // Удаляем сгруппированные события
    remove: function () {
      resetInputFile();
      avatar.removeEventListener('change', onInputAvatarChange);
      photo.removeEventListener('change', onInputPhotoChange);
    }
  };
})();
