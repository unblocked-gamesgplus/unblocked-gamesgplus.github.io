/*

Custom script

This file will not be overwritten by the updater

*/

// JavaScript code
function search_animal() {
    let input = document.getElementById("searchbar").value;
    input = input.toLowerCase();
    let x = document.getElementsByClassName("animals");
  
    for (i = 0; i < x.length; i++) {
      if (!x[i].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display = "none";
      } else {
        x[i].style.display = "block";
      }
    }
  }
  
  $(window).on('load', function () {
      // Initialize features
      initializePwaFeatures();
      initializeGoogleAnalytics();
      initializeProjectFilter();
  });
  
  // Initialize PWA Features
  function initializePwaFeatures() {
      addManifestLink();
      registerServiceWorker();
      setupPwaInstallation();
  }
  
  // Dynamically add the manifest link
  function addManifestLink() {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json'; // Ensure manifest.json exists in the root
      document.head.appendChild(manifestLink);
      console.log('Manifest added:', manifestLink.href);
  }
  
  // Register the service worker
  function registerServiceWorker() {
      if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js')
              .then(registration => {
                  console.log('Service Worker registered with scope:', registration.scope);
                  trackEvent('PWA_service_worker', 'Service Worker', 'Registered', 1);
              })
              .catch(error => {
                  console.error('Service Worker registration failed:', error);
                  trackEvent('PWA_service_worker', 'Service Worker', 'Failed', 0);
              });
      } else {
          console.warn('Service Worker not supported in this browser.');
          trackEvent('PWA_service_worker', 'Service Worker', 'Not Supported', 0);
      }
  }
  
  // Set up Google Analytics
  function initializeGoogleAnalytics() {
      const googleAnalyticsScript = document.createElement('script');
      googleAnalyticsScript.async = true;
      googleAnalyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VBV3B4M46V";
      document.head.appendChild(googleAnalyticsScript);
  
      googleAnalyticsScript.onload = function () {
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-VBV3B4M46V');
          console.log('Google Analytics initialized.');
      };
  }
  
  // Set up PWA installation prompt
  function setupPwaInstallation() {
      // PWA installation disabled
  
          const popup = $('#pwa-popup');
          const installButton = $('#install-button');
          const closePopupButton = $('#close-popup');
  
          window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;
              popup.show();
              console.log('beforeinstallprompt event triggered');
              trackEvent('PWA_prompt', 'PWA', 'Prompt Displayed', 1);
          });
  
          installButton.on('click', () => {
              if (deferredPrompt) {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then((choiceResult) => {
                      if (choiceResult.outcome === 'accepted') {
                          console.log('PWA installation accepted');
                          trackEvent('PWA_installation', 'PWA', 'Accepted', 1);
                          localStorage.setItem('pwaInstalled', 'true');
                      } else {
                          console.log('PWA installation dismissed');
                          trackEvent('PWA_installation', 'PWA', 'Dismissed', 0);
                      }
                      deferredPrompt = null;
                      popup.hide();
                  }).catch(error => {
                      console.error('Error during PWA installation:', error);
                  });
              }
          });
  
          closePopupButton.on('click', () => {
              popup.hide();
              console.log('PWA popup closed.');
              trackEvent('PWA_prompt', 'PWA', 'Closed', 0);
          });
  
          window.addEventListener('appinstalled', () => {
              console.log('PWA installed successfully.');
              trackEvent('PWA_installation', 'PWA', 'Successful', 1);
              localStorage.setItem('pwaInstalled', 'true');
              popup.hide();
          });
      } else {
          console.log('PWA is already installed or device is mobile.');
      }
  }
  
  // Detect mobile devices
  function isMobileDevice() {
      return window.matchMedia("(max-width: 767px)").matches || /Mobi|Android/i.test(navigator.userAgent);
  }
  
  // Track events in Google Analytics
  function trackEvent(action, category, label, value) {
      if (typeof gtag === 'function') {
          gtag('event', action, {
              event_category: category,
              event_label: label,
              value: value
          });
          console.log(`Event tracked: ${action}, ${category}, ${label}, ${value}`);
      } else {
          console.warn('gtag not initialized. Event not tracked:', action);
      }
  }
  
  // Initialize project filter
  function initializeProjectFilter() {
      const $container = $('.projectContainer');
      $('.projectFilter a').on('click', function () {
          $('.projectFilter .current').removeClass('current');
          $(this).addClass('current');
          const selector = $(this).attr('data-filter');
          requestAnimationFrame(() => {
              if ($container.length) {
                  $container.isotope({
                      filter: selector,
                      animationOptions: {
                          duration: 750,
                          easing: 'linear',
                          queue: false
                      }
                  });
              }
          });
          console.log('Project filter applied:', selector);
          return false;
      });
  }
  