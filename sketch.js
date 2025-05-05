// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleSize = 100; // 圓的寬高
let isDragging = false; // 是否正在拖曳圓
let lastX, lastY; // 儲存食指的上一個位置
let thumbDragging = false; // 是否正在用大拇指拖曳圓
let thumbLastX, thumbLastY; // 儲存大拇指的上一個位置

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 設定背景為白色，讓軌跡可以永久保留
  background(255);

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 疊加影像，不覆蓋背景
  image(video, 0, 0);

  // 畫出圓形
  fill(0, 255, 0, 150); // 綠色半透明
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // 確保至少有一隻手被偵測到
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 取得食指的座標 (keypoint 8)
        let indexFinger = hand.keypoints[8];
        // 取得大拇指的座標 (keypoint 4)
        let thumb = hand.keypoints[4];

        // 計算食指與圓心的距離
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        // 計算大拇指與圓心的距離
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        // 如果食指接觸到圓，讓圓跟隨食指移動，並畫出紅色軌跡
        if (dIndex < circleSize / 2) {
          if (!isDragging) {
            // 開始拖曳時初始化上一個位置
            lastX = indexFinger.x;
            lastY = indexFinger.y;
          }
          isDragging = true;

          // 畫出手指的紅色軌跡
          stroke(255, 0, 0); // 紅色
          strokeWeight(10); // 線條粗細為 10
          line(lastX, lastY, indexFinger.x, indexFinger.y);

          // 更新圓的位置
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // 更新上一個位置
          lastX = indexFinger.x;
          lastY = indexFinger.y;
        } else {
          // 如果手指離開圓，停止拖曳
          isDragging = false;
        }

        // 如果大拇指接觸到圓，讓圓跟隨大拇指移動，並畫出藍色軌跡
        if (dThumb < circleSize / 2) {
          if (!thumbDragging) {
            // 開始拖曳時初始化上一個位置
            thumbLastX = thumb.x;
            thumbLastY = thumb.y;
          }
          thumbDragging = true;

          // 畫出大拇指的藍色軌跡
          stroke(0, 0, 255); // 藍色
          strokeWeight(10); // 線條粗細為 10
          line(thumbLastX, thumbLastY, thumb.x, thumb.y);

          // 更新圓的位置
          circleX = thumb.x;
          circleY = thumb.y;

          // 更新上一個位置
          thumbLastX = thumb.x;
          thumbLastY = thumb.y;
        } else {
          // 如果大拇指離開圓，停止拖曳
          thumbDragging = false;
        }

        // 繪製食指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);

        // 繪製大拇指的點
        fill(0, 0, 255); // 藍色
        noStroke();
        circle(thumb.x, thumb.y, 16);
      }
    }
  }
}
