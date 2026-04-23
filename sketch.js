// 电流急急棒游戏 - 简化测试版本
let gameState = "start"; // "start", "ready", "playing"
let readyCountdown = 0;
let lastCountdownTime = 0;
let hasStartedMoving = false; // 紀錄玩家是否已經觸碰起點開始遊戲

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 220, 230);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 粉色背景
  background(255, 220, 230);

  // 显示标题
  fill(100);
  textSize(28);
  textAlign(CENTER);
  text("⚡ 电流急急棒游戏 ⚡", width / 2, 50);

  // 显示游戏状态
  fill(0);
  textSize(16);
  text("游戏状态: " + gameState, width / 2, 100);
  text("鼠标位置: " + mouseX + ", " + mouseY, width / 2, 130);

  // 处理准备状态的倒计时
  if (gameState === "ready") {
    if (millis() - lastCountdownTime > 1000) { // 每秒更新一次
      readyCountdown--;
      lastCountdownTime = millis();
      if (readyCountdown <= 0) {
        gameState = "playing";
      }
    }
  }

  // 根据游戏状态显示不同内容
  if (gameState === "start") {
    displayStartScreen();
  } else if (gameState === "ready") {
    displayReadyScreen();
  } else if (gameState === "playing") {
    displayGameScreen();
  } else if (gameState === "fail") {
    displayFailScreen();
  } else if (gameState === "success") {
    displaySuccessScreen();
  }
}

// 显示开始屏幕
function displayStartScreen() {
  // 绘制简单的开始按钮
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(2);
  rect(width / 2 - 50, height / 2 - 25, 100, 50, 10);

  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("开始", width / 2, height / 2);
}

// 显示准备屏幕
function displayReadyScreen() {
  // 显示倒计时
  fill(255, 255, 0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(readyCountdown, width / 2, height / 2);

  fill(255);
  textSize(20);
  text("准备开始...", width / 2, height / 2 + 80);
}

// 显示游戏屏幕
function displayGameScreen() {
  // 整体游戏区域的水平范围
  const routeStartX = 100;
  const routeEndX = width - 100;
  // 路径的中心线参考Y坐标
  const routeCenterY = height * 0.5;

  // 路径的整体垂直活动范围，提供更大的弯曲空间
  const gameAreaTopY = height * 0.40;
  const gameAreaBottomY = height * 0.60;

  // 路径的宽度，更窄更有挑战性
  const pathWidth = 30;
  const halfPathWidth = pathWidth / 2;

  // 定义蜿蜒路径的中心点
  // 这些点定义了路径的形状，可以根据需要调整Y坐标来改变弯曲程度
  const pathPoints = [
    { x: routeStartX, y: routeCenterY },
    { x: routeStartX + (routeEndX - routeStartX) * 0.1, y: routeCenterY - 40 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.2, y: routeCenterY + 30 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.3, y: routeCenterY - 60 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.4, y: routeCenterY + 50 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.5, y: routeCenterY - 30 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.6, y: routeCenterY + 70 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.7, y: routeCenterY - 50 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.8, y: routeCenterY + 20 },
    { x: routeStartX + (routeEndX - routeStartX) * 0.9, y: routeCenterY - 40 },
    { x: routeEndX, y: routeCenterY }
  ];

  // 限制路径点的Y坐标在游戏区域内，防止出界
  for (let i = 0; i < pathPoints.length; i++) {
    pathPoints[i].y = constrain(pathPoints[i].y, gameAreaTopY + halfPathWidth, gameAreaBottomY - halfPathWidth);
  }

  // 绘制路径的蓝色墙壁
  stroke(0, 0, 255);
  strokeWeight(6); // 墙壁稍微加粗，使其更明显
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    line(p1.x, p1.y - halfPathWidth, p2.x, p2.y - halfPathWidth); // 上墙
    line(p1.x, p1.y + halfPathWidth, p2.x, p2.y + halfPathWidth); // 下墙
  }

  // 绘制绿色的中心路径线
  stroke(0, 255, 0);
  strokeWeight(2);
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];
    line(p1.x, p1.y, p2.x, p2.y);
  }

  // 起点和终点
  fill(100, 200, 100);
  noStroke();
  circle(pathPoints[0].x, pathPoints[0].y, 20); // 起点在第一个路径点
  fill(100, 100, 200);
  circle(pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y, 20); // 终点在最后一个路径点

  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("开", pathPoints[0].x, pathPoints[0].y);
  text("终", pathPoints[pathPoints.length - 1].x, pathPoints[pathPoints.length - 1].y);

  // 鼠标位置
  fill(255, 0, 0);
  noStroke();
  circle(mouseX, mouseY, 10);

  // 如果還沒開始移動，在畫面上顯示提示文字
  if (!hasStartedMoving) {
    fill(100, 100, 255);
    textSize(20);
    text("← 請先將滑鼠移到『開』啟動遊戲", width / 2, height * 0.7);
  }

  // 检查碰撞，传入路径点和路径宽度
  checkCollision(pathPoints, pathWidth);
}

