//--------------------------------------------------------------------------------------------------------
// name: mocktail-api-mocking-dashboard.js
// description: This file contains the JavaScript code for the Mocktail API mocking dashboard page.
// author: Giles Thompson
// date: 2026-07-20
//--------------------------------------------------------------------------------------------------------
 


 //on page load....
 document.addEventListener("DOMContentLoaded", function () {

  //render process utilization chart, with initial zeroed data values, these will be updated by the data returned from the server stats API endpoint.
  renderAPIMockingStatsChart();


  // Initial stats fetch on page load
  fetchServerStats();
  
  // Setup interval to fetch server stats every 10 seconds
  setInterval(fetchServerStats, 10000)  
  

 });


  // Function to fetch server stats from the AdminController
  async function fetchServerStats() {
    try {
      const response = await fetch('../admin/api/serverstats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      updateDashboard(data);
    } catch (error) {
      console.error('Error fetching server stats:', error);
    }
  }
  
  // Function to update the dashboard with fetched data
  function updateDashboard(data) {
    document.getElementById('admin-user-email').textContent = data.adminUserEmail;
    document.getElementById('max-process-limit').textContent = data.maxProcessLimit;
    document.getElementById('current-process-usage').textContent = data.processUtilizationHistory[getCurrentMinute()];
    document.getElementById('server-uptime').textContent = formatUptime(data.serverUptime);
    //updateProcessUtilizationChart(data.processUtilizationHistory);
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
   

 const getCurrentMinute = () => {
    const now = new Date();
    return now.getMinutes();
  };




  const renderAPIMockingStatsChart = () => {

    // this wiil be the name of the top 10 mock API endpoints that have been called, as returned from
    // the backend MockingController, which essentially hould be the full path to the endpoint inclusive 
    // of the mock api collection id.
    var chartLabelData = []

    // this will hold the chart data that captures the top 10 endpoints that have been called since the last update
    // as returned from the backend MockingController.
    var chartData = []

    var ctx = document.getElementById("myChart2").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        datasets: [
          {
            label: "Statistics",
            data: [460, 458, 330, 502, 430, 610, 488],
            borderWidth: 2,
            backgroundColor: 'rgba(103, 119, 239, 0.2)',
            borderColor: "#6777ef",
            borderWidth: 2.5,
            pointBackgroundColor: "#ffffff",
            pointRadius: 4,
          },
        ],
      },
      options: {
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
                stepSize: 150,
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


