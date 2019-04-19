const infoDiv=document.getElementById("info");
const loanDiv=document.getElementById("loan-div");

function callLoanFOrm(){
    infoDiv.style.display="none";
    loanDiv.style.display="flex";
}
function hideLoanForm(){
    document.location.reload();
}