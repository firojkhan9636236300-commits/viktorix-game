// ===== VIKTORIX ROULETTE PART 1 =====

let balance = Number(localStorage.getItem("balance")) || 10000;
let bets = {};
let time = 15;
let bettingOpen = true;
let spinning = false;

let selectedNumber = null;

const balanceEl = document.getElementById("balance");
const numbersBox = document.getElementById("numbers");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("result");
const betsEl = document.getElementById("bets");

const betModal = document.getElementById("betModal");
const betNumber = document.getElementById("betNumber");
const betInput = document.getElementById("betInput");
const betOk = document.getElementById("betOk");
const betCancel = document.getElementById("betCancel");

balanceEl.innerText = balance;

function saveBalance() {
    localStorage.setItem("balance", balance);
}

function updateBalance() {
    balanceEl.innerText = balance;
    saveBalance();
}

for (let i = 0; i <= 31; i++) {

    const box = document.createElement("div");
    box.className = "number";
    box.innerText = i;

    box.onclick = function () {

        if (!bettingOpen || spinning) {
            alert("Bet Closed");
            return;
        }

        selectedNumber = i;

        betNumber.innerText = "Number " + i;
        betInput.value = "";
        betModal.style.display = "flex";
    };

    numbersBox.appendChild(box);
}

betCancel.onclick = function () {
    betModal.style.display = "none";
};

betOk.onclick = function () {

    let amount = Number(betInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Valid points enter karo");
        return;
    }

    if (amount > balance) {
        alert("Balance kam hai");
        return;
    }

    balance -= amount;
    updateBalance();

    bets[selectedNumber] = (bets[selectedNumber] || 0) + amount;

    let text = "";

    for (let n in bets) {
        text += "Number " + n + " = " + bets[n] + " Points\n";
    }

    betsEl.innerText = text;

    betModal.style.display = "none";
};
// ===== VIKTORIX ROULETTE PART 2 =====

function startTimer() {

    const interval = setInterval(() => {

        if (spinning) return;

        time--;
        timerEl.innerText = time;

        if (time <= 0) {

            clearInterval(interval);

            bettingOpen = false;
            spinning = true;

            spin();
        }

    }, 1000);

}


function spin() {

    resultEl.innerText = "🎡 Spinning...";

    setTimeout(() => {

        const winner = Math.floor(Math.random() * 32);

        resultEl.innerText = "Winner : " + winner;


        // Winner number highlight
        document.querySelectorAll(".number").forEach(box => {

            if (Number(box.innerText) === winner) {
                box.classList.add("selected");
            }

        });


        if (bets[winner]) {

            const win = bets[winner] * 30;

            balance += win;
            updateBalance();

            alert("🎉 Congratulations!\nYou Win " + win + " Points");

        } else {

            alert("😢 Better Luck Next Time");

        }


        bets = {};
        betsEl.innerText = "No Bets";


        setTimeout(() => {

            document.querySelectorAll(".number").forEach(box => {
                box.classList.remove("selected");
            });

        },2000);


        betModal.style.display = "none";

        time = 15;
        timerEl.innerText = time;

        bettingOpen = true;
        spinning = false;

        startTimer();


    }, 3000);

}


startTimer();