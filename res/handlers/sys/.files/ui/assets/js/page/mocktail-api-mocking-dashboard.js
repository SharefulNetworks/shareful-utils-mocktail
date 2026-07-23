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
      const serverStatsResponse = await fetch('../admin/api/serverstats');
      if (!serverStatsResponse.ok) {
        throw new Error(`HTTP error! status: ${serverStatsResponse.status}`);
      }
      const serverStatsResponseData = await serverStatsResponse.json();

      //...then fetch the endpoint stats from the MockingController
      const endpointStatsResponse = await fetch('api/collections/endpointstats')
      if(!endpointStatsResponse.ok){
        throw new Error(`HTTP error! status: ${endpointStatsResponse.status}`);
      }
      const endpointStatsResponseData = await endpointStatsResponse.json();

      //finally update the dashboard with the fetched data from both endpoints.
      updateDashboard(serverStatsResponseData, endpointStatsResponseData);

    } catch (error) {
      console.error('Error fetching server stats:', error);
    }
  }
  
  // Function to update the dashboard with fetched data
  function updateDashboard(serverStatsData,endpointStatsData) {
    document.getElementById('admin-user-email').textContent = serverStatsData.adminUserEmail;
    document.getElementById('max-process-limit').textContent = serverStatsData.maxProcessLimit;
    document.getElementById('current-process-usage').textContent = serverStatsData.processUtilizationHistory[getCurrentMinute()];
    document.getElementById('server-uptime').textContent = formatUptime(serverStatsData.serverUptime);
    updateAPIEndpointStatsChart(endpointStatsData);
    
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


