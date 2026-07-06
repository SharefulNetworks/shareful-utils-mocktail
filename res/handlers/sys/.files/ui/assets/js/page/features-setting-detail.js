/**
 * Handle tab switching between System and Security settings panels
 */
document.addEventListener('DOMContentLoaded', function () {
  // Get button references
  const systemBtn = document.getElementById('system-settings-btn');
  const securityBtn = document.getElementById('security-settings-btn');

  // Get panel references
  const systemCard = document.getElementById('system-settings-card');
  const securityCard = document.getElementById('security-settings-card');

  // Attach event handlers
  if (systemBtn) {
    systemBtn.querySelector('a').addEventListener('click', function (e) {
      e.preventDefault();
      showGeneralSettingsPanel(systemBtn);
    });
  }

  if (securityBtn) {
    securityBtn.querySelector('a').addEventListener('click', function (e) {
      e.preventDefault();
      showGeneralSettingsPanel(securityBtn);
    });
  }
});

/**
 * Toggle visibility of settings panels and update button active state
 * @param {HTMLElement} clickedElement - The button element that was clicked
 */
const showGeneralSettingsPanel = (clickedElement) => {
  const systemSettingsBtn = document.getElementById('system-settings-btn');
  const securitySettingsBtn = document.getElementById('security-settings-btn');
  const systemSettingsCard = document.getElementById('system-settings-card');
  const securitySettingsCard = document.getElementById('security-settings-card');

  // Remove active class from all nav-link elements
  systemSettingsBtn.querySelector('.nav-link').classList.remove('active');
  securitySettingsBtn.querySelector('.nav-link').classList.remove('active');

  // Show appropriate panel and mark button as active
  if (clickedElement.id === 'system-settings-btn' || clickedElement.parentElement?.id === 'system-settings-btn') {
    systemSettingsCard.style.display = 'block';
    securitySettingsCard.style.display = 'none';
    systemSettingsBtn.querySelector('.nav-link').classList.add('active');
  } else if (clickedElement.id === 'security-settings-btn' || clickedElement.parentElement?.id === 'security-settings-btn') {
    systemSettingsCard.style.display = 'none';
    securitySettingsCard.style.display = 'block';
    securitySettingsBtn.querySelector('.nav-link').classList.add('active');
  }
};
