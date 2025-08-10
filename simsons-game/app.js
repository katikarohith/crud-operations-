let gameseq=[];
let userseq=[];

let started=false;
let level=0;
let btns=["one","two","three","four"];//classes

let h2=document.querySelector("h2");

let start=document.querySelector(".start");

start.addEventListener("click",function(){
    if (started==false){
        console.log("game is started");
        started=true;
        levelup();
    }

});
function gameflash(btn){
    btn.classList.add("gameflash");
setTimeout(function(){
    btn.classList.remove("gameflash");
},300);

}
function userflash(btn){
    btn.classList.add("userflash");
setTimeout(function(){
    btn.classList.remove("userflash");
},300);

}


function levelup(){
    level++;
    h2.innerText=`level ${level}`;
    userseq=[];

let randidx=Math.floor(Math.random()*4);
let randnum=btns[randidx];
let randbtn=document.querySelector(`.${randnum}`); 
console.log(randidx);
console.log(randnum);
console.log(randbtn);
gameseq.push(randnum);
console.log(gameseq);
gameflash(randbtn);


}

function checkans(idx){
    // this not wroks realiased let idx=level-1;
    if(userseq[idx]===gameseq[idx]){
        if(userseq.length==gameseq.length){
            setTimeout(levelup,1000);          //here in this we used settime out bcz in some cases if not used and if next generated num/color is same as previous btn we clicked when it becomes coreect answer  than it will work at a same  time and looks like over lapping so we use set timeout ,
        }
    }else
    {
        h2.innerHTML=`game over !! your score was <b>${level}<b> <br> press any key to start again .`;
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
              document.querySelector("body").style. backgroundColor="white";
        },150);
        reset();
    }
}


function btnpress(){
    console.log(this); //prints total button which we are using here
    let btn2=this;
    userflash(btn2);

    let usernum=btn2.getAttribute("id");// id should be same name as its  class here we using id bcz there are more classes for ecah button so we use id of same name given for class so that in array id is stored of same name and of string type and then we can campare them with gameseq array which have classes names  stored and of sring type only..
    console.log(usernum);//usernum stores id as string
    userseq.push(usernum);
    console.log(userseq);
      //this not works realised checkans();
    checkans(userseq.length-1);
}


let allbtns=document.querySelectorAll(".btn");
for(i of allbtns){
    i.addEventListener("click",btnpress);
}

rese=document.querySelector(".reset");
rese.addEventListener("click",function(){
    h2.innerHTML=`press start to start game again`;
     reset();
});

    function reset(){
        gameseq=[];
        userseq=[];
        level=0;
        started=false;
    }
