(function () {
  'use strict';

  // Enable Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
      form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
          }
          form.classList.add('was-validated');
      });
  });

  // Responsive nav handling (Optional)
  const navbarToggler = document.querySelector('.navbar-toggler');
  navbarToggler.addEventListener('click', () => {
      document.querySelector('#navbarNavAltMarkup').classList.toggle('show');
  });
})();
