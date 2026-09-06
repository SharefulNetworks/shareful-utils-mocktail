

 console.log("Mocktail Docs JS loaded");

 //trap content loaded event to signal load of page specific logic
 document.addEventListener("DOMContentLoaded", function () {

    //call helper function to attach event listeners to buttons on the page
    setupBtnEventListeners();

 })




 //attaches event listeners to buttons on the page
 function setupBtnEventListeners() {

    //setup generic print button, will be the same for all instances of the button throughout the docs
    setupPrintBtnEventListener();

    //setup generic back button, will be the same for all instances of the button throughout the docs
    setupBackBtnEventListener();

    //setup getting started category menu buttons
    setupGettingStartedCategoryEventListeners();

    //setup dynamic web hosting category menu buttons
    setupDynamicWebHostingCategoryEventListeners();
 }


 function setupPrintBtnEventListener() {
    const printBtns = document.querySelectorAll('.print-btn');
    if (printBtns) {
        printBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default button behavior
                console.log("Print button clicked, triggering print dialog.");
                window.print();
            });
        });
    }else{
        console.error("Print button not found on the page.");
    }
 }  


 function setupBackBtnEventListener() {
    const backBtns = document.querySelectorAll('.back-btn');
    if (backBtns) { 
        backBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default button behavior
                console.log("Back button clicked, navigating back in history.");
                history.back();
            });
        });
    }else{
        console.error("Back button not found on the page.");
    }
 }  


 function setupGettingStartedCategoryEventListeners() {

    const installationCatBtn = document.getElementById('installation-cat-btn');
    const configCatBtn = document.getElementById('config-cat-btn');

    if(installationCatBtn && configCatBtn){
        installationCatBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleGettingStartedCategoryContent('installation');
           
        });

        configCatBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleGettingStartedCategoryContent('configuration');
           
        });
    }else{
        console.error("Getting Started category buttons not found on the page.");
    }
 }


 function setupDynamicWebHostingCategoryEventListeners() {

    const introBtn = document.getElementById('dynamic-web-hosting-into-to-bashlets-btn');
    const writingFirstBashletBtn = document.getElementById('dynamic-web-hosting-writing-first-bashlet-btn');
    const contextBashletsBtn = document.getElementById('dynamic-web-hosting-context-bashlets-btn');
    const examplesBashletsBtn = document.getElementById('dynamic-web-hosting-examples-bashlets-btn');
    const httpHandlerBtn = document.getElementById('dynamic-web-hosting-http-handlers-btn'); 

    if(introBtn && writingFirstBashletBtn && contextBashletsBtn && examplesBashletsBtn && httpHandlerBtn){
        introBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDynamicWebHostingCategoryContent('intro');
        });

        writingFirstBashletBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDynamicWebHostingCategoryContent('writing-first-bashlet');
        });

        contextBashletsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDynamicWebHostingCategoryContent('context');
        });

        examplesBashletsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDynamicWebHostingCategoryContent('examples');
        });

        httpHandlerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleDynamicWebHostingCategoryContent('http-handlers');
        });
    }else{
        console.error("One or more Dynamic Web Hosting category buttons not found on the page.");
    }
 }





 //toggle the display of the getting started category content  based on the button clicked
 function toggleGettingStartedCategoryContent(category) {
    const installationCatBtn = document.getElementById('installation-cat-btn');
    const configCatBtn = document.getElementById('config-cat-btn');
    const installationCard = document.getElementById('system-settings-card');
    const configCard = document.getElementById('configuration-settings-card');

    // Remove active class from all nav-link elements
    installationCatBtn.querySelector('.nav-link').classList.remove('active');
    configCatBtn.querySelector('.nav-link').classList.remove('active');

    if(installationCard && configCard){
        if (category === 'installation') {
            installationCard.style.display = 'block';
            configCard.style.display = 'none';
             installationCatBtn.querySelector('.nav-link').classList.add('active');
        } else if (category === 'configuration') {
            installationCard.style.display = 'none';
            configCard.style.display = 'block';
            configCatBtn.querySelector('.nav-link').classList.add('active');
        }
    }else{
        console.error("One or more Getting Started category content cards not found on the page.");
    }
 }


 //toggle the display of the dynamic web hosting category content based on the button clicked
 function toggleDynamicWebHostingCategoryContent(category) {
    const introBtn = document.getElementById('dynamic-web-hosting-into-to-bashlets-btn');
    const writingFirstBashletBtn = document.getElementById('dynamic-web-hosting-writing-first-bashlet-btn');
    const contextBashletsBtn = document.getElementById('dynamic-web-hosting-context-bashlets-btn');
    const examplesBashletsBtn = document.getElementById('dynamic-web-hosting-examples-bashlets-btn');
    const httpHandlerBtn = document.getElementById('dynamic-web-hosting-http-handlers-btn');
    const introCard = document.getElementById('intro-to-bashlets-card');
    const writingFirstBashletCard = document.getElementById('writing-your-first-bashlet-card');
    const contextBashletCard = document.getElementById('the-bashlet-context-card');
    const examplesBashletCard = document.getElementById('bashlet-examples-card');
    const httpHandlerCard = document.getElementById('http-handlers-card');

    // Remove active class from all nav-link elements
    introBtn.querySelector('.nav-link').classList.remove('active');
    writingFirstBashletBtn.querySelector('.nav-link').classList.remove('active');
    contextBashletsBtn.querySelector('.nav-link').classList.remove('active');
    examplesBashletsBtn.querySelector('.nav-link').classList.remove('active');

    if(introCard && writingFirstBashletCard && contextBashletCard && examplesBashletCard){
        if (category === 'intro') {
            introCard.style.display = 'block';
            writingFirstBashletCard.style.display = 'none';
            contextBashletCard.style.display = 'none';
            examplesBashletCard.style.display = 'none';
            introBtn.querySelector('.nav-link').classList.add('active');
        } else if (category === 'writing-first-bashlet') {
            introCard.style.display = 'none';
            writingFirstBashletCard.style.display = 'block';
            contextBashletCard.style.display = 'none';
            examplesBashletCard.style.display = 'none';
            writingFirstBashletBtn.querySelector('.nav-link').classList.add('active');
        }   else if (category === 'context') {  
            introCard.style.display = 'none';
            writingFirstBashletCard.style.display = 'none';
            contextBashletCard.style.display = 'block';
            examplesBashletCard.style.display = 'none';
            contextBashletsBtn.querySelector('.nav-link').classList.add('active');
        } else if (category === 'examples') {
            introCard.style.display = 'none';
            writingFirstBashletCard.style.display = 'none';
            contextBashletCard.style.display = 'none';
            examplesBashletCard.style.display = 'block';
            examplesBashletsBtn.querySelector('.nav-link').classList.add('active');
        }else if (category === 'http-handlers') {
            introCard.style.display = 'none';
            writingFirstBashletCard.style.display = 'none';
            contextBashletCard.style.display = 'none';
            examplesBashletCard.style.display = 'none';
            httpHandlerCard.style.display = 'block';
            httpHandlerBtn.querySelector('.nav-link').classList.add('active');
        }
    }
   
}
