const setupCanvas = (width: number, height: number) => {
	const canvas = document.getElementById("canvas");

	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("Element with id 'canvas' is not a canvas");
	}
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	return ctx;
};

const resizeCanvas = (canvas: HTMLCanvasElement) => {
	const { width, height } = canvas.getBoundingClientRect();

	const { devicePixelRatio } = window;
	const el = document.createElement("div");
	el.innerText = devicePixelRatio.toString();

	canvas.width = width * devicePixelRatio;
	canvas.height = height * devicePixelRatio;

	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.scale(devicePixelRatio, devicePixelRatio);
	}
};

window.addEventListener("DOMContentLoaded", () => {
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

	const rotationNumberEl = document.getElementById(
		"rotation-number",
	) as HTMLInputElement;
	const rotationRangeEl = document.getElementById(
		"rotation-range",
	) as HTMLInputElement;

	rotationNumberEl.addEventListener("input", (e) => {
		const target = e?.target as HTMLInputElement;
		const value = Number(target.value) ?? 0;
		rotationRangeEl.value = value.toString();
	});

	rotationRangeEl.addEventListener("input", (e) => {
		const target = e?.target as HTMLInputElement;
		const value = Number(target.value) ?? 0;

		rotationNumberEl.value = value.toString();
	});

	const scaleNumberEl = document.getElementById(
		"scale-number",
	) as HTMLInputElement;
	const scaleRangeEl = document.getElementById(
		"scale-range",
	) as HTMLInputElement;

	scaleNumberEl?.addEventListener("input", (e) => {
		const target = e?.target as HTMLInputElement;
		const value = Number(target.value) ?? 0;
		scaleRangeEl.value = value.toString();
	});

	scaleRangeEl?.addEventListener("input", (e) => {
		const target = e?.target as HTMLInputElement;
		const value = Number(target.value) ?? 0;

		scaleNumberEl.value = value.toString();
	});

	const resetBtn = document.getElementById(
		"reset-settings",
	) as HTMLButtonElement;
	resetBtn.addEventListener("click", () => {
		resetSettings(ctx);
	});
});

const drawStripes = (ctx: CanvasRenderingContext2D, options: DrawOptions) => {
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

			ctx.closePath();
			ctx.stroke();
		}
	}
};

const drawRandomLines = (
	ctx: CanvasRenderingContext2D,
	options: DrawOptions,
) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			const randomFactor = Math.floor(Math.random() * options.size);
			ctx.beginPath();
			ctx.moveTo(
				i * options.size + Math.floor(Math.random() * options.size),
				j * options.size + Math.floor(Math.random() * options.size),
			);
			ctx.lineTo(
				i * options.size + Math.floor(Math.random() * options.size),
				j * options.size + Math.floor(Math.random() * options.size),
			);
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];

			ctx.stroke();
		}
	}
};

const drawSquares = (ctx: CanvasRenderingContext2D, options: DrawOptions) => {
	for (let i = 0; i < options.cols; i++) {
		for (let j = 0; j < options.rows; j++) {
			const randomFactor = Math.floor(Math.random() * options.size);
			ctx.beginPath();
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			if (i % (randomFactor / 2) !== 0 && j % (randomFactor / 2) !== 0) {
				ctx.rect(
					(i + 0.5) * options.size - Math.floor(Math.random() * options.size),
					(j + 0.5) * options.size - Math.floor(Math.random() * options.size),
					options.size + Math.floor(Math.random() * options.size),
					options.size + Math.floor(Math.random() * options.size),
				);
			}

			ctx.stroke();
		}
	}
};

const drawRandomCircles = (
	ctx: CanvasRenderingContext2D,
	options: DrawOptions,
) => {
	for (let i = 0; i <= options.cols; i++) {
		for (let j = 0; j <= options.rows; j++) {
			const randomFactor = Math.floor(Math.random() * options.size);
			ctx.beginPath();
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			if (i % (randomFactor / 2) !== 0 && j % (randomFactor / 2) !== 0) {
				ctx.arc(
					(i + 0.5) * options.size - randomFactor,
					(j + 0.5) * options.size - randomFactor,
					options.size - Math.floor(Math.random() * 5),
					0,
					2 * Math.PI,
				);
			}

			ctx.stroke();
		}
	}
};

const drawStaggeredCircles = (
	ctx: CanvasRenderingContext2D,
	options: DrawOptions,
) => {
	for (let r = 0; r <= options.rows; r++) {
		for (let c = 0; c <= options.cols; c++) {
			console.log(`drawing at {${c}, ${r}}`);

			ctx.beginPath();
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];

			if (r % 2 === 0) {
				ctx.arc(
					c * options.size + options.size / 2,
					r * options.size + options.size / 2,
					options.size / 4,
					0,
					2 * Math.PI,
				);
			} else {
				if (c === options.cols - 1 && r % 2 !== 0) {
					continue;
				}
				ctx.arc(
					c * options.size + options.size,
					r * options.size + options.size / 2,
					options.size,
					0,
					2 * Math.PI,
				);
			}

			ctx.stroke();
		}
	}
};

