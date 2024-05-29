import Timer from "./timer.js";

const display = document.querySelector(".clock-display");
display.style.opacity = 0.5;
const timer = new Timer(display);
let changed = false;

document.addEventListener("keydown", (event) => {
    if (timer.altering) { // If the timer is being altered
        if (event.key === "Enter") {
            display.style.opacity = 1;
            timer.altering = false;
            if (changed) timer.confirmInput();
            if (changed) timer.reset();
            if (timer.running) timer.resume();
            else timer.start();
        } else if (event.key === "Backspace" || event.key === "Escape") {
            if (!changed) timer.empty();
            timer.pop();
            changed = true;
        } else if (event.key >= "0" && event.key <= "9") {
            if (!changed) timer.empty();
            timer.push(Number(event.key));
            changed = true;
        }
    } else {
        if (event.key === "Escape" || event.key === "Enter") {
            display.style.opacity = 0.5;
            if (timer.running) timer.pause();
            if (event.key === "Escape" && timer.running) timer.reset();
            timer.altering = true;
            changed = false;
        }
    }
});