const dualshock4 = require('./gamepad-mappings/ds4');
const stadia = require('./gamepad-mappings/stadia');
const xboxOne = require('./gamepad-mappings/xbox-one');
const luna = require('./gamepad-mappings/luna');
const dualshock5 = require('./gamepad-mappings/ds5');
const switchPro = require('./gamepad-mappings/switch-pro');
const nes30 = require('./gamepad-mappings/nes30');

module.exports = {
    'DUALSHOCK_4': dualshock4,
    'STADIA': stadia,
    'XBOX_ONE': xboxOne,
    'LUNA': luna,
    'DUALSHOCK_5': dualshock5,
    'SWITCH_PRO': switchPro,
    'NES_30': nes30
};