// 辅助函数：计算点到线段的最短距离
function distToSegment(p, a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let l2 = dx * dx + dy * dy;
  if (l2 == 0) return dist(p.x, p.y, a.x, a.y); // a == b (线段是一个点)

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
  t = constrain(t, 0, 1); // 限制t在[0, 1]范围内，确保点在当前线段上

  let projectionX = a.x + t * dx;
  let projectionY = a.y + t * dy;

  return dist(p.x, p.y, projectionX, projectionY);
}

// 检查碰撞
function checkCollision(pathPoints, pathWidth) {
  const halfPathWidth = pathWidth / 2;

  const firstPoint = pathPoints[0];
  const lastPoint = pathPoints[pathPoints.length - 1];

  // 【修正】如果還沒碰到起點，不進行失敗檢查
  if (!hasStartedMoving) {
    if (dist(mouseX, mouseY, firstPoint.x, firstPoint.y) < 20) {
      hasStartedMoving = true;
    }
    return; // 尚未啟動，不執行後續的失敗判斷
  }

  // 检查是否到达终点（成功）：鼠标是否在终点附近
  if (dist(mouseX, mouseY, lastPoint.x, lastPoint.y) < halfPathWidth + 10) { // 终点附近给予10像素的容错范围
    gameState = "success";
    return;
  }

  // 检查鼠标是否超出路径的整体水平范围（防止玩家绕过路径）
  // 给予起点和终点一点缓冲，避免刚开始或即将结束时立即失败
  if (mouseX < firstPoint.x - 5 || mouseX > lastPoint.x + 5) {
    gameState = "fail";
    return;
  }

  // 检查鼠标是否在路径内部
  let mouseIsOnPath = false;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const p1 = pathPoints[i];
    const p2 = pathPoints[i + 1];

    // 计算鼠标到当前路径线段的最短距离
    const d = distToSegment({ x: mouseX, y: mouseY }, p1, p2);

    if (d < halfPathWidth) {
      mouseIsOnPath = true; // 鼠标在当前线段的安全区域内
      break; // 找到安全区域，无需继续检查其他线段
    }
  }

  // 如果鼠标不在任何路径线段的安全区域内，则判定为失败
  if (!mouseIsOnPath) {
    gameState = "fail";
  }
}

// 显示失败屏幕
function displayFailScreen() {
  // 半透明黑色背景
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);

  // 失败框
  fill(255);
  stroke(255, 0, 0);
  strokeWeight(4);
  rect(width / 2 - 200, height / 2 - 100, 400, 200, 15);

  // 失败文字
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("失败！", width / 2, height / 2 - 40);

  // 失败符号
  fill(255, 100, 100);
  textSize(30);
  text("❌ 碰到蓝线了 ❌", width / 2, height / 2);

  // 重新开始提示
  fill(100);
  textSize(18);
  text("点击屏幕重新开始", width / 2, height / 2 + 60);
}

// 显示成功屏幕
function displaySuccessScreen() {
  // 半透明黑色背景
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width, height);

  // 成功框
  fill(255);
  stroke(0, 200, 0);
  strokeWeight(4);
  rect(width / 2 - 200, height / 2 - 100, 400, 200, 15);

  // 成功文字
  fill(0, 200, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("成功！", width / 2, height / 2 - 40);

  // 庆祝符号
  fill(255, 215, 0);
  textSize(30);
  text("🎉 🎊 🎉", width / 2, height / 2);

  // 重新开始提示
  fill(100);
  textSize(18);
  text("点击屏幕重新开始", width / 2, height / 2 + 60);
}

function mousePressed() {
  // 检查是否点击了开始按钮
  if (gameState === "start" && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 &&
      mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
    gameState = "ready";
    hasStartedMoving = false; // 重置開始狀態
    readyCountdown = 3; // 3秒倒计时
    lastCountdownTime = millis();
  }

  // 失败后点击重新开始
  if (gameState === "fail" || gameState === "success") { // 成功或失败后都可以点击重新开始
    gameState = "start";
  }
}
