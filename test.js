const main = () => {
	const gamepads = homepad.getGamepads();
	const keys = Object.keys(gamepads);
	if (keys.length > 0) {
		// console.log('dasdsd ' + keys[0]);
		console.log(homepad.getButtonState(keys[0]));
	}

	window.requestAnimationFrame(main);
}

window.requestAnimationFrame(main);
