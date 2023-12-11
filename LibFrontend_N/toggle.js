const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('change', function () {
  const body = document.body;

  if (darkModeToggle.checked) {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  }
});