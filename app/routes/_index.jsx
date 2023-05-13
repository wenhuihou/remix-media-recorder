import React from "react";
import AudioRecorder from "~/components/AudioRecorder";
import VideoRecorder from "../components/VideoRecorder";

export const meta = () => [{ title: "Remix Recorder" }];

export default function Index() {
  return (
    <main className="mainWindow">
      <div className="mt-20">
        <h1>React Media Recorder</h1>
        <div>
          <AudioRecorder />
          <VideoRecorder />
        </div>
      </div>
    </main>
  );
}
