let balance = 10000;
let bets = {};
let time = 60;
let bettingOpen = true;
let spinning = false;

const numbersBox = document.getElementById("numbers");
const balanceText = document.getElementById("balance");
const betsBox = document.getElementById("bets");
const timeText = document.getElementById("timer");
const statusText = document.getElementById("status");
const resultText = document.getElementById("result");

// Create Numbers 0-31
for (let i = 0; i <= 31; i++) {

    let btn = document.createElement("button");

    btn.className = "number";

    btn.innerHTML = `
        <span>${i}</span>
        <small id="point-${i}">0</small>
    `;

    btn.onclick = function () {
        placeBet(i);
    };

    numbersBox.appendChild(btn);
}

// Place Bet
function placeBet(number){

    if(!bettingOpen){
        alert("Bet Closed");
        return;
    }

    let amount = Number(prompt("Kitne Points Lagane Hain?"));

    if(!amount || amount < 1){
        return;
    }

    if(amount > balance){
        alert("Balance Kam Hai");
        return;
    }

    balance -= amount;

    if(!bets[number]){
        bets[number] = 0;
    }

    bets[number] += amount;

    updateGame();
}

// Update Screen
function updateGame(){

    balanceText.innerHTML = balance;

    let text = "";

    for(let num in bets){

        text += "Number " + num + " = " + bets[num] + " Points<br>";

        let pointBox = document.getElementById("point-" + num);

        if(pointBox){
            pointBox.innerHTML = bets[num];
        }

    }

    betsBox.innerHTML = text || "No Bets";
}
// Timer
let timer = setInterval(function () {

    if (bettingOpen) {

        time--;

        timeText.innerHTML = time;

        if (time <= 0) {

            bettingOpen = false;
            statusText.innerHTML = "Bet Closed";

            clearInterval(timer);

            setTimeout(function () {
                spin();
            }, 1000);

        }

    }

}, 1000);

// Spin Function
function spin() {

    if (spinning) return;

    if (bettingOpen) {
        alert("Pehle Bet Time Complete Hone Do");
        return;
    }

    spinning = true;

    statusText.innerHTML = "🎡 Spinning...";

    let winNumber = Math.floor(Math.random() * 32);

    setTimeout(function () {

        // Purana winner hatao
        document.querySelectorAll(".number").forEach(btn => {
            btn.classList.remove("winner");
        });

        // Naya winner highlight
        let winnerBtn = numbersBox.children[winNumber];

        if (winnerBtn) {
            winnerBtn.classList.add("winner");
        }

        resultText.innerHTML = "Winning Number : " + winNumber;

        checkWin(winNumber);

    }, 3000);

}
// Check Winner
function checkWin(winNumber){

    if(bets[winNumber]){

        let winAmount = bets[winNumber] * 2;

        balance += winAmount;

        alert("🎉 Number " + winNumber + " WIN! +" + winAmount + " Points");

    }else{

        alert("😔 Better Luck Next Time");

    }

    updateGame();

    // 2 second baad naya round
    setTimeout(function(){
        resetGame();
    },2000);

}

// New Round Reset
function resetGame(){

    bets = {};

    time = 60;

    bettingOpen = true;

    spinning = false;

    statusText.innerHTML = "Bet Open";

    resultText.innerHTML = "";

    timeText.innerHTML = time;

    // Winner Highlight Remove
    document.querySelectorAll(".number").forEach(btn=>{
        btn.classList.remove("winner");
    });

    // Sab points 0
    for(let i=0;i<=31;i++){

        let pointBox=document.getElementById("point-"+i);

        if(pointBox){
            pointBox.innerHTML="0";
        }

    }

    betsBox.innerHTML="No Bets";

    updateGame();

    clearInterval(timer);

    timer=setInterval(function(){

        if(bettingOpen){

            time--;

            timeText.innerHTML=time;

            if(time<=0){

                bettingOpen=false;

                statusText.innerHTML="Bet Closed";

                clearInterval(timer);

                setTimeout(function(){
                    spin();
                },1000);

            }

        }

    },1000);

}