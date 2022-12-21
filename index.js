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

const mapButton = (buttonState, gamepadMapping, key) => {
    return { 
        value: buttonState[gamepadMapping.buttons[key]] && buttonState[gamepadMapping.buttons[key]].value, 
        pressed: buttonState[gamepadMapping.buttons[key]] && buttonState[gamepadMapping.buttons[key]].pressed ? true : false
    }
};

const mapStick = (stickState, gamepadMapping, key) => {
    
    const baseValue = stickState[gamepadMapping.sticks[key]];

    if (gamepadMapping.deadzones && gamepadMapping.deadzones[key]) {
        const keyDeadzone = gamepadMapping.deadzones[key];
        if (Math.abs(baseValue) < keyDeadzone) {
            return {
                value: 0
            }
        }
        if (baseValue < 0) {
            return {
                value: (baseValue + keyDeadzone) / (1 - keyDeadzone) 
            }
        } else {
            return {
                value: (baseValue - keyDeadzone) / (1 - keyDeadzone) 
            }

        }
        
    }

    return { 
        value: baseValue
    }
};

const buildButtonState = (buttonState, gamepadMapping) => {
    const ret = {};

    for (let key in gamepadMapping.buttons) {
        ret[key] = mapButton(buttonState, gamepadMapping, key)
    }

    return ret;
}

const buildStickState = (stickState, gamepadMapping) => {
    const ret = {};

    for (let key in gamepadMapping.sticks) {
        ret[key] = mapStick(stickState, gamepadMapping, key)
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
            const gamepadMapping = getGamepadMapping(gamepad.id);
            if (gamepadMapping) {
                this.indexToMapping[gamepad.index] = gamepadMapping;
            }
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

module.exports = {
    Homepad,
    Buttons,
    Sticks
};

