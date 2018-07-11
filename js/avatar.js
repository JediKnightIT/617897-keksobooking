'use strict';

(function () {
  // Создаём структуру данных
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // Находим элементы в разметке и присваиваем их переменным
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var fileChooser = document.querySelector('.ad-form__field input[type=file]');

  // Добавляем обработчик события изменения состояния fileChooser
  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    // Проверяем тип загружаемого файла
    var checkFileType = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    // Получакм исходный код загружаемого файла
    if (checkFileType) {
      var fileReader = new FileReader();

      fileReader.addEventListener('load', function () {
        avatarPreview.src = fileReader.result;
      });
      fileReader.readAsDataURL(file);
    }
  });
})();
