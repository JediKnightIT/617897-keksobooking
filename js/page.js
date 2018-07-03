'use strict';

(function () {
  window.page = {
    // Функция-обработчик, вызывающая функцию перевода страницы в активное состояние
    onPinMainMouseDown: function () {
      activatePage();
    }
  };

  var ADS_QUANTITY = 8;

  // Находим элементы в разметке и присваиваем их переменным
  var map = document.querySelector('.map');

  var adForm = document.querySelector('.ad-form');

  var disabledFieldset = document.querySelectorAll('fieldset');

  var similarPinElement = document.querySelector('.map__pins');

  var mapPinMain = map.querySelector('.map__pin--main');

  // Функция, возвращающая массив из n сгенерированных объектов. Массив из 8 объявлений о сдаче недвижимости
  var getRealEstateAds = function () {
    var realEstateAds = [];
    for (var i = 0; i < ADS_QUANTITY; i++) {
      realEstateAds.push(window.getDataObjectRealEstate(i));
    }

    return realEstateAds;
  };

  // Функция, переводящая страницу в активное состояние, создающая DOM-элементы меток и объявлений о сдаче недвижимости
  var activatePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    // Убираем атрибут disabled у тега fieldset
    window.form.enableFieldsets(disabledFieldset);

    var realEstateAds = getRealEstateAds();

    similarPinElement.appendChild(window.pin.getRenderPinElement(realEstateAds));

    // Добавляем обработчик события mousedown
    mapPinMain.removeEventListener('mousedown', window.page.onPinMainMouseDown);

    // Вычисляем координаты главного пина и записываем их в поле ввода адреса
    window.mainPin.setAddressField(window.mainPin.getPinMainCoordinates());

    window.form.onInputRoomChange();

    adForm.addEventListener('invalid', function (evt) {
      window.form.getInvalidField(evt.target);
    }, true);
  };
})();
