var setupCanvas = function (width, height) {
    var canvas = document.getElementById("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Element with id 'canvas' is not a canvas");
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    return ctx;
};
var resizeCanvas = function (canvas) {
    var _a = canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
    var devicePixelRatio = window.devicePixelRatio;
    var el = document.createElement("div");
    el.innerText = devicePixelRatio.toString();
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    var ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }
};
window.addEventListener("DOMContentLoaded", function () {
    var ctx = setupCanvas(1000, 1000);
    if (!ctx)
        throw new Error("ctx not found");
    resizeCanvas(ctx.canvas);
    var drawBtn = document.getElementById("draw");
    drawBtn === null || drawBtn === void 0 ? void 0 : drawBtn.addEventListener("click", function () {
        ctx.reset();
        onDraw(ctx);
    });
    var addFgColorBtn = document.getElementById("btn-add-fg-color");
    if (addFgColorBtn) {
        addFgColorBtn.onclick = function (e) { return addFgColor(e); };
    }
    var downloadBtn = document.getElementById("download-image");
    if (downloadBtn) {
        downloadBtn.onclick = function (e) { return downloadImage(ctx.canvas); };
    }
    var rotationNumberEl = document.getElementById("rotation-number");
    var rotationRangeEl = document.getElementById("rotation-range");
    rotationNumberEl.addEventListener("input", function (e) {
        var _a;
        var target = e === null || e === void 0 ? void 0 : e.target;
        var value = (_a = Number(target.value)) !== null && _a !== void 0 ? _a : 0;
        rotationRangeEl.value = value.toString();
    });
    rotationRangeEl.addEventListener("input", function (e) {
        var _a;
        var target = e === null || e === void 0 ? void 0 : e.target;
        var value = (_a = Number(target.value)) !== null && _a !== void 0 ? _a : 0;
        rotationNumberEl.value = value.toString();
    });
    var scaleNumberEl = document.getElementById("scale-number");
    var scaleRangeEl = document.getElementById("scale-range");
    scaleNumberEl === null || scaleNumberEl === void 0 ? void 0 : scaleNumberEl.addEventListener("input", function (e) {
        var _a;
        var target = e === null || e === void 0 ? void 0 : e.target;
        var value = (_a = Number(target.value)) !== null && _a !== void 0 ? _a : 0;
        scaleRangeEl.value = value.toString();
    });
    scaleRangeEl === null || scaleRangeEl === void 0 ? void 0 : scaleRangeEl.addEventListener("input", function (e) {
        var _a;
        var target = e === null || e === void 0 ? void 0 : e.target;
        var value = (_a = Number(target.value)) !== null && _a !== void 0 ? _a : 0;
        scaleNumberEl.value = value.toString();
    });
    var resetBtn = document.getElementById("reset-settings");
    resetBtn.addEventListener("click", function () {
        resetSettings(ctx);
    });
});
var drawStripes = function (ctx, options) {
    for (var i = 0; i < options.cols; i++) {
        for (var j = 0; j < options.rows; j++) {
            ctx.beginPath();
            ctx.moveTo(i * options.size, j * options.size);
            ctx.lineTo(i * options.size + options.size, j * options.size + options.size);
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            ctx.closePath();
            ctx.stroke();
        }
    }
};
var drawRandomLines = function (ctx, options) {
    for (var i = 0; i < options.cols; i++) {
        for (var j = 0; j < options.rows; j++) {
            var randomFactor = Math.floor(Math.random() * options.size);
            ctx.beginPath();
            ctx.moveTo(i * options.size + Math.floor(Math.random() * options.size), j * options.size + Math.floor(Math.random() * options.size));
            ctx.lineTo(i * options.size + Math.floor(Math.random() * options.size), j * options.size + Math.floor(Math.random() * options.size));
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            ctx.stroke();
        }
    }
};
var drawSquares = function (ctx, options) {
    for (var i = 0; i < options.cols; i++) {
        for (var j = 0; j < options.rows; j++) {
            var randomFactor = Math.floor(Math.random() * options.size);
            ctx.beginPath();
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            if (i % (randomFactor / 2) !== 0 && j % (randomFactor / 2) !== 0) {
                ctx.rect((i + 0.5) * options.size - Math.floor(Math.random() * options.size), (j + 0.5) * options.size - Math.floor(Math.random() * options.size), options.size + Math.floor(Math.random() * options.size), options.size + Math.floor(Math.random() * options.size));
            }
            ctx.stroke();
        }
    }
};
var drawRandomCircles = function (ctx, options) {
    for (var i = 0; i <= options.cols; i++) {
        for (var j = 0; j <= options.rows; j++) {
            var randomFactor = Math.floor(Math.random() * options.size);
            ctx.beginPath();
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            if (i % (randomFactor / 2) !== 0 && j % (randomFactor / 2) !== 0) {
                ctx.arc((i + 0.5) * options.size - randomFactor, (j + 0.5) * options.size - randomFactor, options.size - Math.floor(Math.random() * 5), 0, 2 * Math.PI);
            }
            ctx.stroke();
        }
    }
};
var drawStaggeredCircles = function (ctx, options) {
    for (var r = 0; r <= options.rows; r++) {
        for (var c = 0; c <= options.cols; c++) {
            console.log("drawing at {".concat(c, ", ").concat(r, "}"));
            ctx.beginPath();
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            if (r % 2 === 0) {
                ctx.arc(c * options.size + options.size / 2, r * options.size + options.size / 2, options.size / 4, 0, 2 * Math.PI);
            }
            else {
                if (c === options.cols - 1 && r % 2 !== 0) {
                    continue;
                }
                ctx.arc(c * options.size + options.size, r * options.size + options.size / 2, options.size, 0, 2 * Math.PI);
            }
            ctx.stroke();
        }
    }
};
var drawCompactWave = function (ctx, options) {
    for (var i = 0; i < options.cols; i++) {
        for (var j = 0; j < options.rows; j++) {
            ctx.beginPath();
            if (i % 2 === 0) {
                ctx.arc(i * options.size + options.size / 2, j * options.size + options.size / 2, options.size / 2, 0, Math.PI, true);
            }
            else {
                ctx.arc(i * options.size + options.size / 2, j * options.size + options.size / 2, options.size / 2, 0, Math.PI);
            }
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            ctx.stroke();
        }
    }
};
var drawLooseWave = function (ctx, options) {
    var c = 0;
    var r = 0;
    for (r = 0; r < options.rows; r++) {
        for (c = 0; c < options.cols; c++) {
            ctx.beginPath();
            ctx.moveTo(c * options.size, r * options.size + options.size * 0.5);
            if (c % 2 === 0) {
                ctx.quadraticCurveTo(c * options.size + options.size * 0.5, r * options.size, c * options.size + options.size, r * options.size + options.size * 0.5);
            }
            else {
                ctx.quadraticCurveTo(c * options.size + options.size * 0.5, r * options.size + options.size, c * options.size + options.size, r * options.size + options.size * 0.5);
            }
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            ctx.stroke();
        }
    }
};
var drawBrick = function (ctx, options) {
    var width = options.size + options.size / 2;
    var height = options.size;
    for (var c = 0; c < options.cols; c++) {
        for (var r = 0; r < options.rows; r++) {
            ctx.strokeStyle =
                options.fgColors[Math.floor(Math.random() * options.fgColors.length)];
            if (r % 2 === 0) {
                ctx.strokeRect(c * width, r * height, width, height);
            }
            else {
                ctx.strokeRect(c * width - width / 2, r * height, width, height);
            }
        }
    }
};
var parseSettings = function (ctx) {
    var bgColor = "#ffffff";
    var fgColors = [];
    var type = "lines";
    var size = 20;
    var cols = 20;
    var rows = 20;
    var rotation = 0;
    var scale = 1;
    var bgColorEl = document.getElementById("bg-color");
    if (bgColorEl instanceof HTMLInputElement) {
        bgColor = bgColorEl.value;
    }
    var fgColorEls = document.querySelectorAll("#fg-color");
    // biome-ignore lint/complexity/noForEach: <I wand to use a forEach here, but the linter complains.>
    fgColorEls.forEach(function (el) {
        fgColors.push(el.value);
    });
    if (fgColors.length === 0) {
        fgColors.push("#000000");
    }
    var typeEl = document.getElementById("type");
    if (typeEl instanceof HTMLSelectElement) {
        type = typeEl.value;
    }
    var sizeEl = document.getElementById("size");
    if (sizeEl instanceof HTMLInputElement) {
        size = sizeEl.valueAsNumber;
    }
    var rotationEl = document.getElementById("rotation-number");
    if (rotationEl instanceof HTMLInputElement) {
        rotation = Number(rotationEl.value);
    }
    var scaleEl = document.getElementById("scale-number");
    if (scaleEl instanceof HTMLInputElement) {
        console.log(scaleEl.value);
        scale = scaleEl.valueAsNumber;
    }
    cols = Math.ceil(ctx.canvas.width / size);
    rows = Math.ceil(ctx.canvas.height / size);
    return { bgColor: bgColor, fgColors: fgColors, type: type, size: size, cols: cols, rows: rows, rotation: rotation, scale: scale };
};
var onDraw = function (ctx) {
    var settings = parseSettings(ctx);
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
var downloadImage = function (canvas) {
    var img = canvas.toDataURL("image/png");
    var dlink = document.createElement("a");
    dlink.download = "image.png";
    dlink.href = img;
    dlink.dataset.downloadurl = ["image/png", dlink.download, dlink.href].join(":");
    document.body.appendChild(dlink);
    dlink.click();
    document.body.removeChild(dlink);
};
var addFgColor = function (e) {
    var _a;
    var target = e.target;
    var settingsPanelEl = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    var parentEl = document.createElement("div");
    parentEl.id = "new-fg-color";
    var inputEl = document.createElement("input");
    inputEl.type = "color";
    inputEl.name = "fg-color";
    inputEl.id = "fg-color";
    inputEl.value = "#000000";
    parentEl.appendChild(inputEl);
    var removeBtnEl = document.createElement("button");
    removeBtnEl.id = "btn-remove-fg-color";
    removeBtnEl.textContent = "Remove color";
    removeBtnEl.onclick = function (e) { return removeFgColor(e); };
    parentEl.appendChild(removeBtnEl);
    if (settingsPanelEl) {
        settingsPanelEl.appendChild(parentEl);
    }
};
var removeFgColor = function (e) {
    var _a;
    var parentEl = e.target;
    (_a = parentEl.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
};
var resetSettings = function (ctx) {
    var bgColorEl = document.getElementById("bg-color");
    var defaultColorEl = document.getElementById("fg-color");
    var shapeColorEls = document.querySelectorAll("#new-fg-color");
    var typeEl = document.getElementById("type");
    var sizeEl = document.getElementById("size");
    var rotationEl = document.getElementById("rotation-number");
    var rotationRangeEl = document.getElementById("rotation-range");
    var scaleEl = document.getElementById("scale-number");
    var scaleRangeEl = document.getElementById("scale-range");
    bgColorEl.value = "#ffffff";
    defaultColorEl.value = "#000000";
    // biome-ignore lint/complexity/noForEach: <explanation>
    shapeColorEls.forEach(function (el) {
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
