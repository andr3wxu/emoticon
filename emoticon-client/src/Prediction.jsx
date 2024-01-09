import React from 'react';

function Prediction({  getPrediction  }) {
    const [prediction, setPrediction] = React.useState(undefined);

    const labels = ["happy", "sad", "shocked"];

    React.useEffect(()=>{
        setPrediction(getPrediction);
    }, [getPrediction])


    if (prediction==undefined){
        return <></>;
    } else if (typeof prediction == "number"){
        return <div className='flex flex-row justify-center'><h3>Did you draw a {labels[prediction-1]} face?</h3></div>;
    } else {
        return <div className='flex flex-row justify-center'><h3 className='text-gray-400'>{prediction}</h3></div>;
    }
}

export default Prediction;