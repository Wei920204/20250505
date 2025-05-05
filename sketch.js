// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleSize = 100; // 圓的寬高
let isDragging = false; // 是否正在拖曳圓
let lastX, lastY; // 儲存手指的上一個位置

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

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // 設定背景為白色，讓軌跡可以永久保留
  background(255);
}

function draw() {
  // 將影像疊加在背景上
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

        // 計算食指與圓心的距離
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        // 如果食指接觸到圓，讓圓跟隨食指移動，並畫出軌跡
        if (d < circleSize / 2) {
          if (!isDragging) {
            // 開始拖曳時初始化上一個位置
            lastX = indexFinger.x;
            lastY = indexFinger.y;
          }
          isDragging = true;

          // 畫出手指的軌跡
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

        // 繪製食指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);
      }
    }
  }
}
