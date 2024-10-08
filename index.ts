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

window.addEventListener("DOMContentLoaded", () => {
	const ctx = setupCanvas(1000, 1000);
	if (!ctx) throw new Error("ctx not found");

	const canvasSizeEl = document.getElementById(
		"canavs-size",
	) as HTMLSelectElement;

	const initialValue = canvasSizeEl.value;

	let canvasWidth = initialValue.split("x")[0];
	let canvasHeight = initialValue.split("x")[1];

	// biome-ignore lint/style/useNumberNamespace: <explanation>
	ctx.canvas.width = parseInt(canvasWidth) ?? 1000;
	// biome-ignore lint/style/useNumberNamespace: <explanation>
	ctx.canvas.height = parseInt(canvasHeight) ?? 1000;

	canvasSizeEl.addEventListener("change", (e) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value;
		[canvasWidth, canvasHeight] = value.split("x");

		// biome-ignore lint/style/useNumberNamespace: <explanation>
		ctx.canvas.width = parseInt(canvasWidth) ?? 1000;
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		ctx.canvas.height = parseInt(canvasHeight) ?? 1000;
	});

	ctx.canvas.style.width = "100%";

	const addFgColorBtn = document.getElementById("btn-add-fg-color");
	addFgColorBtn?.addEventListener("click", (e) => addFgColor(e));

	const downloadBtn = document.getElementById("download-image");
	downloadBtn?.addEventListener("click", (e) => downloadImage(ctx.canvas));

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

	const settingsFormEl = document.getElementById("settings-form");
	settingsFormEl?.addEventListener("submit", (e) => {
		e.preventDefault();
		onSubmit(e, ctx);
	});
});

const onSubmit = (e: SubmitEvent, ctx: CanvasRenderingContext2D) => {
	const target = e.target as HTMLFormElement;
	const formData = new FormData(target);
	const settings = parseSettings(formData, ctx.canvas.width, ctx.canvas.height);
	draw(ctx, settings);
};

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
	let r = 0;
	let c = 0;

	const width = options.size + options.size;
	const height = options.size;

	for (r = 0; r < options.rows; r++) {
		ctx.beginPath();
		ctx.strokeStyle =
			options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
		ctx.moveTo(0, r * options.size);
		ctx.lineTo(options.cols * options.size, r * options.size);
		ctx.stroke();

		for (c = 0; c < options.cols; c++) {
			if (r % 2 === 0) {
				ctx.beginPath();
				ctx.strokeStyle =
					options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
				ctx.moveTo(c * width, r * height);
				ctx.lineTo(c * width, r * height + height);
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.strokeStyle =
					options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
				ctx.moveTo(c * width + width / 2, r * height);
				ctx.lineTo(c * width + width / 2, r * height + height);
				ctx.stroke();
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

const parseSettings = (
	formData: FormData,
	canvasWidth: number,
	canvasHeight: number,
): DrawOptions => {
	// biome-ignore lint/style/useNumberNamespace: <explanation>
	const size = parseInt(formData.get("size")?.toString() ?? "20");
	const options = {
		bgColor: formData.get("bg-color")?.toString() ?? "#ffffff",
		fgColors: formData.getAll("fg-color") ?? ["#000000"],
		type: formData.get("type") ?? "lines",
		size: size,
		cols: Math.ceil(canvasWidth / size),
		rows: Math.ceil(canvasHeight / size),
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		rotation: parseInt(formData.get("rotation")?.toString() ?? "0"),
		// biome-ignore lint/style/useNumberNamespace: <explanation>
		scale: parseFloat(formData.get("scale")?.toString() ?? "1"),
	} as DrawOptions;

	return options;
};

const draw = (ctx: CanvasRenderingContext2D, options: DrawOptions) => {
	resetCanvas(ctx);

	const { rotation, scale, type, bgColor } = options;
	const canvasWidth = ctx.canvas.width;
	const canvasHeight = ctx.canvas.height;

	if (rotation >= 1) {
		ctx.translate(canvasWidth / 2, canvasHeight / 2);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
	}

	if (scale !== 0) {
		ctx.translate(canvasWidth / 2, canvasHeight / 2);
		ctx.scale(scale, scale);
		ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
	}

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);

	switch (type) {
		case "stripes": {
			drawStripes(ctx, options);
			break;
		}
		case "random_lines": {
			drawRandomLines(ctx, options);
			break;
		}
		case "random_squares": {
			drawSquares(ctx, options);
			break;
		}
		case "random_circles": {
			drawRandomCircles(ctx, options);
			break;
		}
		case "staggered_circles": {
			drawStaggeredCircles(ctx, options);
			break;
		}
		case "compact_wave": {
			drawCompactWave(ctx, options);
			break;
		}
		case "loose_wave": {
			drawLooseWave(ctx, options);
			break;
		}
		case "brick": {
			drawBrick(ctx, options);
			break;
		}
		default: {
			throw new Error("Unknown type");
		}
	}
};

const resetCanvas = (ctx: CanvasRenderingContext2D) => {
	ctx.reset();
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const downloadImage = (canvas: HTMLCanvasElement) => {
	console.log(canvas);

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
	parentEl.classList.add("fg-color-container");
	const inputEl = document.createElement("input");
	inputEl.type = "color";
	inputEl.name = "fg-color";
	inputEl.id = "fg-color";
	inputEl.value = "#000000";
	parentEl.appendChild(inputEl);

	const removeBtnEl = document.createElement("button");
	removeBtnEl.id = "btn-remove-fg-color";
	removeBtnEl.textContent = "Remove color";
	removeBtnEl.type = "button";
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
