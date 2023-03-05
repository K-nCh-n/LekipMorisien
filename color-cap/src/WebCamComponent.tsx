import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./styles.css";
import { BsArrowRepeat, BsHouseDoorFill } from "react-icons/bs";
import axios from 'axios';

const WebCamComponent = () => {

    const launchLabel = "START!";
    const takePictureLabel = "CAPTURE"

    const [openCamera, setOpenCamera] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const [picture, setPicture] = useState<string | null>(null);

    const getScreenshotWebcam = useCallback(() => {
        const imageTaken = webcamRef.current?.getScreenshot();
        if (imageTaken) {
            setPicture(imageTaken);

            const base64EncodedImage = imageTaken.replace(/^data:image\/(png|jpg|jpeg);base64,/, "").replaceAll("/", "-").replaceAll("+", "_");
            try {
                var config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                axios.post("http://localhost:5000/colorName", 
                { image: base64EncodedImage }, config).then(response => {
                    console.log(response.data);
                });
               
            } catch (error) {
                console.error(error);
            }
        }

        
    }, [webcamRef]);

    const goBackToHome = () => {
        setOpenCamera(false)
        setPicture(null)
    }

    return (
        <div className="container">
            {!openCamera && (
                <div className="welcome-btn-container" >
                    <button className="btn" onClick={() => setOpenCamera(true)}>{launchLabel}</button>
                </div>
            )}
            {openCamera && picture === null && (
                <div className="webcam-container">
                    <div className="webcam">
                        <Webcam
                            audio={false}
                            width={700}
                            height={500}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            mirrored={true}
                        />
                        <div className="overlay">
                            <img alt="grid" src={require('./images/grid.png')} height={"90%"} width={"90%"} />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <button className="btn" onClick={getScreenshotWebcam}>{takePictureLabel}</button>
                        <BsHouseDoorFill onClick={goBackToHome} size={"30px"} style={{ cursor: "pointer", padding: 35}} />
                    </div>
                </div>
                
            )}
            {picture && (
                <div style={{marginTop: "45px"}}>
                    <img style={{ padding: 10 }} src={picture} alt="Screenshot" height={500} width={700} />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <BsHouseDoorFill onClick={goBackToHome} size={"30px"} style={{ cursor: "pointer", padding: 15}} />
                        <BsArrowRepeat onClick={() => { setPicture(null) }} size={"30px"} style={{ cursor: "pointer", padding: 15}} />
                    </div>
                </div>
            )}
        </div>
    )

}

export default WebCamComponent;