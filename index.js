const { Buttons, Sticks } = require('./inputs');
const mappings = require('./mappings');

const getGamepadMapping = (gamepadId) => {
    for (let key in mappings) {
        const gamepadMapping = mappings[key];
        if (gamepadId.indexOf(gamepadMapping.name) >= 0) {
            return gamepadMapping;
        }
    }

    return null;
};

const ting = (buttonState, gamepadMapping, key) => {
    return { 
        value: buttonState[gamepadMapping.buttons[key]] && buttonState[gamepadMapping.buttons[key]].value, 
        pressed: buttonState[gamepadMapping.buttons[key]] && buttonState[gamepadMapping.buttons[key]].pressed ? true : false
    }
};

const sting = (stickState, gamepadMapping, key) => {
    return { 
        value: stickState[gamepadMapping.sticks[key]]   
    }
};

const buildButtonState = (buttonState, gamepadMapping) => {
    // console.log('mmsmsms')
    // console.log(gamepadMapping.mappings)
    // console.log(buttonState[0]);//gamepadMapping.mappings['FACE_1']]);

    const ret = {};
    for (let key in gamepadMapping.buttons) {
        ret[key] = ting(buttonState, gamepadMapping, key)
    }

    return ret;
}

const buildStickState = (stickState, gamepadMapping) => {
    // console.log('mmsmsms')
    // console.log(gamepadMapping.mappings)
    // console.log(buttonState[0]);//gamepadMapping.mappings['FACE_1']]);

    const ret = {};
    for (let key in gamepadMapping.sticks) {
        ret[key] = sting(stickState, gamepadMapping, key)
    }

    return ret;
}



class Homepad {
    constructor() {
        if (!window) {
            throw new Error('No window available');
        }

        this.indexToMapping = {};
        
        this.initializeListeners();
    }

    initializeListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            const gamepad = e.gamepad;
            const gamepadMapping = getGamepadMapping(gamepad.id) || 'UNKNOWN';
            this.indexToMapping[gamepad.index] = gamepadMapping;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            delete this.indexToMapping[gamepad.index];
        });
    }

    getGamepadState(gamepadIndex) {
        const gamepad = navigator.getGamepads()[gamepadIndex];
        const gamepadMapping = this.indexToMapping[gamepadIndex];
        const buttonResponse = buildButtonState(gamepad.buttons, gamepadMapping);
        const stickResponse = buildStickState(gamepad.axes, gamepadMapping);

        return {
            buttons: buttonResponse,
            sticks: stickResponse
        }
    }


    getGamepads() {
        if (!navigator || !navigator.getGamepads) {
            throw new Error('No gamepad API available');
        }

        const gamepads = navigator.getGamepads();

        return gamepads.filter(gamepad => gamepad).map(gamepad => {
            return {
                index: gamepad.index,
                mapping: getGamepadMapping(gamepad.id)
            }
        }).filter(g => !!g.mapping).map(g => {
            return {
                state: this.getGamepadState(g.index),
                ...g
            }
        });
    }
};

//const hp = new Homepad();
//
//setInterval(() => {
//    console.log(hp.getGamepads());
//}, 5000);

console.log('dsfdsfdsf the fuick');
module.exports = Homepad;

