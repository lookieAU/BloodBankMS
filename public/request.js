const mainDiv = document.querySelector(".main-div");
const showBloodInfo = document.querySelector(".bloodInfoPop");

showBloodInfo.addEventListener("click", () => {
    mainDiv.classList.add("show");
});