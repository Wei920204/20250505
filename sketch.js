// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleSize = 100; // 圓的寬高

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
}

function draw() {
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

        // 如果食指接觸到圓，讓圓跟隨食指移動
        if (d < circleSize / 2) {
          circleX = indexFinger.x;
          circleY = indexFinger.y;
        }

        // 繪製食指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);

        // Set color based on handedness
        if (hand.handedness == "Left") {
          stroke(255, 0, 255); // Magenta for left hand
        } else {
          stroke(255, 255, 0); // Yellow for right hand
        }
        strokeWeight(2);

        // Draw lines for keypoints 0-4
        for (let i = 0; i < 4; i++) {
          let kp1 = hand.keypoints[i];
          let kp2 = hand.keypoints[i + 1];
          line(kp1.x, kp1.y, kp2.x, kp2.y);
        }

        // Draw lines for keypoints 5-8
        for (let i = 5; i < 8; i++) {
          let kp1 = hand.keypoints[i];
          let kp2 = hand.keypoints[i + 1];
          line(kp1.x, kp1.y, kp2.x, kp2.y);
        }

        // Draw lines for keypoints 9-12
        for (let i = 9; i < 12; i++) {
          let kp1 = hand.keypoints[i];
          let kp2 = hand.keypoints[i + 1];
          line(kp1.x, kp1.y, kp2.x, kp2.y);
        }

        // Draw lines for keypoints 13-16
        for (let i = 13; i < 16; i++) {
          let kp1 = hand.keypoints[i];
          let kp2 = hand.keypoints[i + 1];
          line(kp1.x, kp1.y, kp2.x, kp2.y);
        }

        // Draw lines for keypoints 17-20
        for (let i = 17; i < 20; i++) {
          let kp1 = hand.keypoints[i];
          let kp2 = hand.keypoints[i + 1];
          line(kp1.x, kp1.y, kp2.x, kp2.y);
        }
        // Optionally, draw circles for all keypoints
        for (let keypoint of hand.keypoints) {
          noStroke();
          fill(hand.handedness == "Left" ? color(255, 0, 255) : color(255, 255, 0));
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}
