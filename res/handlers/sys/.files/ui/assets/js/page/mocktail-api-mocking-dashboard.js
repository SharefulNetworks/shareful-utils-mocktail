//--------------------------------------------------------------------------------------------------------
// name: mocktail-api-mocking-dashboard.js
// description: This file contains the JavaScript code for the Mocktail API mocking dashboard page.
// author: Giles Thompson
// date: 2026-07-20
//--------------------------------------------------------------------------------------------------------
 

//var to hold the endpoint stats chart UI canvas.
var endpointStatsChart;
var endpointEditor;


 //on page load....
 document.addEventListener("DOMContentLoaded", function () {

  //render process utilization chart, with initial zeroed data values, these will be updated by the data returned from the server stats API endpoint.
  renderAPIEndpointStatsChart();

  //setup the mock API collection endpoint editor CodeMirror instance
  setupMockAPICollectionEndpointEditor();

  //setup the UI button event listeners
  setupUIBtnEventListeners();

  // Initial stats fetch on page load
  fetchServerStats();
  
  // Setup interval to fetch server stats every 10 seconds
  setInterval(fetchServerStats, 10000)  
  

 });


  // Function to fetch server stats from the AdminController
  async function fetchServerStats() {
    try {

     
      //first general server stats from the AdminController...
      const serverStatsResponseData = await fetchFromBackendJSONAPIviaGET('../admin/api/serverstats');

      //then fetch the endpoint stats from the MockingController...
      const endpointStatsResponseData = await fetchFromBackendJSONAPIviaGET('api/collections/endpointstats');

      //next fetch mock API collection metadata from the MockingController, this is used to populate the main Mocktail dashboard, 
      //table with the list of mock API collections 
      const mockAPICollectionMetadataResponseData = await fetchFromBackendJSONAPIviaGET('api/collections');``


      //finally update the dashboard with the fetched data from both endpoints.
      updateDashboard(serverStatsResponseData, endpointStatsResponseData, mockAPICollectionMetadataResponseData);

    } catch (error) {
      console.error('Error fetching server stats:', error);
    }
  }

  //fetches data from the backend API via GET request
  async function fetchFromBackendJSONAPIviaGET(endpointURL){

      const resp = await fetch(endpointURL);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      return data;
  }


  //fetches from the backend API via a DELETE request.
  async function fetchFromBackendJSONAPIviaDELETE(endpointURL) {
    const resp = await fetch(endpointURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  }



  //fetches data from the backend API via POST request
  async function fetchFromBackendJSONAPIviaPOST(endpointURL, payload) {
    const resp = await fetch(endpointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  }


    //fetches data from the backend API via PUT request
  async function fetchFromBackendJSONAPIviaPUT(endpointURL, payload) {
    const resp = await fetch(endpointURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  }



function formatJSONForEditor(value) {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    console.error('Unable to format JSON for editor:', error);
    return String(value);
  }
}

function validateEndpointEditorJSON() {
  const validationMessage = document.getElementById('endpoint-json-validation-message');
  if (!endpointEditor || !validationMessage) {
    return false;
  }

  const editorValue = endpointEditor.getValue();

  try {
    JSON.parse(editorValue);
    validationMessage.className = 'alert alert-success mt-2 mb-0 py-2 px-3';
    validationMessage.textContent = 'Valid JSON.';
    return true;
  } catch (error) {
    validationMessage.className = 'alert alert-danger mt-2 mb-0 py-2 px-3';
    validationMessage.textContent = `Invalid JSON: ${error.message}`;
    return false;
  }
}
  
  // Function to update the dashboard with fetched data
  function updateDashboard(serverStatsData,endpointStatsData,mockAPICollectionMetadataData) {
    document.getElementById('admin-user-email').textContent = serverStatsData.adminUserEmail;
    document.getElementById('max-process-limit').textContent = serverStatsData.maxProcessLimit;
    document.getElementById('current-process-usage').textContent = serverStatsData.processUtilizationHistory[getCurrentMinute()];
    document.getElementById('server-uptime').textContent = formatUptime(serverStatsData.serverUptime);
    document.getElementById('mock-apis').textContent = getJSONArrayCount(mockAPICollectionMetadataData);
    updateAPIEndpointStatsChart(endpointStatsData);
    updateMockAPICollectionTable(mockAPICollectionMetadataData);
    
  }


  // Function to format uptime in a human-readable format
  function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }



  function updateAPIEndpointStatsChart(endpointStats){

     //console.log("Updating API Endpoint Stats Chart with data: ", endpointStats);

      //update each of the entries in the array of endpoint stats to the chart data, and then update the chart.
      //the chart data is an array of the top 10 endpoints that have been called since the last update, as returned from the backend MockingController.
      //the chart labels are the names of the top 10 endpoints that have been called since the last update, as returned from the backend MockingController.

      var chartData = endpointStats.map(stat => stat.Count);
      var chartLabels = endpointStats.map((stat) => [
        `Path: ${stat.Path}`,
        `Method: ${stat.Method}`,
        `EndpointId: ${stat.EndpointId}`,
        `CollectionId: ${stat.CollectionId}`,
      ]);

      if (chartData.length === 0) {
        // if there is no data to display, show the "No Data Available" label
        document.getElementById("no-data-label").style.display = "block";
      } else {
        // if there is data to display, hide the "No Data Available" label
        document.getElementById("no-data-label").style.display = "none";
      }


      endpointStatsChart.data.datasets[0].data = chartData;
      endpointStatsChart.data.labels = chartLabels;
      endpointStatsChart.update();
  }


 function getJSONArrayCount(jsonArray) {
    if (!Array.isArray(jsonArray)) {
        console.error("Provided data is not an array:", jsonArray);
        return 0;
    }
    return jsonArray.length;
  }

 const getCurrentMinute = () => {
    const now = new Date();
    return now.getMinutes();
  };




  const renderAPIEndpointStatsChart = () => {

  
    // this will hold the chart data that captures the top 10 endpoints that have been called since the last update
    // as returned from the backend MockingController.
    var chartData = []


    if (chartData.length === 0) {
      // if there is no data to display, show the "No Data Available" label
      document.getElementById("no-data-label").style.display = "block";
    } else {
      // if there is data to display, hide the "No Data Available" label
      document.getElementById("no-data-label").style.display = "none";
    }

    var ctx = document.getElementById("myChart2").getContext("2d");
    endpointStatsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "1st Endpoint",
          "2nd Endpoint",
          "3rd Endpoint",
          "4th Endpoint",
          "5th Endpoint",
          "6th Endpoint",
          "7th Endpoint",
          "8th Endpoint",
          "9th Endpoint",
          "10th Endpoint",
        ],
        datasets: [
          {
            label: "Request Count",
            data: chartData,
            borderWidth: 2,
            backgroundColor: "rgba(103, 119, 239, 0.2)",
            borderColor: "#6777ef",
            borderWidth: 2.5,
            pointBackgroundColor: "#ffffff",
            pointRadius: 4,
          },
        ],
      },
      options: {
        tooltips: {
          bodyFontSize: 12,
          titleFontSize: 12,
         
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "#f2f2f2",
              },
              ticks: {
                beginAtZero: true,
                stepSize: 5,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: false,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });
  };


  const showGeneralSettingsPanel = (clickedElement) => {
    const systemSettingsCard = document.getElementById('system-settings-card');
    const securitySettingsCard = document.getElementById('security-settings-card');

    // Hide both cards initially
    systemSettingsCard.style.display = 'none';
    securitySettingsCard.style.display = 'none';

    // Remove 'active' class from both buttons
    document.getElementById('system-settings-btn').classList.remove('active');
    document.getElementById('security-settings-btn').classList.remove('active');

    // Show the appropriate card based on the clicked button and add 'active' class to it
    if (clickedElement.id === 'system-settings-btn') {
      systemSettingsCard.style.display = 'block';
      clickedElement.classList.add('active');
    } else if (clickedElement.id === 'security-settings-btn') {
      securitySettingsCard.style.display = 'block';
      clickedElement.classList.add('active');
    }
  }


  function addMockApiRow(name, rootPath, endpointCount, onEdit, onDelete) {
    const tbody = document.querySelector("#mockApiTable tbody");

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            <a href="#" class="font-weight-600">${name}</a>
        </td>
        <td><a href="#" class="font-weight-600">/${rootPath}</a></td>
        <td>${endpointCount}</td>
        <td>
            <a class="btn btn-primary btn-action mr-1" title="Edit">
                <i class="fas fa-pencil-alt"></i>
            </a>
           
             <a class="btn btn-danger btn-action" data-toggle="tooltip" title="Delete" data-confirm="Are You Sure?|This action can not be undone. Do you want to continue?" data-confirm-yes="alert('Deleted')"><i class="fas fa-trash"></i></a>
        </td>
    `;

    tr.querySelector(".btn-primary").addEventListener("click", onEdit);
    tr.querySelector(".btn-danger").addEventListener("click", onDelete);

    tbody.appendChild(tr);
}

function addMockApiCollectionEndpointRow(endpointId,path, method,response, onEdit, onDelete) {
    const tbody = document.querySelector("#mockApiCollectionEndpointsTable tbody");

    const tr = document.createElement("tr");
    const formattedResponse = formatJSONForEditor(response);

    tr.innerHTML = `
        <td id="endpoint-id-${endpointId}">${endpointId}</td>
        <td id="endpoint-path-${endpointId}">${path}</td>
        <td id="endpoint-method-${endpointId}">${method}</td>  
    <input type ="hidden" id="endpoint-response-${endpointId}" value='${formattedResponse.replace(/'/g, "&#39;")}'>
        <td>
            <a class="btn btn-primary btn-action mr-1" title="Edit">
                <i class="fas fa-pencil-alt"></i>
            </a>
          
             <a class="btn btn-danger btn-action" data-toggle="tooltip" title="Delete" data-confirm="Are You Sure?|This action can not be undone. Do you want to continue?" data-confirm-yes="alert('Deleted')"><i class="fas fa-trash"></i></a>
        </td>
    `;

    tr.querySelector(".btn-primary").addEventListener("click", onEdit);
    tr.querySelector(".btn-danger").addEventListener("click", onDelete);

    tbody.appendChild(tr);
} 


function updateMockAPICollectionTable(mockAPICollectionMetadataData) {

  //first define function that is called when mock api collection deletion is confirmed.
  const onMockAPICollectionDeleteConfirmed = (collectionId) => {
    console.log(`Confirmed delete of collection with ID: ${collectionId}`);

    // Here we call the backend API to delete the collection.
     apiCallMockAPICollectionDelete(collectionId);

    //finally close the deletion dialog
    $('#mockAPICollectionDeleteModal').modal('hide'); 
  }

  const tbody = document.querySelector("#mockApiTable tbody");
  tbody.innerHTML = ""; // Clear existing rows
  mockAPICollectionMetadataData.forEach((collection) => {
      addMockApiRow(collection.Name, 
                    collection.CollectionId,     //the collection id, preceeded with a forward slash, is the root path for the mock API collection, so we can display it in the table.
                    collection.EndpointCount, 
                    () => { console.log(`Edit ${collection.Name}`);  populateMockAPICollectionDetailsPanel(collection.CollectionId); }, 
                    () => { console.log(`Delete ${collection.Name}`); showMockAPICollectionDeleteConfirmationModal(() => { onMockAPICollectionDeleteConfirmed(collection.CollectionId); },collection.CollectionId); });
                    });
                    
}


function updateMockAPICollectionDetailsPanelOverview(mockAPICollectionDetails) {
  document.getElementById('collection-name').textContent = mockAPICollectionDetails.Name;
  document.getElementById('collection-description').textContent = mockAPICollectionDetails.Description;
  document.getElementById('collection-id').textContent = mockAPICollectionDetails.CollectionId;
}

function updateMockAPICollectionDetailsPanelEndpointsTable(mockAPICollectionDetailsEndpoints,collId) {

   //first define function that is called when mock api collection endpoint deletion is confirmed.
  const onMockAPICollectionEndpointDeleteConfirmed = (endpointId) => {
    console.log("Confirmed delete of endpoint with ID: ", endpointId, " in collection with ID: ", collId);

    // Here we call the backend API to delete the endpoint.
    apiCallMockAPICollectionEndpointDelete(collId, endpointId);

   
    //finally close the deletion dialog
    $('#mockAPICollectionEndpointDeleteModal').modal('hide'); 
  }

  const onMockAPICollectionEndpointEditConfirmed = (endpointId, collectionId) => {
    console.log(`Confirmed edit of endpoint with ID: ${endpointId}`);

    // grab the edited values from the modal fields/editor
    const endpointMethodInput = document.getElementById('endpoint-method-input');
    const endpointPathInput = document.getElementById('endpoint-path-input');
    const endpointMethod = endpointMethodInput ? endpointMethodInput.value.trim().toUpperCase() : '';
    const endpointPath = endpointPathInput ? endpointPathInput.value.trim() : '';
    const editedResponse = endpointEditor ? endpointEditor.getValue() : document.getElementById('endpoint-editor-textarea').value;
    console.log(`Edited response for endpoint ${endpointId}: ${editedResponse}`);

    // Here we call the backend API to edit the endpoint.
    apiCallMockAPICollectionEndpointUpdate(endpointId, collectionId, endpointMethod, endpointPath, editedResponse);

    //finally close the edit dialog
    $('#mockAPICollectionEndpointEditorModal').modal('hide');

  }

  const tbody = document.querySelector("#mockApiCollectionEndpointsTable tbody");
  tbody.innerHTML = ""; // Clear existing rows
  mockAPICollectionDetailsEndpoints.forEach((endpoint) => {
      addMockApiCollectionEndpointRow(endpoint.Id, 
                                      endpoint.Path, 
                                      endpoint.Method, 
                                      endpoint.Response,
                                     () => { console.log(`Edit ${endpoint.Path}`); showMockAPICollectionEndpointEditorModal(() => { onMockAPICollectionEndpointEditConfirmed(endpoint.Id, collId); },endpoint.Id); },
                                     () => { console.log(`Delete ${endpoint.Path}`); showMockAPICollectionEndpointDeleteConfirmationModal(
                                                                                                  () => { onMockAPICollectionEndpointDeleteConfirmed(endpoint.Id); },
                                                                                                  endpoint.Id); });
                    });
}


// Function to populate the Mock API Collection Details Panel, this will display the
// list of endpoints for a specific mock API collection, when the user selects the collection 
// in the main dashboard table.
function populateMockAPICollectionDetailsPanel(collectionId) {

    //firstly display the Mock API Collection Details Panel, where its not alrrady visible.
    const detailsPanel = document.getElementById('mockApiCollectionDetailsPanel');
    if (detailsPanel.style.display === 'none' || detailsPanel.style.display === '') {
        detailsPanel.style.display = 'block';
    }

    //then crucially fetch the mock API collection details from the MockingController, this is used to populate the main Mocktail dashboard, 
    //table with the list of mock API collections 
    fetchFromBackendJSONAPIviaGET(`api/collections/${collectionId}`)
    .then(mockAPICollectionDetails => {
        updateMockAPICollectionDetailsPanelOverview(mockAPICollectionDetails);
        updateMockAPICollectionDetailsPanelEndpointsTable(mockAPICollectionDetails.Endpoints, collectionId);
    })
    .catch(error => {
        console.error('Error fetching mock API collection details:', error);
    });
}


function showMockAPICollectionDeleteConfirmationModal(onConfirm, collectionId) {
    $('#mockAPICollectionDeleteModal').modal('show');
    $('#confirmDelete').off('click').on('click', onConfirm);
    document.getElementById('collection-id-to-delete').textContent = collectionId;
}

function showMockAPICollectionEndpointDeleteConfirmationModal(onConfirm, endpointId) {
    $('#mockAPICollectionEndpointDeleteModal').modal('show');
    $('#confirmDeleteEndpoint').off('click').on('click', onConfirm);
    document.getElementById('collection-endpoint-id-to-delete').textContent = endpointId;
}



function showMockAPICollectionEndpointEditorModal(onSave,endpointId,forCreation = false) {

  $('#mockAPICollectionEndpointEditorModal').modal('show');

  if (forCreation) {

    // Clear the form for creating a new endpoint
    document.getElementById('endpoint-path-input').value = '';
    document.getElementById('endpoint-method-input').value = 'GET';

    //build a default response with an empty body and set it as the value of the CodeMirror editor.
    const defaultResponse = {
      "Body": {}
    };


    if (endpointEditor) {
      endpointEditor.setValue(JSON.stringify(defaultResponse, null, 2));
    } else {
      document.getElementById('endpoint-editor-textarea').value = JSON.stringify(defaultResponse, null, 2);
    }

  } else {

      //get the current path for the endpoint from the table row, and set it as the value of the path input field in the modal.
      const pathElement = document.getElementById(`endpoint-path-${endpointId}`);
      const path = pathElement ? pathElement.textContent.trim() : '';
      document.getElementById('endpoint-path-input').value = path;
    
      //get the current method for the endpoint from the table row, and set it as the value of the method input field in the modal.
      const methodElement = document.getElementById(`endpoint-method-${endpointId}`);
      const method = methodElement ? methodElement.textContent.trim().toUpperCase() : '';
      const methodInput = document.getElementById('endpoint-method-input');
      methodInput.value = method;
      if (!methodInput.value) {
        methodInput.value = 'GET';
      }
    
    
      //get the current response for the endpoint from the hidden input field in the table row, and set it as the value of the CodeMirror editor.
      const editorContent = document.getElementById(`endpoint-response-${endpointId}`).value;
    
      if (endpointEditor) {
        endpointEditor.setValue(formatJSONForEditor(editorContent));
      } else {
        document.getElementById('endpoint-editor-textarea').value = formatJSONForEditor(editorContent);
      }
   
 }

  validateEndpointEditorJSON();
  $('#confirmEditEndpoint').off('click').on('click', onSave);
  
}

function showMockAPICollectionCreationModal(onCreate) {
  $('#mockAPICollectionCreationModal').modal('show');
  $('#confirmCreateCollection').off('click').on('click', onCreate);
  
}

function setupMockAPICollectionEndpointEditor() {

  endpointEditor = CodeMirror.fromTextArea(document.getElementById("endpoint-editor-textarea"), {
    mode: "application/json",
    theme: "darcula",

    lineNumbers: true,

    lint: {
      getAnnotations: CodeMirror.lint.json,
      lintOnChange: false,
      highlightLines: true,
      delay: 0,
      onUpdateLinting: function(_annotationsNotSorted, annotations) {
        const validationMessage = document.getElementById('endpoint-json-validation-message');
        if (!validationMessage) {
          return;
        }

        if (annotations.length === 0) {
          return;
        }

        const firstError = annotations[0];
        const message = firstError && firstError.message ? firstError.message : 'Invalid JSON.';
        validationMessage.className = 'alert alert-danger mt-2 mb-0 py-2 px-3';
        validationMessage.textContent = `Invalid JSON: ${message}`;
      }
    },

    matchBrackets: true,
    autoCloseBrackets: true,

    foldGutter: true,

    gutters: [
        "CodeMirror-lint-markers",
        "CodeMirror-foldgutter"
    ]
});

  $('#mockAPICollectionEndpointEditorModal').on('shown.bs.modal', function () {
    if (endpointEditor) {
      endpointEditor.refresh();
      validateEndpointEditorJSON();
      endpointEditor.performLint();
    }
  });

  endpointEditor.on('keyup', function() {
    validateEndpointEditorJSON();
    endpointEditor.performLint();
  });

  endpointEditor.on('change', function() {
    validateEndpointEditorJSON();
  });
}


function setupUIBtnEventListeners() {


  //attach function for the add mock API collection button click event, this will show the modal for creating a new mock API collection.
  $('#addMockAPICollectionBtn').on('click', function() {
    // Handle add endpoint button click
    console.log("Add Mock API Collection button clicked");

    //call helper to show the Mock API Collection creation modal passing in a callback function
    //to execute when the user confirms the creation of a new mock API collection.
    showMockAPICollectionCreationModal(() => {
      console.log("Create Collection confirmed");

      //call the backend API to create the new mock API collection.
      apiCallMockAPICollectionCreate();

    });

  });


  //attach function for the add mock API collection endpoint button click event, this will show the modal for creating a new endpoint.
  $('#addMockAPICollectionEndpointBtn').on('click', function() {
    // Handle add endpoint button click
    console.log("Add Mock API Collection Endpoint button clicked");

    //grab referece to the collection id from the overview panel, this is the collection that the new endpoint will be added to.
    const targetCollectionId = document.getElementById('collection-id').textContent.trim();
    console.log("Collection ID for new endpoint: ", targetCollectionId);


    // define cunction to execute once the endpoint creation is confirmed.
    const onMockAPICollectionEndpointCreationConfirmed = (collectionId) => {
         console.log(`Confirmed creation of new endpoint for collection ID: ${collectionId}`);
     
         // grab the edited values from the modal fields/editor
         const endpointMethodInput = document.getElementById('endpoint-method-input');
         const endpointPathInput = document.getElementById('endpoint-path-input');
         const endpointMethod = endpointMethodInput ? endpointMethodInput.value.trim().toUpperCase() : '';
         const endpointPath = endpointPathInput ? endpointPathInput.value.trim() : '';
         const editedResponse = endpointEditor ? endpointEditor.getValue() : document.getElementById('endpoint-editor-textarea').value;

        // Here we call the backend API to create the endpoint.
        apiCallMockAPICollectionEndpointCreate(targetCollectionId, endpointMethod, endpointPath, editedResponse);

        //finally close the edit dialog
        $('#mockAPICollectionEndpointEditorModal').modal('hide');
     
    }
     

    //call helper to show the Mock API Collection Endpoint creation modal passing in a callback function
    //to execute when the user confirms the creation of a new mock API collection endpoint.
    showMockAPICollectionEndpointEditorModal(() => { onMockAPICollectionEndpointCreationConfirmed(targetCollectionId); }, null, true);

  });

  
}


function apiCallMockAPICollectionCreate(){

      console.log("Calling backend API to create new Mock API Collection...");

      //grab values from the collection name and description fields.
      const collectionName = document.getElementById('collectionName').value;
      const collectionDescription = document.getElementById('collectionDescription').value;

      //create a JSON object comprising of these fields to send to the backend API endpoint.
      const newCollectionData = {
        Name: collectionName,
        Description: collectionDescription
      };

      //send the new collection data to the backend API endpoint to create the new mock API collection.
      fetchFromBackendJSONAPIviaPOST('api/collections', newCollectionData)
      .then(data => {
        console.log('New Mock API Collection created:', data);
        // Close the modal
        $('#mockAPICollectionCreationModal').modal('hide');

        // Refresh the dashboard to show the new collection
        fetchServerStats();
      })
      .catch(error => {
        console.error('Error creating new Mock API Collection:', error);
      });

}


function apiCallMockAPICollectionDelete(collectionId){

   fetchFromBackendJSONAPIviaDELETE(`api/collections/${collectionId}`)
    .then(data => {
      console.log('Mock API Collection deleted:', data);
      // Close the modal
      $('#mockAPICollectionDeleteModal').modal('hide');

      // Refresh the dashboard to remove the deleted collection
      fetchServerStats();
    })
    .catch(error => {
      console.error('Error deleting Mock API Collection:', error);
    });

}

function apiCallMockAPICollectionEndpointUpdate(endpointId,collectionId,endpointMethod,endpointPath,updatedResponse){

    let normalizedResponse = updatedResponse;
    if (typeof updatedResponse === 'string') {
      try {
        normalizedResponse = JSON.parse(updatedResponse);
      } catch (_error) {
        normalizedResponse = updatedResponse;
      }
    }

    //build up payload which will contain  the endpoint path, method and response,
    const endpointPayload = {
        Path: endpointPath || '',
        Method: endpointMethod || '',
        Response: normalizedResponse
    };

    console.log('Endpoint update payload:', endpointPayload);

    fetchFromBackendJSONAPIviaPUT(`api/collections/${collectionId}/endpoints/${endpointId}`, endpointPayload)
    .then(data => {
      console.log('Mock API Collection Endpoint updated:', data);
      // Close the modal
      $('#mockAPICollectionEndpointEditorModal').modal('hide');

      // Refresh the endpoints panel to show the updated endpoint
      populateMockAPICollectionDetailsPanel(collectionId);

    })
    .catch(error => {
      console.error('Error updating Mock API Collection Endpoint:', error);
    });

}

function apiCallMockAPICollectionEndpointDelete(collectionId, endpointId){

  fetchFromBackendJSONAPIviaDELETE(`api/collections/${collectionId}/endpoints/${endpointId}`)
    .then(data => {
      console.log('Mock API Collection Endpoint deleted:', data);
      // Close the modal
      $('#mockAPICollectionEndpointDeleteModal').modal('hide');

      // Refresh the endpoints panel to remove the deleted endpoint
      populateMockAPICollectionDetailsPanel(collectionId);
    })
    .catch(error => {
      console.error('Error deleting Mock API Collection Endpoint with ID from collection with ID:', endpointId, 'in collection:', collectionId, ':', error);
    });

}

function apiCallMockAPICollectionEndpointCreate(
  collectionId,
  endpointMethod,
  endpointPath,
  endpointResponse,
) {
  let normalizedResponse = endpointResponse;
  if (typeof endpointResponse === "string") {
    try {
      normalizedResponse = JSON.parse(endpointResponse);
    } catch (_error) {
      normalizedResponse = endpointResponse;
    }
  }

  //build up payload which will contain  the endpoint path, method and response,
  const endpointPayload = {
    Path: endpointPath || "",
    Method: endpointMethod || "",
    Response: normalizedResponse,
  };

  console.log("Endpoint creation payload:", endpointPayload);

  fetchFromBackendJSONAPIviaPOST(
    `api/collections/${collectionId}/endpoints`,
    endpointPayload
  )
    .then((data) => {
      console.log("Mock API Collection Endpoint created:", data);
      // Close the modal
      $("#mockAPICollectionEndpointEditorModal").modal("hide");

      // Refresh the endpoints panel to show the new endpoint
      populateMockAPICollectionDetailsPanel(collectionId);
    })
    .catch((error) => {
      console.error(
        "Error creating Mock API Collection Endpoint:",
        error
      );
    });
}



  




