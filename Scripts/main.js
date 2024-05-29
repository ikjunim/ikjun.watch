cloud.spawnParticles();
cloud.setPositionCenter();

const matterContainer = document.getElementById("matter-container");

setTimeout(() => {
    Events.on(matterInstance.engine, 'beforeUpdate', (event) => {
        cloud.applyForce(mousePosition);
    });
}, 50);

window.addEventListener("resize", OnResize);
OnResize();

function OnResize() {
    matterInstance.resize(matterContainer.clientWidth, matterContainer.clientHeight);

    cloud.adjustForces();
    cloud.repositionWalls();

    printer.updateWrap();
}

let instructionBodies = [];

instructionBodies.push(printer.print({
    text: "TIMER by IKJUN IM",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.1,
    relPosition: false,
    relSize: true,
    color: [red],
    category: charCategory,
    mask: charCategory,
}));


instructionBodies.push(printer.print({
    text: "ENTER to start",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.2,
    relPosition: false,
    relSize: true,
    color: [yellow],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "ENTER again to pause",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.3,
    relPosition: false,
    relSize: true,
    color: [yellow],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "ESC to reset",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.4,
    relPosition: false,
    relSize: true,
    color: [blue],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "NUMBERS to change",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.5,
    relPosition: false,
    relSize: true,
    color: [green],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "drag the letters",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.7,
    relPosition: false,
    relSize: true,
    color: [red, yellow, blue, green],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "or click the dot below",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.8,
    relPosition: false,
    relSize: true,
    color: [red, yellow, blue, green],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "to hide the text",
    size: 0.015,
    x: matterContainer.clientWidth * 0.02,
    y: matterContainer.clientHeight * 0.9,
    relPosition: false,
    relSize: true,
    color: [red, yellow, blue, green],
    category: charCategory,
    mask: charCategory,
}));

instructionBodies.push(printer.print({
    text: "o",
    size: 0.05,
    x: instructionBodies[instructionBodies.length - 1][instructionBodies[instructionBodies.length - 1].length - 1].position.x * 1.1,
    y: instructionBodies[instructionBodies.length - 1][instructionBodies[instructionBodies.length - 1].length - 1].position.y,
    relPosition: false,
    relSize: true,
    color: [white],
    category: charCategory,
    mask: charCategory,
}));

let removed = false;
Events.on(matterInstance.mouseConstraint, 'mousedown', (event) => {
    if (!removed && matterInstance.mouseConstraint.body === instructionBodies[instructionBodies.length - 1][0]) {
        instructionBodies.forEach(arr => {
            arr.forEach(body => {
                Composite.remove(matterInstance.engine.world, body);
            })
        });
        removed = true;
    }
});
