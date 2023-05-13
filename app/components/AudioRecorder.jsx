import { useState, useRef } from "react";

export default function AudioRecorder() {
  const mimeType = "audio/webm";
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const getMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setStream(stream);
      setPermission(true);
    } catch (err) {
      console.log(err);
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { type: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  return (
    <div className="recorder">
      <h2>Audio Recorder</h2>
      <div className="audio-controls">
        {!permission ? (
          <button
            className="btn-flex"
            onClick={getMicrophonePermission}
            type="button"
          >
            Enable Microphone
          </button>
        ) : null}
        {permission && recordingStatus === "inactive" ? (
          <button className="btn-flex" onClick={startRecording} type="button">
            Start Recording
          </button>
        ) : null}
        {recordingStatus === "recording" ? (
          <button className="btn-flex" onClick={stopRecording} type="button">
            Stop Recording
          </button>
        ) : null}
      </div>
      {audio ? (
        <div className="audio-player">
          <audio src={audio} controls></audio>
          <a className="link" download href={audio}>
            Download Audio
          </a>
        </div>
      ) : null}
    </div>
  );
}
