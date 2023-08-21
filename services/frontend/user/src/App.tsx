import { useState } from "react";
import { pingValidator } from "./types/pingValidator";
import ping from "./services/ping";

const App = () => {

  const [msg, setMsg] = useState('got nofting');

  const handlePingClick = async () => {

    try {
      const res = await ping.pingApi();
      const resTV = pingValidator(res as unknown);

      console.log(resTV);

      setMsg(resTV.message);
    }
    catch (e) {
      return;
    }
  };

  return (
    <>
      <div>Hello! ACTY </div>
      <button onClick={() => void handlePingClick()}>Ping backend here</button>
      <div>{msg}</div>
    </>
  );
};

export default App;