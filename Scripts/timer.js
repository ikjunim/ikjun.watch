import Deque from "./deque.js";

const numberWords = {
	"0": "zero",
	"1": "one",
	"2": "two",
	"3": "three",
	"4": "four",
	"5": "five",
	"6": "six",
	"7": "seven",
	"8": "eight",
	"9": "nine",
};

const numberForce = 2;
const maxDigits = Common.clamp(0.15 * Math.sqrt(matterInstance.diagonal()), 50, 100);

function validateTimeArray(timeArray) {
    if (timeArray[2] * 10 + timeArray[3] > 59) {
        timeArray[2] = 5;
        timeArray[3] = 9;
    }
  
    if (timeArray[4] * 10 + timeArray[5] > 59) {
        timeArray[4] = 5;
        timeArray[5] = 9;
    }

    return timeArray;
}

function millisecondsToTimeArray(milliseconds) {
    var hours = Math.floor(milliseconds / 3600000);
    var minutes = Math.floor((milliseconds % 3600000) / 60000);
    var seconds = Math.floor((milliseconds % 60000) / 1000);

    return [Math.floor(hours / 10), hours % 10, Math.floor(minutes / 10), minutes % 10, Math.floor(seconds / 10), seconds % 10];
}

function timeArrayToMilliseconds(timeArray) {
    return (
        (timeArray[0] * 10 + timeArray[1]) * 3600000 +
        (timeArray[2] * 10 + timeArray[3]) * 60000 +
        (timeArray[4] * 10 + timeArray[5]) * 1000
    );
}

function timeArrayToString(timeArray) {
    if (timeArray[0] == 0 && timeArray[1] == 0) {
        if (timeArray[2] == 0 && timeArray[3] == 0) {
            if (timeArray[4] == 0 && timeArray[5] == 0) {
                return "0";
            }
            
            if (timeArray[4] == 0) {
                return String(timeArray[5]);
            }

            return (
                timeArray[4] + "" + timeArray[5]
            );
        }

        if (timeArray[2] == 0) {
            return (
                timeArray[3] + " " + timeArray[4] + "" + timeArray[5]
            );
        }

        return (
            timeArray[2] + "" + timeArray[3] + " " +
            timeArray[4] + "" + timeArray[5]
        );
    } else {
        if (timeArray[0] == 0) {
            return (
                timeArray[1] + " " +
                timeArray[2] + "" + timeArray[3] + " " +
                timeArray[4] + "" + timeArray[5]
            );
        }
        else {
            return (
                timeArray[0] + "" + timeArray[1] + " " +
                timeArray[2] + "" + timeArray[3] + " " +
                timeArray[4] + "" + timeArray[5]
            );
        }
    }
}

function millisecondsToString(milliseconds) {
    return timeArrayToString(millisecondsToTimeArray(milliseconds));
}

export default class Timer {
    constructor(display) {
        this.display = display;

        this.paused = false;
        this.running = false;
        this.altering = true;

        this.startTime = 0;
        this.totalTime = 900000;
        this.endTime = 0;
        this.pauseTime = 0;
        this.remainingTime = 900000;
        this.waitForReset = false;
        this.id = null;

        this._length = 4;
        this.stack = Deque.fromArray([0, 0, 1, 5, 0, 0]);
        this.spawned = Deque.fromArray([]);

        this.displayTime(900000);
    }

    displayTime(milliseconds) {
        var string = millisecondsToString(milliseconds);
        if (this.running && !this.paused && this.display.innerHTML.localeCompare(string) != 0 && !document.hidden) {
            cloud.dance();
			var randomVector = randomUnitVector(1);
            printer.print({
                text: Math.random() < 0.5 ? this.display.innerHTML.slice(string.length - 1) : numberWords[this.display.innerHTML.slice(string.length - 1)],
                size: 0.02,
                x: matterContainer.clientWidth * 0.5,
                y: matterContainer.clientHeight * 0.5,
                relPosition: false,
                relSize: true,
                color: [blue, red, yellow, green],
                category: charCategory,
                mask: charCategory,
            }).forEach(body => {
				Body.setVelocity(body, Vector.mult(randomVector, body.mass * (10000/Math.sqrt(matterInstance.diagonal())) * (randomFloat(numberForce/2, numberForce))))
                this.spawned.pushBack(body);
            });
            while (this.spawned.size() > maxDigits) {
                Composite.remove(matterInstance.engine.world, this.spawned.popFront());
            }
        }
        this.display.innerHTML = millisecondsToString(milliseconds);
    }

    previewInput() {
        this.display.innerHTML = timeArrayToString(validateTimeArray(this.stack.toArray()));
    }

    confirmInput() { 
        this.set(timeArrayToMilliseconds(validateTimeArray(this.stack.toArray())));
    }

    empty() {
        while (this._length > 0) {
            this.stack.popBack();
            this.stack.pushFront(0);
            this._length--;
        }

        this.previewInput();
    }

    pushRemaining() {
        this.empty();
        var hours = Math.floor(this.remainingTime / 3600000);
        var minutes = Math.floor((this.remainingTime % 3600000) / 60000);
        var seconds = Math.floor((this.remainingTime % 60000) / 1000);
        this.push(Math.floor(hours / 10));
        this.push(hours % 10);
        this.push(Math.floor(minutes / 10));
        this.push(minutes % 10);
        this.push(Math.floor(seconds / 10));
        this.push(seconds % 10);

		this.previewInput();
    }

	replace(timeArray) {
		this.empty();
		this.push(timeArray[0]);
		this.push(timeArray[1]);
		this.push(timeArray[2]);
		this.push(timeArray[3]);
		this.push(timeArray[4]);
		this.push(timeArray[5]);
		this.previewInput();
	}

    push(number) {
        if (this._length >= 6) return;
        if (this._length == 0 && number == 0) return; //leading zeroes

        this.stack.pushBack(number);
        this.stack.popFront();
        this._length++;

        this.previewInput();
    }

    pop() {
        if (this._length <= 0) return;

        this.stack.popBack();
        this.stack.pushFront(0);
        this._length--;

        this.previewInput();
    }

    set(milliseconds) {
        this.totalTime = milliseconds;
        this.displayTime(milliseconds);
    }

    start() {
        if (this.totalTime == 0) return;
        this.running = true;
        this.endTime = Date.now() + this.totalTime;
        this.remainingTime = this.endTime - Date.now();
        this.id = setInterval(() => this.update(), 100);
    }

    pause() {
        if (this.paused) return;
        this.paused = true;
        this.pauseTime = Date.now();
        clearInterval(this.id);
    }

    resume() {
        this.paused = false;
        this.endTime += Date.now() - this.pauseTime;
        this.id = setInterval(() => this.update(), 100);
    }

    reset() {
        this.running = false;
        this.paused = false;
        clearInterval(this.id);
        this.confirmInput();
        document.title = millisecondsToString(this.totalTime);
    }

    update() {
        this.remainingTime = this.endTime - Date.now();
        if (this.remainingTime <= 0) this.reset();
         else {
            document.title = millisecondsToString(this.remainingTime);
            this.displayTime(this.remainingTime);
        }
    }
}

