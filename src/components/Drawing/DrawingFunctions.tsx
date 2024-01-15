export function drawRect(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.fillStyle = selectedColor;
  ctx.strokeStyle = selectedColor;
  ctx.clearRect(startX, startY, x - startX, y - startY);
  ctx.fillRect(startX, startY, x - startX, y - startY);
}

export function drawLine(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.beginPath(); // begin
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = selectedColor;
  ctx.moveTo(startX, startY); // from
  ctx.lineTo(x, y); // to
  ctx.stroke(); // draw it!
}

export function drawCircle(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.fillStyle = selectedColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY + (y - startY) / 2);
  ctx.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
  ctx.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
  ctx.closePath();
  ctx.fill();
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);
}

export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  ctxTemp: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.drawImage(canvas, 0, 0);
  clearCanvas(ctxTemp, width, height);
}

export function prepareCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
