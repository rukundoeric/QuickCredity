const verifyBtn=document.getElementById("btn-verify");
const verifyBtn2=document.getElementById("btn-verify2");
const verifyBtn3=document.getElementById("btn-verify3");
const verifyBtn4=document.getElementById("btn-verify4");

    verifyBtn.addEventListener('click',()=>{
       verifyBtn.style.display="none";
        document.getElementById("btn-ver").style.display="block";
        document.getElementById("Status").innerHTML="Verified";
    });

    verifyBtn2.addEventListener('click',()=>{
        verifyBtn2.style.display="none";
         document.getElementById("btn-ver-2").style.display="block";
         document.getElementById("Status2").innerHTML="Verified";
     });
     verifyBtn3.addEventListener('click',()=>{
        verifyBtn3.style.display="none";
         document.getElementById("btn-ver-3").style.display="block";
         document.getElementById("Status3").innerHTML="Verified";
     });
     verifyBtn4.addEventListener('click',()=>{
        verifyBtn4.style.display="none";
         document.getElementById("btn-ver-4").style.display="block";
         document.getElementById("Status4").innerHTML="Verified";
     });