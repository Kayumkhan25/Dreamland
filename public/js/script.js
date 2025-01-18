(function () {
    'use strict';
  
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNavAltMarkup');
    const navOverlay = document.querySelector('.nav-overlay');  // Use the existing overlay
  
    // Toggle navbar visibility
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
      navOverlay.classList.toggle('show');
      navbarToggler.classList.toggle('active'); // Optional: Add active state to toggler
    });
  
    // Close navbar when clicking outside or on overlay
    navOverlay.addEventListener('click', () => {
      navbarCollapse.classList.remove('show');
      navOverlay.classList.remove('show');
      navbarToggler.classList.remove('active');
    });
  
    // Close navbar on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbarCollapse.classList.remove('show');
        navOverlay.classList.remove('show');
        navbarToggler.classList.remove('active');
      });
    });
  })();
  