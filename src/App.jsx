import { useState } from "react";
import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1 className="text-3xl text-red-500 font-bold underline">Hello world!</h1>
    </div>
  );
}

export default App;
