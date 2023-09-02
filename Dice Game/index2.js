var ran1=Math.floor(Math.random()*6)+1;
var img_name="images/dice"+ran1+".png";
var img1=document.querySelectorAll("img")[0];
img1.setAttribute("src",img_name);

var ran2=Math.floor(Math.random()*6)+1;
var img_name2="images/dice"+ran2+".png";
var img2=document.querySelectorAll("img")[1];
img2.setAttribute("src",img_name2);

if (ran1>ran2){
    document.querySelector("h1").innerHTML="🚩 Player 1 Wins!";
}
else if(ran2>ran1){
    document.querySelector("h1").innerHTML="🚩 Player 2 Wins!";
}
else{
    document.querySelector("h1").innerHTML="Draw!";
}