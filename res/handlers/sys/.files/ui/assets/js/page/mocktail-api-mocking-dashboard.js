//--------------------------------------------------------------------------------------------------------
// name: mocktail-api-mocking-dashboard.js
// description: This file contains the JavaScript code for the Mocktail API mocking dashboard page.
// author: Giles Thompson
// date: 2026-07-20
//--------------------------------------------------------------------------------------------------------
 

//var to hold the endpoint stats chart UI canvas.
var endpointStatsChart;


 //on page load....
 document.addEventListener("DOMContentLoaded", function () {

  //render process utilization chart, with initial zeroed data values, these will be updated by the data returned from the server stats API endpoint.
  renderAPIEndpointStatsChart();


  // Initial stats fetch on page load
  fetchServerStats();
  
  // Setup interval to fetch server stats every 10 seconds
  setInterval(fetchServerStats, 10000)  
  

 });


  // Function to fetch server stats from the AdminController
  async function fetchServerStats() {
    try {

     
      //first general server stats from the AdminController...
      const serverStatsResponseData = await fetchFromBackendJSONAPI('../admin/api/serverstats');

      //then fetch the endpoint stats from the MockingController...
      const endpointStatsResponseData = await fetchFromBackendJSONAPI('api/collections/endpointstats');

      //next fetch mock API collection metadata from the MockingController, this is used to populate the main Mocktail dashboard, 
      //table with the list of mock API collections 
      const mockAPICollectionMetadataResponseData = await fetchFromBackendJSONAPI('api/collections');``


      //finally update the dashboard with the fetched data from both endpoints.
      updateDashboard(serverStatsResponseData, endpointStatsResponseData, mockAPICollectionMetadataResponseData);

    } catch (error) {
      console.error('Error fetching server stats:', error);
    }
  }

  //fetches the mock API collection metadata from the MockingController, this is used to populate the main Mocktail dashboard, 
  // table with the list of mock API collections 
  async function fetchFromBackendJSONAPI(endpointURL){

      const resp = await fetch(endpointURL);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      return data;
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

     console.log("Updating API Endpoint Stats Chart with data: ", endpointStats);

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
            <a class="btn btn-danger btn-action" title="Delete">
                <i class="fas fa-trash"></i>
            </a>
        </td>
    `;

    tr.querySelector(".btn-primary").addEventListener("click", onEdit);
    tr.querySelector(".btn-danger").addEventListener("click", onDelete);

    tbody.appendChild(tr);
}

function addMockApiCollectionEndpointRow(endpointId,path, method, onEdit, onDelete) {
    const tbody = document.querySelector("#mockApiCollectionEndpointsTable tbody");

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${endpointId}</td>
        <td>${path}</td>
        <td>${method}</td>  
        
        <td>
            <a class="btn btn-primary btn-action mr-1" title="Edit">
                <i class="fas fa-pencil-alt"></i>
            </a>
            <a class="btn btn-danger btn-action" title="Delete">
                <i class="fas fa-trash"></i>
            </a>
        </td>
    `;

    tr.querySelector(".btn-primary").addEventListener("click", onEdit);
    tr.querySelector(".btn-danger").addEventListener("click", onDelete);

    tbody.appendChild(tr);
} 


function updateMockAPICollectionTable(mockAPICollectionMetadataData) {
  const tbody = document.querySelector("#mockApiTable tbody");
  tbody.innerHTML = ""; // Clear existing rows
  mockAPICollectionMetadataData.forEach((collection) => {
      addMockApiRow(collection.Name, 
                    collection.CollectionId,     //the collection id, preceeded with a forward slash, is the root path for the mock API collection, so we can display it in the table.
                    collection.EndpointCount, 
                    () => { console.log(`Edit ${collection.Name}`);  populateMockAPICollectionDetailsPanel(collection.CollectionId); }, 
                    () => { console.log(`Delete ${collection.Name}`); });
                    });
                    
}


function updateMockAPICollectionDetailsPanelOverview(mockAPICollectionDetails) {
  document.getElementById('collection-name').textContent = mockAPICollectionDetails.Name;
  document.getElementById('collection-description').textContent = mockAPICollectionDetails.Description;
  document.getElementById('collection-id').textContent = mockAPICollectionDetails.CollectionId;
}

function updateMockAPICollectionDetailsPanelEndpointsTable(mockAPICollectionDetailsEndpoints) {
  const tbody = document.querySelector("#mockApiCollectionEndpointsTable tbody");
  tbody.innerHTML = ""; // Clear existing rows
  mockAPICollectionDetailsEndpoints.forEach((endpoint) => {
      addMockApiCollectionEndpointRow(endpoint.Id, 
                                      endpoint.Path, 
                                      endpoint.Method, 
                                     () => { console.log(`Edit ${endpoint.Path}`); }, 
                                     () => { console.log(`Delete ${endpoint.Path}`); });
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
    fetchFromBackendJSONAPI(`api/collections/${collectionId}`)
    .then(mockAPICollectionDetails => {
        updateMockAPICollectionDetailsPanelOverview(mockAPICollectionDetails);
        updateMockAPICollectionDetailsPanelEndpointsTable(mockAPICollectionDetails.Endpoints);
    })
    .catch(error => {
        console.error('Error fetching mock API collection details:', error);
    });
}



  