const drawCompactWave = (
	ctx: CanvasRenderingContext2D,
	options: DrawOptions,
) => {
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

const drawLooseWave = (ctx: CanvasRenderingContext2D, options: DrawOptions) => {
	let c = 0;
	let r = 0;

	for (r = 0; r < options.rows; r++) {
		for (c = 0; c < options.cols; c++) {
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
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			ctx.stroke();
		}
	}
};

const drawBrick = (ctx: CanvasRenderingContext2D, options: DrawOptions) => {
	const width = options.size + options.size / 2;
	const height = options.size;
	for (let c = 0; c < options.cols; c++) {
		for (let r = 0; r < options.rows; r++) {
			ctx.strokeStyle =
				options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
			if (r % 2 === 0) {
				ctx.strokeRect(c * width, r * height, width, height);
			} else {
				ctx.strokeRect(c * width - width / 2, r * height, width, height);
			}
		}
	}
};

type DrawOptions = {
	bgColor: string;
	fgColors: string[];
	type: string;
	size: number;
	cols: number;
	rows: number;
	rotation: number;
	scale: number;
};
const parseSettings = (ctx: CanvasRenderingContext2D): DrawOptions => {
	let bgColor = "#ffffff";
	const fgColors: string[] = [];
	let type = "lines";
	let size = 20;
	let cols = 20;
	let rows = 20;
	let rotation = 0;
	let scale = 1;

	const bgColorEl = document.getElementById("bg-color");
	if (bgColorEl instanceof HTMLInputElement) {
		bgColor = bgColorEl.value;
	}

	const fgColorEls: NodeListOf<HTMLInputElement> =
		document.querySelectorAll("#fg-color");

	// biome-ignore lint/complexity/noForEach: <I wand to use a forEach here, but the linter complains.>
	fgColorEls.forEach((el) => {
		fgColors.push(el.value);
	});
	if (fgColors.length === 0) {
		fgColors.push("#000000");
	}

	const typeEl = document.getElementById("type");
	if (typeEl instanceof HTMLSelectElement) {
		type = typeEl.value;
	}

	const sizeEl = document.getElementById("size");
	if (sizeEl instanceof HTMLInputElement) {
		size = sizeEl.valueAsNumber;
	}

	const rotationEl = document.getElementById("rotation-number");
	if (rotationEl instanceof HTMLInputElement) {
		rotation = Number(rotationEl.value);
	}

	const scaleEl = document.getElementById("scale-number");
	if (scaleEl instanceof HTMLInputElement) {
		console.log(scaleEl.value);

		scale = scaleEl.valueAsNumber;
	}

	cols = Math.ceil(ctx.canvas.width / size);
	rows = Math.ceil(ctx.canvas.height / size);

	return { bgColor, fgColors, type, size, cols, rows, rotation, scale };
};

const onDraw = (ctx: CanvasRenderingContext2D) => {
	const settings = parseSettings(ctx);

	ctx.resetTransform();

	ctx.fillStyle = settings.bgColor;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	if (settings.rotation >= 1) {
		ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.rotate((settings.rotation * Math.PI) / 180);
		ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
	}

	if (settings.scale !== 0) {
		ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.scale(settings.scale, settings.scale);
		ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
	}

	switch (settings.type) {
		case "stripes": {
			drawStripes(ctx, settings);
			break;
		}
		case "random_lines": {
			drawRandomLines(ctx, settings);
			break;
		}
		case "random_squares": {
			drawSquares(ctx, settings);
			break;
		}
		case "random_circles": {
			drawRandomCircles(ctx, settings);
			break;
		}
		case "staggered_circles": {
			drawStaggeredCircles(ctx, settings);
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
		case "brick": {
			drawBrick(ctx, settings);
			break;
		}
		default: {
			throw new Error("Unknown type");
		}
	}
};

const downloadImage = (canvas: HTMLCanvasElement) => {
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

const addFgColor = (e: MouseEvent) => {
	const target = e.target as HTMLElement;
	const settingsPanelEl = target.parentElement?.parentElement;

	const parentEl = document.createElement("div");
	parentEl.id = "new-fg-color";
	const inputEl = document.createElement("input");
	inputEl.type = "color";
	inputEl.name = "fg-color";
	inputEl.id = "fg-color";
	inputEl.value = "#000000";
	parentEl.appendChild(inputEl);

	const removeBtnEl = document.createElement("button");
	removeBtnEl.id = "btn-remove-fg-color";
	removeBtnEl.textContent = "Remove color";
	removeBtnEl.onclick = (e) => removeFgColor(e);
	parentEl.appendChild(removeBtnEl);

	if (settingsPanelEl) {
		settingsPanelEl.appendChild(parentEl);
	}
};

const removeFgColor = (e: MouseEvent) => {
	const parentEl = e.target as HTMLElement;
	parentEl.parentElement?.remove();
};

const resetSettings = (ctx: CanvasRenderingContext2D) => {
	const bgColorEl = document.getElementById("bg-color") as HTMLInputElement;
	const defaultColorEl = document.getElementById(
		"fg-color",
	) as HTMLInputElement;
	const shapeColorEls: NodeListOf<HTMLInputElement> =
		document.querySelectorAll("#new-fg-color");
	const typeEl = document.getElementById("type") as HTMLInputElement;
	const sizeEl = document.getElementById("size") as HTMLInputElement;
	const rotationEl = document.getElementById(
		"rotation-number",
	) as HTMLInputElement;
	const rotationRangeEl = document.getElementById(
		"rotation-range",
	) as HTMLInputElement;
	const scaleEl = document.getElementById("scale-number") as HTMLInputElement;
	const scaleRangeEl = document.getElementById(
		"scale-range",
	) as HTMLInputElement;

	bgColorEl.value = "#ffffff";
	defaultColorEl.value = "#000000";
	// biome-ignore lint/complexity/noForEach: <explanation>
	shapeColorEls.forEach((el) => {
		el.remove();
	});
	typeEl.value = "lines";
	sizeEl.value = "20";
	rotationEl.value = "0";
	rotationRangeEl.value = "0";
	scaleEl.value = "1";
	scaleRangeEl.value = "1";

	ctx.reset();
};
