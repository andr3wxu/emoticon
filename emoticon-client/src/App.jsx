import React from 'react'
import Canvas from './Canvas'
import Prediction from './Prediction'
import happy from "./assets/4.png"
import sad from "./assets/5.png"
import shocked from "./assets/6.png"

import './App.css'

function App() {
  const [prediction, setPrediction] = React.useState(undefined);

  function handlePrediction(prediction) {
    setPrediction(prediction);
  }

  return (
    <>
      <div className="max-w-3xl m-8">
          <h1 className='m-5'>Draw a face!</h1>
        <p>This site uses a neural network designed to identify the expression of a hand-drawn emoticon. Here are the expressions we trained it on:</p>
        <div className="m-5 flex flex-row justify-center items-center">
          <div className='flex'>
            <img className="pl-5 pr-3" src={happy}/>
            <p>happy face</p>
          </div>
          <div className='flex'>
            <img className="pl-5 pr-3" src={sad}/>
            <p>sad face</p>
          </div>
          <div className='flex'>
            <img className="pl-5 pr-3" src={shocked}/>
            <p>shocked face</p>
          </div>
        </div>
        <p>So draw a face, any face (preferably a happy, sad, or shocked face) and see if our AI can identify its expression!</p>
      </div>
      <div className='flex flex-row justify-center'>
        <div className='flex flex-col bg-white bg-opacity-70 w-2/5 p-5 rounded-3xl'>
          <Canvas sendPrediction={handlePrediction}/>
          <Prediction getPrediction={prediction}/>
        </div>
      </div>
    </>
  )
}

export default App;
