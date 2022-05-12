function StadelSignature(selector) {
    this.isDrawing = false;

    this.minX = null;
    this.minY = null;
    this.maxX = null;
    this.maxY = null;

    this.callbackSigned = null;
    this.didSign = false;

    this.container = document.querySelector(selector);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
    this.container.append(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.updateMinMax = (x, y, offset) => {
        if (!offset) offset = 0;
        this.minX = Math.min(this.minX ?? (x - offset), (x - offset));
        this.minY = Math.min(this.minY ?? (y - offset), (y - offset));
        this.maxX = Math.max(this.maxX ?? (x + offset), (x + offset));
        this.maxY = Math.max(this.maxY ?? (y + offset), (y + offset));
    }
    this.start = (x, y) => {
        this.ctx.strokeStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.isDrawing = true;
    }
    this.move = (fromX, fromY, toX, toY) => {
        if (!this.isDrawing) return;
        if (fromX == toX && fromY == toY) return;
        let speed = Math.sqrt(Math.abs(toX - fromX)^2 + Math.abs(toY - fromY)^2);
        this.ctx.lineWidth = 2 / (speed > 0 ? speed : 1);
        this.ctx.lineTo(toX, toY);
        this.ctx.stroke();
        this.updateMinMax(toX, toY, Math.ceil(this.ctx.lineWidth));
    }
    this.end = (event) => {
        this.isDrawing = false;
        if (!this.isEmpty() && !this.didSign) {
            this.didSign = true;
            if (this.callbackSigned) this.callbackSigned();
        }
    }

    this.canvas.addEventListener('touchstart', (event) => {
        if (event.touches.length != 1) return;
        this.prevX = event.touches[0].pageX - event.touches[0].target.getBoundingClientRect().left - document.documentElement.scrollLeft;
        this.prevY = event.touches[0].pageY - event.touches[0].target.getBoundingClientRect().top - document.documentElement.scrollTop;
        this.start(this.prevX, this.prevY);
        event.preventDefault();
    });
    this.canvas.addEventListener('touchmove', (event) => {
        if (event.touches.length != 1) return;
        let curX = event.touches[0].pageX - event.touches[0].target.getBoundingClientRect().left - document.documentElement.scrollLeft;
        let curY = event.touches[0].pageY - event.touches[0].target.getBoundingClientRect().top - document.documentElement.scrollTop;
        this.move(this.prevX, this.prevY, curX, curY);
        this.prevX = curX;
        this.prevY = curY;
        event.preventDefault();
    });
    this.canvas.addEventListener('touchend', this.end);
    this.canvas.addEventListener('touchcancel', this.end);

    this.canvas.addEventListener('mousedown', (event) => {
        this.start(event.offsetX, event.offsetY);
        event.preventDefault();
    });
    this.canvas.addEventListener('mousemove', (event) => {
        this.move(event.offsetX - event.movementX, event.offsetY - event.movementY, event.offsetX, event.offsetY);
        event.preventDefault();
    });
    this.canvas.addEventListener('mouseup', this.end);
    this.canvas.addEventListener('mouseout', this.end);
}
StadelSignature.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.minX = null;
    this.minY = null;
    this.maxX = null;
    this.maxY = null;
    this.didSign = false;
}
StadelSignature.prototype.isEmpty = function() {
    return this.minX == this.maxX && this.minY == this.maxY;
}
StadelSignature.prototype.getPNG = function() {
    return this.canvas.toDataURL('image/png');
}
StadelSignature.prototype.getCroppedPNG = function() {
    if (this.isEmpty()) return null;
    let canvas2 = document.createElement('canvas');
    canvas2.width = this.maxX - this.minX;
    canvas2.height = this.maxY - this.minY;
    let ctx2 = canvas2.getContext('2d');
    let imgData = this.ctx.getImageData(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
    ctx2.putImageData(imgData, 0, 0);
    return canvas2.toDataURL('image/png');
}
