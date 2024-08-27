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
window.addEventListener("DOMContentLoaded", function () {
    var _a, _b;
    var ctx = setupCanvas(1000, 1000);
    if (!ctx)
        throw new Error("ctx not found");
    var canvasSizeEl = document.getElementById("canavs-size");
    var initialValue = canvasSizeEl.value;
    var canvasWidth = initialValue.split("x")[0];
    var canvasHeight = initialValue.split("x")[1];
    canvasSizeEl.addEventListener("change", function (e) {
        var _a;
        var target = e.target;
        var value = target.value;
        _a = value.split("x"), canvasWidth = _a[0], canvasHeight = _a[1];
    });
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    ctx.canvas.width = (_a = parseInt(canvasWidth)) !== null && _a !== void 0 ? _a : 1000;
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    ctx.canvas.height = (_b = parseInt(canvasHeight)) !== null && _b !== void 0 ? _b : 1000;
    ctx.canvas.style.width = "100%";
    var addFgColorBtn = document.getElementById("btn-add-fg-color");
    addFgColorBtn === null || addFgColorBtn === void 0 ? void 0 : addFgColorBtn.addEventListener("click", function (e) { return addFgColor(e); });
    var downloadBtn = document.getElementById("download-image");
    downloadBtn === null || downloadBtn === void 0 ? void 0 : downloadBtn.addEventListener("click", function (e) { return downloadImage(ctx.canvas); });
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
    var settingsFormEl = document.getElementById("settings-form");
    settingsFormEl === null || settingsFormEl === void 0 ? void 0 : settingsFormEl.addEventListener("submit", function (e) {
        e.preventDefault();
        onSubmit(e, ctx);
    });
});
var onSubmit = function (e, ctx) {
    var target = e.target;
    var formData = new FormData(target);
    var settings = parseSettings(formData, ctx.canvas.width, ctx.canvas.height);
    draw(ctx, settings);
};
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
    var r = 0;
    var c = 0;
    var width = options.size + options.size;
    var height = options.size;
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
            }
            else {
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
var parseSettings = function (formData, canvasWidth, canvasHeight) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // biome-ignore lint/style/useNumberNamespace: <explanation>
    var size = parseInt((_b = (_a = formData.get("size")) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "20");
    var options = {
        bgColor: (_d = (_c = formData.get("bg-color")) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "#ffffff",
        fgColors: (_e = formData.getAll("fg-color")) !== null && _e !== void 0 ? _e : ["#000000"],
        type: (_f = formData.get("type")) !== null && _f !== void 0 ? _f : "lines",
        size: size,
        cols: Math.ceil(canvasWidth / size),
        rows: Math.ceil(canvasHeight / size),
        // biome-ignore lint/style/useNumberNamespace: <explanation>
        rotation: parseInt((_h = (_g = formData.get("rotation")) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : "0"),
        // biome-ignore lint/style/useNumberNamespace: <explanation>
        scale: parseFloat((_k = (_j = formData.get("scale")) === null || _j === void 0 ? void 0 : _j.toString()) !== null && _k !== void 0 ? _k : "1"),
    };
    return options;
};
var draw = function (ctx, options) {
    resetCanvas(ctx);
    var rotation = options.rotation, scale = options.scale, type = options.type;
    var canvasWidth = ctx.canvas.width;
    var canvasHeight = ctx.canvas.height;
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
var resetCanvas = function (ctx) {
    ctx.reset();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    removeBtnEl.type = "button";
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
