import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [streamId, setStreamId] = useState(``);

  return (
    <div className="App">
      <input value={streamId} onChange={event => setStreamId(event.target.value)}></input>
      {streamId && <video width="320" height="240" controls>
        <source src={`/api/stream/${streamId}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>}
    </div>
  );
}

export default App;
