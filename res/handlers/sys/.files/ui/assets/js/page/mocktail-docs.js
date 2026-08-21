

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


 //toggle the display of the getting started category content  based on the button clicked
 function toggleGettingStartedCategoryContent(category) {
    const installationCatBtn = document.getElementById('installation-cat-btn');
    const configCatBtn = document.getElementById('config-cat-btn');
    const installationCard = document.getElementById('system-settings-card');
    const configCard = document.getElementById('security-settings-card');

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