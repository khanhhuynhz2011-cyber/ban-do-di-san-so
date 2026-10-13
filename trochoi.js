
const cardsData = [
    {
        name: "Ngọ Môn",
        image: "images/ngo-mon.jpg"
    },
    {
        name: "Điện Thái Hòa",
        image: "images/dien-thai-hoa.jpg"
    },
    {
        name: "Phu Văn Lâu",
        image: "images/phu-van-lau.jpg"
    },
    {
        name: "Lầu Kiết Trung",
        image: "images/lau-kiet-trung.jpg"
    }
];

const board = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("gameMessage");
const restartButton = document.getElementById("restartButton");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let seconds = 0;
let timerInterval = null;
let gameStarted = false;

function shuffle(array) {
    // Xáo trộn Fisher–Yates
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function startTimer() {
    if (gameStarted) return;

    gameStarted = true;

    timerInterval = setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function createCard(item) {
    const card = document.createElement("button");

    card.type = "button";
    card.className = "card";
    card.dataset.pairId = item.pairId;
    card.dataset.type = item.type;
    card.setAttribute("aria-label", "Thẻ đang úp");

    // Mặt sau của thẻ
    const back = document.createElement("span");
    back.className = "card-back";
    back.textContent = "❖";

    // Mặt trước của thẻ
    const front = document.createElement("span");
    front.className = "card-front";

    if (item.type === "name") {
        front.textContent = item.content;
    } else {
        const image = document.createElement("img");

        image.src = item.content;
        image.alt = item.name;
        image.draggable = false;

        // Báo nếu đường dẫn ảnh không đúng
        image.addEventListener("error", () => {
            image.alt = "Không tìm thấy ảnh: " + item.content;
        });

        front.appendChild(image);
    }

    card.append(back, front);
    card.addEventListener("click", () => flipCard(card));

    return card;
}

function createBoard() {
    stopTimer();

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    seconds = 0;
    gameStarted = false;

    timerDisplay.textContent = "00:00";
    scoreDisplay.textContent = `0 / ${cardsData.length}`;
    message.textContent = "Hãy bắt đầu hành trình khám phá!";

    const cards = [];

    cardsData.forEach((item, index) => {
        cards.push({
            pairId: String(index),
            type: "name",
            content: item.name,
            name: item.name
        });

        cards.push({
            pairId: String(index),
            type: "image",
            content: item.image,
            name: item.name
        });
    });

    shuffle(cards);
    board.replaceChildren();

    cards.forEach(item => {
        board.appendChild(createCard(item));
    });
}

function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;
    if (card.classList.contains("flipped")) return;
    if (card.classList.contains("matched")) return;

    startTimer();

    card.classList.add("flipped");
    card.setAttribute("aria-label", "Thẻ đã lật");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    checkMatch();
}

function checkMatch() {
    const isMatch =
        firstCard.dataset.pairId === secondCard.dataset.pairId &&
        firstCard.dataset.type !== secondCard.dataset.type;

    if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        firstCard.setAttribute("aria-label", "Đã ghép đúng");
        secondCard.setAttribute("aria-label", "Đã ghép đúng");

        matchedPairs++;
        scoreDisplay.textContent =
            `${matchedPairs} / ${cardsData.length}`;

        message.textContent = "Chính xác! Bạn đã tìm thấy một cặp di tích.";

        resetTurn();

        if (matchedPairs === cardsData.length) {
            stopTimer();

            message.textContent =
                `🎉 Hoàn thành! Bạn đã khám phá tất cả di tích trong ${timerDisplay.textContent}.`;
        }
    } else {
        lockBoard = true;
        message.textContent = "Chưa chính xác, hãy thử lại nhé!";

        setTimeout(() => {
            hideCard(firstCard);
            hideCard(secondCard);
            resetTurn();
        }, 1000);
    }
}

function hideCard(card) {
    if (!card) return;

    card.classList.remove("flipped");
    card.setAttribute("aria-label", "Thẻ đang úp");
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

restartButton.addEventListener("click", createBoard);

createBoard();
