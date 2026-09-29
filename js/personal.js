(function () {
  'use strict';

  var checkboxes = document.querySelectorAll('#booksToRead input[type="checkbox"]');
  var readThisYear = document.querySelectorAll('#booksRead li[data-finished-year="2026"]').length;
  document.getElementById('booksReadCount').textContent = readThisYear;
  document.getElementById('booksReadProgress').value = Math.min(readThisYear, 100);
  var storageKey = 'rishab-personal-books-to-read-v1';
  var checked = {};

  try {
    checked = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
  } catch (error) {
    checked = {};
  }

  checkboxes.forEach(function (checkbox) {
    checkbox.checked = Boolean(checked[checkbox.dataset.book]);
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        checked[checkbox.dataset.book] = true;
      } else {
        delete checked[checkbox.dataset.book];
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(checked));
      } catch (error) {
        // The checklist remains usable when browser storage is unavailable.
      }
    });
  });
})();
