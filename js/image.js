'use strict';

(function () {
  // Создаём структуру данных
  var fileData = {
    WIDTH: '70',
    HEIGHT: '70',
    PADDING: 'padding: 0;',
    BORDER: 'border-radius: 5px;',
    TYPES: ['gif', 'jpg', 'jpeg', 'png']
  };

  // Находим элементы в разметке и присваиваем их переменным
  var adForm = document.querySelector('.ad-form');
  var previewContainer = adForm.querySelector('.ad-form-header__preview');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var avatar = adForm.querySelector('#avatar');

  var loadAvatar = function (src) {
    avatarPreview.src = src;
    avatarPreview.width = fileData.WIDTH;
    avatarPreview.height = fileData.HEIGHT;
    avatarPreview.style = fileData.BORDER;
    previewContainer.style = fileData.PADDING;
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
    fileLoad(evt.target, loadAvatar);
  };

  // Добавляем обработчик события change
  avatar.addEventListener('change', onInputAvatarChange);
})();
