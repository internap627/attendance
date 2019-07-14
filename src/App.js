import React from 'react';
import { useEffect, useState } from 'react';
import * as handTrack from 'handtrackjs';
import './App.css';

function App () {
  const modelParams = {
    flipHorizontal: true, // flip e.g for video
    imageScaleFactor: 0.7, // reduce input image size for gains in speed.
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.79 // confidence threshold for predictions.
  };
  let videoEl = null;
  let canvasEl = null;
  let model;
  let text = '';

  const [handStr, setHand] = useState('works');

  useEffect(() => {
    handTrack.load(modelParams).then(lModel => {
      model = lModel;
      handTrack.startVideo(videoEl).then(status => {
        if (status) {
          navigator.getUserMedia(
            { video: {} },
            stream => {
              videoEl.srcObject = stream;
              setInterval(runDetection, 1000);
            },
            err => console.log(err)
          );
        }
      });
    });
  });

  const runDetection = () => {
    if (!videoEl) return;
    model.detect(videoEl).then(predictions => {
      let num = predictions.length;
      text = num > 0 ? 'Hand detected' : 'No hands detected';
      setHand(text);
    });
  };
  return (
    <div className='App'>
      <video
        id='video'
        ref={video => {
          videoEl = video;
        }}
      />
      <canvas
        id='canvas'
        ref={canvas => {
          canvasEl = canvas;
        }}
      />
      <div>
        <h1>
          <strong>
            Status: {handStr}
          </strong>
        </h1>
      </div>
    </div>
  );
}

export default App;
