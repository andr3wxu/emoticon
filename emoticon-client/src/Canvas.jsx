import React from 'react';
import axios from 'axios';

function Canvas(props) {
    const canvasRef = React.useRef(null);
    const mouseDownRef = React.useRef(false);
    
    const scale = 10;
    const canvasSize = 30;
    const penSize = 2;

    function draw(ctx, position) {
        ctx.fillStyle = "black";
        ctx.fillRect(position.x - penSize, position.y - penSize, penSize, penSize);
    }

    React.useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const canvasRect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.willReadFrequently = true;

        const mouseDownListener = (e) => {
            mouseDownRef.current = true;
            draw(ctx, {x: (e.clientX - canvasRect.x)/scale, y: (e.clientY-canvasRect.y)/scale})
        }

        const mouseUpListener = (e) => {
            mouseDownRef.current = false;
        }

        const mouseMoveListener = (e) => {
            if (mouseDownRef.current) {
                draw(ctx, {x: (e.clientX - canvasRect.x)/scale, y: (e.clientY-canvasRect.y)/scale})
            }
        } 

        canvas.addEventListener("mousedown", mouseDownListener);
        canvas.addEventListener("mouseup", mouseUpListener);
        canvas.addEventListener("mouseleave", mouseUpListener);
        window.addEventListener("mousemove", mouseMoveListener);


        return(()=>{
            window.removeEventListener("mousemove", mouseMoveListener);
            canvas.removeEventListener("mousedown", mouseDownListener);
            canvas.removeEventListener("mouseup", mouseUpListener)
        });
    }, [])

    
    function clear(event) {
        if (event) event.preventDefault();
        if (!canvasRef) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        props.sendPrediction(undefined); 
    }

    function saveCanvas(event) {
        event.preventDefault();
        if (!canvasRef) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const img = ctx.getImageData(0, 0, canvasSize, canvasSize);
        const imgData = img.data;
        const greyscaleData = [];
        for (let i = 0; i < imgData.length; i++) {
            let value = 0;
            for (let j = 0; j < 3; j++) {
                value += imgData[i++];
            }
            greyscaleData.push(value/3/255);
        }

        getPrediction (greyscaleData);
    }


    async function getPrediction(imgArray) {
        // const options = {
        //     mode: 'cors',
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/JSON' },
        //     body: JSON.stringify({'img_array': imgArray})
        // }
        // const response = await fetch('http://3.144.174.132:2000/api/getPredict', options);
        const options = {
            mode: 'cors',
        }
        const response = await axios.put('http://localhost:2000/api/getPredict', {img_array: imgArray}, options);
        const prediction = response.data;
        props.sendPrediction(prediction);
    }

    return(
        <>
        <div className="canvas-container" 
            style={{height:`${canvasSize*scale}px`, width:"100%"}}>
            <canvas 
                ref={canvasRef} 
                style={{
                    border:"0.1px solid lightgray", 
                    borderRadius:"2px",
                    transform:`scale(${scale})`,
                    position:"relative",
                    top: `${canvasSize*(scale-1)/2}px`,
                    left: `calc(50% - 15px)`,
                    
                }}
            />
        </div>
        <div style={{padding:"10px"}}>
            <button onClick={(event) => clear(event)} style={{margin:"10px"}}>Restart</button>
            <button onClick={(event) => saveCanvas(event)} style={{margin:"10px"}}>Submit</button>
        </div>
        </>
    );
};

export default Canvas;