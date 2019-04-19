
const btnsPay=document.getElementsByClassName("btn-pay");
function hideLoanForm(){
    window.location.href = 'dashboard.html';
}
for(var i=0;i<=btnsPay.length;i++)
{
    btnsPay[i].addEventListener("click", function(){
        window.location.href = 'repayment.html';
      });
}

