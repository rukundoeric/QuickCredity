const userRole =document.getElementById("userRole").value;
function checkIfIsAdmin()
{
  if(userRole==="Admin")
  {
    window.location.href = 'admin/dashboard.html';
  }
  else if(userRole==="Client")
  {
    window.location.href = 'dashboard.html';
  }
}