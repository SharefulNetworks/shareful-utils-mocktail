//stores the latest settings fetched from the API.
var CACHED_SETTINGS = null; 

/**
 * Handle tab switching between System and Security settings panels
 */
document.addEventListener('DOMContentLoaded', function () {

  // Get button references
  const systemBtn = document.getElementById('system-settings-btn');
  const securityBtn = document.getElementById('security-settings-btn');
  const systemSettingsSaveBtn = document.getElementById('system-settings-save-btn');
  const securitySettingsSaveBtn = document.getElementById('security-settings-save-btn');

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


  //attach event listener function to the "save system settings" button...
  if (systemSettingsSaveBtn) {

    systemSettingsSaveBtn.addEventListener('click', async function (e) {
      e.preventDefault();
  
      console.log('System settings save button clicked');

      //grab system settings values from the UI
      const maxConcurrentProcesses = document.getElementById('max-handler-processes').value;
      const maxHandlerProcessRuntime = document.getElementById('max-handler-process-runtime').value;
      const listeningPort = document.getElementById('listening-port').value;

      //validate supplied values before attempying to update the server settings
      if (!maxConcurrentProcesses || !maxHandlerProcessRuntime || !listeningPort) {
        alert('Please fill in all required fields.');
        return;
      }

      //maxConcurrent process must be more than 1 and less than 1000
      if (maxConcurrentProcesses < 1 || maxConcurrentProcesses > 1000) {
        alert('Max Concurrent Processes must be between 1 and 1000.');
        return;
      }

      //maxHandlerProcessRuntime must be more than or equal to 1 and less than 600 seconds (10 minutes)`
      if (maxHandlerProcessRuntime < 1 || maxHandlerProcessRuntime > 3600) {
        alert('Max Handler Process Runtime must be between 1 and 3600 seconds.');
        return;
      }

      //listeningPort must be more than or equal to 1024 and less than 65535
      if (listeningPort < 1024 || listeningPort > 65535) {
        alert('Listening Port must be between 1024 and 65535.');
        return;
      }


      //make a copy of the cached settings to update with the new values
      const updatedSettings = JSON.parse(JSON.stringify(CACHED_SETTINGS));

      //update the copied settings with the new values from the UI
      updatedSettings.GeneralSettings.MaxConcurrentProcesses = parseInt(maxConcurrentProcesses);
      updatedSettings.GeneralSettings.MaxHandlerProcessRuntime = parseInt(maxHandlerProcessRuntime);
      updatedSettings.GeneralSettings.ListeningPort = parseInt(listeningPort);

      //send the updated settings to the server for saving
      try {
        const response = await fetch('api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedSettings)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Settings saved successfully.', result);
        alert('Settings saved successfully. The server may need to be restarted for some changes to take effect.');
        // Update cached settings with the new values
        CACHED_SETTINGS = updatedSettings;
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
      }

      
    });
  }

  //attach event listener function to the "save security settings" button...
  if (securitySettingsSaveBtn) {
    securitySettingsSaveBtn.addEventListener('click', async function (e) {
          e.preventDefault();

         console.log('Security settings save button clicked');

        //grab security settings values from the UI
        const email = document.getElementById('security-email').value;
        const passphrase = document.getElementById('security-passphrase').value;
        const authenticationMethod = document.getElementById('security-authentication-method').value;
        const tokenExpiration = document.getElementById('security-token-expiration').value;
        const tokenCookieName = document.getElementById('security-token-cookie-name').value;
        const enableCORS = document.getElementById('security-enable-cors').checked;
        const allowedOrigins = document.getElementById('security-allowed-origins').value.split(',');
  
        //validate supplied values before attempying to update the server settings
        if (!email || !passphrase || !authenticationMethod || !tokenExpiration || !tokenCookieName) {
          alert('Please fill in all required fields.');
          return;
        }

        //make a copy of the cached settings to update with the new values
        const updatedSettings = JSON.parse(JSON.stringify(CACHED_SETTINGS));

        //update the copied settings with the new values from the UI
        updatedSettings.SecuritySettings.Email = email;
        updatedSettings.SecuritySettings.Passphrase = passphrase;
        updatedSettings.SecuritySettings.AuthenticationMethod = authenticationMethod;
        updatedSettings.SecuritySettings.TokenExpirationMinutes = parseInt(tokenExpiration);
        updatedSettings.SecuritySettings.AuthTokenCookieName = tokenCookieName;
        updatedSettings.SecuritySettings.EnableCORS = enableCORS;
        updatedSettings.SecuritySettings.AllowedOrigins = allowedOrigins;

        //send the updated settings to the server for saving
        try {
          const response = await fetch('api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSettings)
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log('Settings saved successfully:', result);
          alert('Settings saved successfully. The server may need to be restarted for some changes to take effect.');
          // Update cached settings with the new values
          CACHED_SETTINGS = updatedSettings;
        } catch (error) {
          console.error('Error saving settings:', error);
          alert('Error saving settings. Please try again.');
        }

    });
  }

   //prep the settings UI with data from the server
   prepareSettingsUI();

  // Check URL for panel parameter and show the appropriate panel
  const targetPanel = parseTargetPanelFromURL();
  if (targetPanel === 'security') {
    showGeneralSettingsPanel(securityBtn);
  } else {
    showGeneralSettingsPanel(systemBtn);
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


const parseTargetPanelFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('panel');
}


async function fetchServerSettings() {
    try {
        const response = await fetch('api/settings');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const settings = await response.json();
        CACHED_SETTINGS = settings;
        return settings;
    } catch (error) {
        console.error('Error fetching server settings:', error);
        return null;
    }

}


const updateSettingsUI = (settings) => {
    if (!settings) {
        console.error('No settings data available to update UI.');
        return;
    }

    // Update the UI elements with the fetched settings...

    //first general settings
    document.getElementById('max-handler-processes').value = settings.GeneralSettings.MaxConcurrentProcesses || 'N/A';
    document.getElementById('max-handler-process-runtime').value = settings.GeneralSettings.MaxHandlerProcessRuntime || 'N/A';
    document.getElementById('listening-port').value = settings.GeneralSettings.ListeningPort || 'N/A';

    //then security settings
    //security-email
    //security-passphrase
    //security-authentication-method
    //security-token-expiration
    //security-token-cookie-name
    //security-enable-cors
    //security-allowed-origins
    
    document.getElementById('security-email').value = settings.SecuritySettings.Email || 'N/A';
    document.getElementById('security-passphrase').value = settings.SecuritySettings.Passphrase || 'N/A';
    document.getElementById('security-authentication-method').value = settings.SecuritySettings.AuthenticationMethod || 'N/A';
    document.getElementById('security-token-expiration').value = settings.SecuritySettings.TokenExpirationMinutes || 'N/A';
    document.getElementById('security-token-cookie-name').value = settings.SecuritySettings.AuthTokenCookieName || 'N/A';
    document.getElementById('security-enable-cors').checked = settings.SecuritySettings.EnableCORS || false;
    document.getElementById('security-allowed-origins').value = settings.SecuritySettings.AllowedOrigins || 'N/A';
   
}

const prepareSettingsUI = async () => {
    const settings = await fetchServerSettings();
    updateSettingsUI(settings);
}


