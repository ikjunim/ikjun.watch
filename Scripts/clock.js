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
			if (event.key === "Escape") event.preventDefault();
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
            if (event.key === "Escape" && timer.running) {
				timer.reset();
				event.preventDefault();
			}
            timer.altering = true;
            changed = false;
        }
    }
});

display.addEventListener('click', (event) => {
	if (timer.altering) {
		display.style.opacity = 1;
		timer.altering = false;
		if (changed) timer.confirmInput();
		if (changed) timer.reset();
		if (timer.running) timer.resume();
		else timer.start();
	} else {
		display.style.opacity = 0.5;
		if (timer.running) timer.pause();
		timer.altering = true;
		changed = false;
	}
});

display.addEventListener("touchstart", startTouch, false);
display.addEventListener("touchend", () => {
	initialX = null;
	initialY = null;
	if (changed) timer.confirmInput();
	if (changed) timer.reset();
	changed = false;
}, false);
display.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var initialY = null;
var originalTimeArray = null;

function startTouch(e) {
	initialX = e.touches[0].clientX;
	initialY = e.touches[0].clientY;
	originalTimeArray = timer.stack.toArray();
};

function moveTouch(e) {
	if (timer.altering) {
		if (!changed) timer.pushRemaining();
		changed = true;
		var diff = initialY - e.touches[0].clientY;
		var sign = diff > 0 ? 1 : -1;
		diff = Math.abs(diff);
		if (diff < 2) diff = 0;
		timer.replace(addTime(originalTimeArray, sign * Math.ceil(Math.pow(diff, 3.3) / 20000)));
	}

    e.preventDefault();
};

function addTime(timeArray, seconds) {
	var oseconds, ominutes, ohours, newseconds, newminutes, newhours;

	oseconds = timeArray[5] + timeArray[4] * 10;
	ominutes = timeArray[3] + timeArray[2] * 10;
	ohours = timeArray[1] + timeArray[0] * 10;

	newseconds = oseconds + seconds;
	if (ohours * 3600 + ominutes * 60 + newseconds < 0) return [0, 0, 0, 0, 0, 0];
	var minutesCarry = Math.floor(newseconds / 60);
	newseconds = ((newseconds % 60) + 60) % 60;

	if (ohours >= 99) { //if the hours are at the maximum, you cant carry over to minutes
		newminutes = Math.min(59, ominutes + minutesCarry);
		newseconds = Math.min(59, newseconds);
		newhours = 99;
	} else if (ohours == 0) {
		newminutes = Math.max(0, ominutes + minutesCarry);
		var hoursCarry = Math.floor(newminutes / 60);
		newminutes = ((newminutes % 60) + 60) % 60;

		if (seconds < 0) newhours = 0;
		else newhours = Math.max(0, ohours + hoursCarry);
	} else {
		newminutes = ominutes + minutesCarry;
		var hoursCarry = Math.floor(newminutes / 60);
		newminutes = ((newminutes % 60) + 60) % 60;

		newhours = Math.min(99, ohours + hoursCarry);
	}

	return [Math.floor(newhours / 10), newhours % 10, Math.floor(newminutes / 10), newminutes % 10, Math.floor(newseconds / 10), newseconds % 10];
}