export function drawRect(
  selectedColor: string,
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  x: number,
  y: number,
) {
  ctx.fillStyle = selectedColor;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
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
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = selectedColor;
  ctx.beginPath(); // begin
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

export function clearCanvasToOriginal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, width, height);
  ctx.fillRect(0, 0, width, height);
}

export function drawCanvas(
  ctx: CanvasRenderingContext2D,
  ctxTemp: CanvasRenderingContext2D,
) {
  ctx.drawImage(ctxTemp.canvas, 0, 0);
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
