'use strict';

(function () {
  // Создаём структуру данных
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var imageData = {
    WIDTH: '70',
    HEIGHT: '70',
    PADDING: 'padding: 0;',
    BORDER: 'border-radius: 5px;'
  };

  // Находим элементы в разметке и присваиваем их переменным
  var adForm = document.querySelector('.ad-form');
  var avatarPreviewContainer = adForm.querySelector('.ad-form-header__preview');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var avatar = adForm.querySelector('#avatar');

  // Функция, загружающая аватарку с локальной диска
  var loadAvatar = function () {
    var file = avatar.files[0];
    var fileName = file.name.toLowerCase();

    // Проверяем тип загружаемого файла
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        avatarPreview.src = fileReader.result;
        avatarPreview.width = imageData.WIDTH;
        avatarPreview.height = imageData.HEIGHT;
        avatarPreview.style = imageData.BORDER;
        avatarPreviewContainer.style = imageData.PADDING;
      });
      fileReader.readAsDataURL(file);
    }
  };

  // Функция-обработчик, загружающая аватарку пользователя
  var onInputChange = function () {
    loadAvatar();
  };

  // Добавляем обработчик события change
  avatar.addEventListener('change', onInputChange);
})();
