import horse from "./assets/4.mp3";
import "./App.css";
import playBtn from "./assets/play.svg";
import pauseBtn from "./assets/pause.svg";
import prevBtn from "./assets/prev.svg";
import nextBtn from "./assets/next.svg";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isPlaying, setisPlaying] = useState(false);
  const [audCtrl, setaudCtrl] = useState({});
  const [slider, setslider] = useState({});
  const [currentSong, setcurrentSong] = useState(horse);
  const [songNumber, setsongNumber] = useState(1);
  const apiBase = "https://lofi-station-backend.herokuapp.com/";
  // const apiBase = "http://localhost:8080/";

  useEffect(() => {
    setaudCtrl(document.getElementById("aud"));
    setslider(document.getElementById("myRange"));
    window.addEventListener("keypress", handleKeypress, false);
    audCtrl.onended = function () {
      audCtrl.currentTime = 0;
      setisPlaying(false);
      console.log('object')
    };
  }, []);

  const handleKeypress = (e) => {
    if (!(audCtrl && slider)) return;
    if (e.key == " ") {
      if (!isPlaying) {
        audCtrl.play();
        setisPlaying(true);
      } else {
        audCtrl.pause();
        setisPlaying(false);
      }
    }
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const ignite = async () => {
    let glitchs = document.getElementsByClassName("box");
    let i = 0;
    for (let i = 0; i < glitchs.length; i++) {
      let glitch = glitchs[i];
      glitch.style.left = Math.floor(Math.random() * (100 - 1 + 1)) + 1 + "vw";
      glitch.style.top = Math.floor(Math.random() * (90 - 0 + 1)) + 0 + "vh";
      glitch.style.width =
        Math.floor(Math.random() * (400 - 10 + 1)) + 10 + "px";
      glitch.style.height =
        Math.floor(Math.random() * (100 - 1 + 1)) + 1 + "px";
      glitch.style.backgroundPosition =
        Math.floor(Math.random() * (100 - 10 + 1)) + 10 + "px";
      await sleep(3000);
    }
  };

  const handleSeek = (e) => {
    audCtrl.currentTime = audCtrl.duration * (parseFloat(slider.value) / 100);
  };

  const handlePlay = () => {
    audCtrl.play();
    audCtrl && setisPlaying(true);
  };
  const handlePause = () => {
    audCtrl.pause();
    audCtrl && setisPlaying(false);
  };
  const handlePrev = async () => {
    console.log(songNumber, "songNumber before mutation");
    if (songNumber > 1) {
      setsongNumber(songNumber - 1);
      console.log(songNumber, "if-songNumber-prev");
    } else {
      setsongNumber(6);
      console.log(songNumber, "else-songNumber-prev");
    }

    await axios
      .get(`${apiBase}${songNumber}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        let returnedB64 =
          "data:" +
          res.headers["content-type"] +
          ";base64," +
          Buffer.from(res.data).toString("base64");
        setcurrentSong(returnedB64);
        audCtrl.src = returnedB64;
        audCtrl.play();
        setisPlaying(true);
      });
  };

  const handleNext = async () => {
    console.log("mutating in nxt");
    if (songNumber < 6) {
      setsongNumber(songNumber + 1);
      console.log(songNumber, "if-songNumber-nxt");
    } else {
      setsongNumber(1);
      console.log(songNumber, "else-songNumber-nxt");
    }
    await axios
      .get(`${apiBase}${songNumber}`, {
        responseType: "arraybuffer",
      })
      .then((res) => {
        let returnedB64 =
          "data:" +
          res.headers["content-type"] +
          ";base64," +
          Buffer.from(res.data).toString("base64");
        setcurrentSong(returnedB64);
        audCtrl.src = returnedB64;
        audCtrl.play();
        setisPlaying(true);
      });
  };

  return (
    <>
      <div id="glitchContainer">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
      {/* below d-none is bcoz setIntervals id is printing on screen */}
      <div style={{ display: "none" }}>
        {setInterval(() => {
          ignite();
          if (slider && audCtrl) {
            slider.value = (audCtrl.currentTime / audCtrl.duration) * 100;
          }
        }, 200)}
      </div>
      <audio controls className="d-none" id="aud">
        <source src={currentSong} type="audio/ogg" />
        <source src={currentSong} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <input
        type="range"
        min={0}
        max={100}
        defaultValue={0}
        className="slider"
        id="myRange"
        onChange={handleSeek}
      />

      <div className="controlBoard">
        <img className="" src={prevBtn} onClick={handlePrev} />
        {!isPlaying ? (
          <img className="mainBtns" src={playBtn} onClick={handlePlay} />
        ) : (
          <img className="mainBtns" src={pauseBtn} onClick={handlePause} />
        )}
        {isPlaying}
        <img className="" src={nextBtn} onClick={handleNext} />
      </div>
    </>
  );
}

export default App;
