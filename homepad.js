const gamepads = {};

const buttons = [
    'DIRECTION_LEFT',
    'DIRECTION_RIGHT',
    'DIRECTION_UP',
    'DIRECTION_DOWN',
    'LEFT_SHOULDER',
    'LEFT_TRIGGER',
    'RIGHT_SHOULDER',
    'RIGHT_TRIGGER',
    'FACE_1',
    'FACE_2',
    'FACE_3',
    'FACE_4',
    'START',
    'SELECT',
    'STICK_CLICK_1',
    'STICK_CLICK_2',
    'HOME'
];

const sticks = [
    'STICK_1',
    'STICK_2'
];

const gamepadMappings = [
    {   
        name: 'DUALSHOCK 4 Wireless Controller',
        buttons: {
            'FACE_1': 0,
            'FACE_2': 1,
            'FACE_3': 2,
            'FACE_4': 3,
            'LEFT_SHOULDER': 4,
            'RIGHT_SHOULDER': 5,
            'LEFT_TRIGGER': 6,
            'RIGHT_TRIGGER': 7,
            'SELECT': 8,
            'START': 9,
            'STICK_CLICK_1': 10,
            'STICK_CLICK_2': 11,
            'DIRECTION_UP': 12,
            'DIRECTION_DOWN': 13,
            'DIRECTION_LEFT': 14,
            'DIRECTION_RIGHT': 15,
            'HOME': 16,
        },
        sticks: {
            'STICK_1_X': 0,
            'STICK_1_Y': 1,
            'STICK_2_X': 2,
            'STICK_2_Y': 3,
        }
    }
];

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

const homepad = {
    getGamepads: () => {
        return gamepads;
    },

    getButtonState: (gamepadId) => {
        const gamepad = navigator.getGamepads()[gamepadId];
        const gamepadMapping = gamepads[gamepadId].gamepadMapping;
        const buttonResponse = buildButtonState(gamepad.buttons, gamepadMapping);
        const stickResponse = buildStickState(gamepad.axes, gamepadMapping);

        return {
            buttons: buttonResponse,
            sticks: stickResponse
        }
    }
};

const getGamepadMapping = (gamepadId) => {
    for (let index in gamepadMappings) {
        const gamepadMapping = gamepadMappings[index];
        if (gamepadId.indexOf(gamepadMapping.name) >= 0) {
            return gamepadMapping;
        }
    }

    return null;
};

window.addEventListener('gamepadconnected', (e) => {
    const gamepad = e.gamepad;
    gamepads[gamepad.index] = { gamepadMapping: getGamepadMapping(gamepad.id), gamepad };
});

window.addEventListener('gamepaddisconnected', (e) => {
    console.log('game pad disconnected :(');
});
