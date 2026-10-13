
const steps = [
    {
        icon: "🏯",
        title: "Chào mừng đến với huế",
        text: "Cùng khám phá những giá trị lịch sử, văn hóa và di sản của cố đô Huế."
    },
    {
        icon: "🗺️",
        title: "Khám phá bản đồ",
        text: "Nhấn vào các ghim địa điểm trên bản đồ để tìm hiểu những công trình và địa danh nổi bật."
    },
    {
        icon: "🌐",
        title: "Trải nghiệm không gian 360°",
        text: "Kéo chuột để xoay góc nhìn, quan sát không gian và khám phá các điểm tương tác trong ảnh."
    },
    {
        icon: "📜",
        title: "Tìm hiểu tư liệu lịch sử",
        text: "Nhấn vào điểm tương tác để xem hình ảnh, đọc tư liệu và khám phá những câu chuyện lịch sử."
    }
];

let currentStep = 0;

const icon = document.getElementById("guideIcon");
const title = document.getElementById("guideTitle");
const text = document.getElementById("guideText");
const number = document.getElementById("stepNumber");
const next = document.getElementById("next");
const back = document.getElementById("back");
const skip = document.getElementById("skip");
const bars = document.querySelectorAll(".progress-bar");

function showStep() {
    const step = steps[currentStep];

    icon.textContent = step.icon;
    title.textContent = step.title;
    text.textContent = step.text;

    number.textContent =
        `0${currentStep + 1} / 0${steps.length}`;

    bars.forEach((bar, index) => {
        bar.classList.toggle("active", index === currentStep);
    });

    back.style.visibility =
        currentStep === 0 ? "hidden" : "visible";

    next.textContent =
        currentStep === steps.length - 1
            ? "Bắt đầu khám phá →"
            : "Tiếp theo →";
}

function startExploring() {
    // Đổi index.html thành tên trang bản đồ của bạn
    window.location.href = "index.html";
}

next.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep();
    } else {
        startExploring();
    }
});

back.addEventListener("click", () => {
    if (currentStep > 0) {
        currentStep--;
        showStep();
    }
});

skip.addEventListener("click", startExploring);

showStep();
