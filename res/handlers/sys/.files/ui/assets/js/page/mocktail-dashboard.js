//--------------------------------------------------------------------------------------------------------
// name: mocktail-dashboard.js
// description: This file contains the JavaScript code for the Mocktail dashboard page.
// author: Giles Thompson
// date: 2026-07-04
//--------------------------------------------------------------------------------------------------------
 
//grab reference to the UI element to render the chart to.
var processUtilizationChartContext;
var processUtilizationChartScrollContainer;

//var to hold the chart UI canvas.
var processUtilisationChart;

 //on page load....
 document.addEventListener("DOMContentLoaded", function () {

  //render process utilization chart, with initial zeroed data values, these will be updated by the data returned from the server stats API endpoint.
  renderProcessUtilizationChart();

  // Initial stats fetch on page load
  fetchServerStats();
  
  // Setup interval to fetch server stats every 10 seconds
  setInterval(fetchServerStats, 10000)  
  

 });


  // Function to fetch server stats from the AdminController
  async function fetchServerStats() {
    try {

      //fetch general server stats from the AdminController.
      const serverStatsResponseData = await fetchFromBackendJSONAPI('api/serverstats');

      //fetch mock API collection metadata from the MockingController.
      const mockAPICollectionMetadataResponseData = await fetchFromBackendJSONAPI('../mock/api/collections');

      updateDashboard(serverStatsResponseData, mockAPICollectionMetadataResponseData);
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
  function updateDashboard(serverStatsData,mockAPICollectionMetadataData) {
    document.getElementById('admin-user-email').textContent = serverStatsData.adminUserEmail;
    document.getElementById('max-process-limit').textContent = serverStatsData.maxProcessLimit;
    document.getElementById('current-process-usage').textContent = serverStatsData.processUtilizationHistory[getCurrentMinute()];
    document.getElementById('server-uptime').textContent = formatUptime(serverStatsData.serverUptime);
    document.getElementById('mock-apis').textContent = getJSONArrayCount(mockAPICollectionMetadataData);
    updateProcessUtilizationChart(serverStatsData.processUtilizationHistory);
    updateMockAPICollectionTable(mockAPICollectionMetadataData);
  }


  // Function to format uptime in a human-readable format
  function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }

  // Function to update the process utilization chart
  function updateProcessUtilizationChart(history) {
    
    // Example: myChart.data.datasets[0].data = history; myChart.update();
    processUtilisationChart.data.datasets[0].data = history;
    processUtilisationChart.data.datasets[0].pointRadius = history.map(value => value === 0 ? 0 : 4); // Update point radius based on new data
    processUtilisationChart.update();
    scrollProcessUtilizationChartToCurrentMinute();
  }

  function scrollProcessUtilizationChartToCurrentMinute() {
    if (!processUtilizationChartScrollContainer) {
      processUtilizationChartScrollContainer = document.getElementById("process-utilization-chart-scroll");
    }

    if (!processUtilizationChartScrollContainer) {
      return;
    }

    const currentMinute = new Date().getMinutes();
    const totalMinutes = 60;
    const scrollRange = processUtilizationChartScrollContainer.scrollWidth - processUtilizationChartScrollContainer.clientWidth;

    if (scrollRange <= 0) {
      return;
    }

    const targetScrollLeft = Math.round((currentMinute / (totalMinutes - 1)) * scrollRange);

    processUtilizationChartScrollContainer.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth"
    });
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


  const renderProcessUtilizationChart = () => {

     //grab reference to the 2D canvas context we'll render the chart to.
     processUtilizationChartContext = document.getElementById("myChart").getContext('2d');
    processUtilizationChartScrollContainer = document.getElementById("process-utilization-chart-scroll");

     //initial chart data.
     var chartData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

     //Instantiate and configure a nw line chart to visualize the process usage stats over the last hour.
     processUtilisationChart = new Chart(processUtilizationChartContext, {
       type: 'line',
       data: {
         //la 
         // bels should be minutes in an hour, so there should be 60 labels.
         labels: ["00:00", "00:01", "00:02", "00:03", "00:04", "00:05", "00:06", "00:07", "00:08", "00:09", "00:10", "00:11", "00:12", "00:13", "00:14", "00:15", "00:16", "00:17", "00:18", "00:19", "00:20", "00:21", "00:22", "00:23", "00:24", "00:25", "00:26", "00:27", "00:28", "00:29", "00:30", "00:31", "00:32", "00:33", "00:34", "00:35", "00:36", "00:37", "00:38", "00:39", "00:40", "00:41", "00:42", "00:43", "00:44", "00:45", "00:46", "00:47", "00:48", "00:49", "00:50", "00:51", "00:52", "00:53", "00:54", "00:55", "00:56", "00:57", "00:58", "00:59"],
         //labels: ["00:10", "00:20", "00:30", "00:40", "00:50", "01:00"],
         datasets: [{
           label: 'Process Utilization Count',
           data: chartData,
           borderWidth: 2,
           backgroundColor: 'rgba(103, 119, 239, 0.2)',
           borderColor: '#6777ef',
           borderWidth: 2.5,
           pointBackgroundColor: '#ffffff',
           pointRadius: chartData.map(value => value === 0 ? 0 : 4) // Set point radius to 0 for zero values, otherwise 4
         }]
       },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              gridLines: {
                drawBorder: false,
                color: '#f2f2f2',
              },
              ticks: {
                beginAtZero: true,
                stepSize: 5
              }
            }],
            xAxes: [{
              ticks: {
                display: false,
                stepSize: 10
              },
              gridLines: {
                display: false
              }
            }]
          },
        }
     });

    scrollProcessUtilizationChartToCurrentMinute();


  }

  function updateMockAPICollectionTable(mockAPICollectionMetadataData) {
    const tbody = document.querySelector("#mockApiTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    mockAPICollectionMetadataData.forEach((collection) => {
        addMockApiRow(collection.Name, 
                      collection.CollectionId,     //the collection id, preceeded with a forward slash, is the root path for the mock API collection, so we can display it in the table.
                      collection.EndpointCount, 
                      () => { console.log(`Edit ${collection.Name}`); displayDashboardSwitchConfirmationDialog() }, 
                      () => { console.log(`Delete ${collection.Name}`); displayDashboardSwitchConfirmationDialog() });
                      });
  }


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
            <a class="btn btn-danger btn-action" title="Delete" style="color: #fff; background-color: rgb(172, 83, 101); border-color: rgb(172, 83, 101);">
                <i class="fas fa-trash"></i>
            </a>
        </td>
    `;

    tr.querySelector(".btn-primary").addEventListener("click", onEdit);
    tr.querySelector(".btn-danger").addEventListener("click", onDelete);

    tbody.appendChild(tr);
}


function displayDashboardSwitchConfirmationDialog(){

  if (window.confirm("You will need to switch the API Mocking Dashboard to complete this action, would you like to proceed?")) {
    window.open(" ../../sys/mock/dashboard", "_self");
  } else {
    console.log("User canceled the switch dashboard action.");
  }

}


