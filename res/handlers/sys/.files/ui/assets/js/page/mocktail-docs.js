

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