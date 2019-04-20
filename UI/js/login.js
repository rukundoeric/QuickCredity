
function checkIfIsAdmin(myForm)
{
    var selectedIndex = myForm.elements["userRoles"].selectedIndex;
    var userRole = myForm.elements["userRoles"].options[selectedIndex].text;
  if(userRole==="Admin")
  {
    window.location.href = 'admin/dashboard.html';
  }
  else if(userRole==="Client")
  {
    window.location.href = 'dashboard.html';
 }
 else
 {
     alert("Please select user role in order to login");
 }
}