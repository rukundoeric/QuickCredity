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