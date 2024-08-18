//@ts-check

const setupCanvas = (
	/** @type {number} */ width,
	/** @type {number} */ height,
) => {
	const canvas = document.getElementById("canvas");

	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("Element with id 'canvas' is not a canvas");
	}
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	return ctx;
};

const resizeCanvas = (canvas) => {
	const { width, height } = canvas.getBoundingClientRect();

	const { devicePixelRatio } = window;
	canvas.width = width * devicePixelRatio;
	canvas.height = height * devicePixelRatio;

	const ctx = canvas.getContext("2d");
	ctx.scale(devicePixelRatio, devicePixelRatio);
};

window.addEventListener("DOMContentLoaded", (e) => {
	const ctx = setupCanvas(1000, 1000);
	if (!ctx) throw new Error("ctx not found");

	resizeCanvas(ctx.canvas);

	const drawBtn = document.getElementById("draw");
	drawBtn?.addEventListener("click", () => {
		ctx.reset();
		onDraw(ctx);
	});

	const addFgColorBtn = document.getElementById("btn-add-fg-color");
	if (addFgColorBtn) {
		addFgColorBtn.onclick = (e) => addFgColor(e);
	}

	const downloadBtn = document.getElementById("download-image");
	if (downloadBtn) {
		downloadBtn.onclick = (e) => downloadImage(ctx.canvas);
	}
});

const drawLines = (ctx, options) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			ctx.beginPath();
			ctx.moveTo(i * options.size, j * options.size);
			ctx.lineTo(
				i * options.size + options.size,
				j * options.size + options.size,
			);
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			ctx.stroke();
		}
	}
};

const drawSquares = (ctx, options) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			ctx.beginPath();
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			ctx.rect(
				i * options.size - Math.floor(Math.random() * options.size),
				j * options.size - Math.floor(Math.random() * options.size),
				options.size + Math.floor(Math.random() * options.size),
				options.size + Math.floor(Math.random() * options.size),
			);
			ctx.stroke();
		}
	}
};

const drawCircles = (ctx, options) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			ctx.beginPath();
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			ctx.ellipse(
				(i + 0.5) * options.size,
				(j + 0.5) * options.size,
				options.size / 2,
				options.size / 2,
				0,
				0,
				2 * Math.PI,
			);
			ctx.stroke();
		}
	}
};

const drawCompactWave = (ctx, options) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			ctx.beginPath();
			if (i % 2 === 0) {
				ctx.arc(
					i * options.size + options.size / 2,
					j * options.size + options.size / 2,
					options.size / 2,
					0,
					Math.PI,
					true,
				);
			} else {
				ctx.arc(
					i * options.size + options.size / 2,
					j * options.size + options.size / 2,
					options.size / 2,
					0,
					Math.PI,
				);
			}
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			ctx.stroke();
		}
	}
};

const drawLooseWave = (ctx, options) => {
	let c = 0;
	let r = 0;

	for (c = 0; c < options.cols; c++) {
		for (r = 0; r < options.rows; r++) {
			ctx.beginPath();

			ctx.moveTo(c * options.size, r * options.size + options.size * 0.5);
			if (c % 2 === 0) {
				ctx.quadraticCurveTo(
					c * options.size + options.size * 0.5,
					r * options.size,
					c * options.size + options.size,
					r * options.size + options.size * 0.5,
				);
			} else {
				ctx.quadraticCurveTo(
					c * options.size + options.size * 0.5,
					r * options.size + options.size,
					c * options.size + options.size,
					r * options.size + options.size * 0.5,
				);
			}
			const strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			console.log(strokeStyle);

			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}
	}
};

const parseSettings = (canvas) => {
	let bgColor = "#ffffff";
	const fgColors = ["#000000"];
	let type = "lines";
	let size = 20;
	let cols = 20;
	let rows = 20;
	let rotation = 0;
	let scale = 0;

	const bgColorEl = document.getElementById("bg-color");
	if (bgColorEl instanceof HTMLInputElement) {
		bgColor = bgColorEl.value;
	}

	const fgColorEls = document.querySelectorAll("#fg-color");
	for (const el of fgColorEls) {
		if (el instanceof HTMLInputElement) {
			fgColors.push(el.value);
		}
	}

	const typeEl = document.getElementById("type");
	if (typeEl instanceof HTMLSelectElement) {
		type = typeEl.value;
	}

	const sizeEl = document.getElementById("size");
	if (sizeEl instanceof HTMLInputElement) {
		size = sizeEl.valueAsNumber;
	}

	const rotationEl = document.getElementById("rotation");
	if (rotationEl instanceof HTMLInputElement) {
		rotation = rotationEl.valueAsNumber;
	}

	const scaleEl = document.getElementById("scale");
	if (scaleEl instanceof HTMLInputElement) {
		scale = scaleEl.valueAsNumber;
	}

	cols = Math.ceil(canvas.width / size);
	rows = Math.ceil(canvas.height / size);

	return { bgColor, fgColors, type, size, cols, rows, rotation, scale };
};

const onDraw = (ctx) => {
	const settings = parseSettings(ctx.canvas);

	ctx.fillStyle = settings.bgColor;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	switch (settings.type) {
		case "lines": {
			drawLines(ctx, settings);
			break;
		}
		case "squares": {
			drawSquares(ctx, settings);
			break;
		}
		case "circles": {
			drawCircles(ctx, settings);
			break;
		}
		case "compact_wave": {
			drawCompactWave(ctx, settings);
			break;
		}
		case "loose_wave": {
			drawLooseWave(ctx, settings);
			break;
		}
		default: {
			throw new Error("Unknown image type");
		}
	}
};

const downloadImage = (canvas) => {
	const img = canvas.toDataURL("image/png");
	const dlink = document.createElement("a");
	dlink.download = "image.png";
	dlink.href = img;
	dlink.dataset.downloadurl = ["image/png", dlink.download, dlink.href].join(
		":",
	);
	document.body.appendChild(dlink);
	dlink.click();
	document.body.removeChild(dlink);
};

const addFgColor = (e) => {
	const settingsPanelEl = e.target.parentNode.parentNode;

	const newColorWrapperEl = document.createElement("div");
	const newColorInputEl = document.createElement("input");
	newColorInputEl.type = "color";
	newColorInputEl.name = "fg-color";
	newColorInputEl.id = "fg-color";
	newColorInputEl.value = "#000000";
	newColorWrapperEl.appendChild(newColorInputEl);

	const newColorRemoveBtnEl = document.createElement("button");
	newColorRemoveBtnEl.id = "btn-remove-fg-color";
	newColorRemoveBtnEl.innerText = "Remove color";
	newColorRemoveBtnEl.onclick = (e) => removeFgColor(e);
	newColorWrapperEl.appendChild(newColorRemoveBtnEl);

	settingsPanelEl.appendChild(newColorWrapperEl);
};

const removeFgColor = (e) => {
	console.log(e);
};
