function approve()
{
  document.getElementById("status").innerHTML="Approved";
  document.getElementById("img-reject").style.display="none";
}
function regect()
{
    document.getElementById("status").innerHTML="Rejected";
    document.getElementById("img-approve").style.display="none";
}
function approve2()
{
  document.getElementById("status2").innerHTML="Approved";
  document.getElementById("img-reject2").style.display="none";
}
function regect2()
{
    document.getElementById("status2").innerHTML="Rejected";
    document.getElementById("img-approve2").style.display="none";
}

//For loan repayment
const firstForm=document.getElementById("signup-div-1");
const secondForm=document.getElementById("next-div");
document.getElementById("btnRes").disabled = true;
function callNext()
{
   firstForm.style.display="none";
   secondForm.style.display="block";
}
function callPrevious()
{
  firstForm.style.display="block";
  secondForm.style.display="none"; 
}
function postTransaction()
{
  window.location.href = 'dashboard.html';
}