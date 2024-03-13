"use client";
import { useEffect, useState } from "react";
import ChatBubble from "./components/ChatBubble";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Home() {
  const WS_URL = "ws://localhost:8765";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");

  const [userSelected, SetUserSelected] = useState(null);
  const [messages, SetMessages] = useState([]);

  const users = ["Daniel_123", "Tom_456", "Kennedy_789", "Tyson_0123"];
  const handleTextareaChange = (event) => {
    const newText = event.target.value;
    // Replace newline characters with a visible representation (e.g., <br />)
    const textWithBreaks = newText.replace(/\n/g, "<br />");
    setText(textWithBreaks);
  };

  useEffect(() => {
    if (userSelected !== null) {
      console.log("Connection state changed");
      if (readyState === ReadyState.OPEN) {
        sendJsonMessage({
          type: "join_msg",
          value: `${userSelected} joined chat`,
          user: userSelected,
          date: new Date(),
        });
      }
    }
  }, [readyState, userSelected]);

  useEffect(() => {
    console.log(`Got a new message: ${lastJsonMessage}`);

    console.log(lastJsonMessage);

    // Handle incoming messages

    let msg = lastJsonMessage;
    let new_msg_array = [...messages, msg];
    // msg = JSON.parse(msg);
    console.log(messages);

    lastJsonMessage && SetMessages((messages) => [...messages, msg]);
  }, [lastJsonMessage]);

 
  const waitForOpenConnection = (socket) => {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200; //ms

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error("Maximum number of attempts exceeded"));
        } else if (socket.readyState === socket.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  };

  const selectUser = (val) => {
    SetUserSelected(val);
  };

  // const handleSendMessage = useCallback(() => sendMessage('Hello'), []);

  const sendMessage = async (e) => {
    e.preventDefault();

    sendJsonMessage({
      type: "chat_msg",
      value: text,
      user: userSelected,
      date: new Date(),
    });

  
  };

  return (
    <>
      <div className="h-[100vh]  flex justify-center items-center">
        <div className="m-0 w-[50%] bg-white h-[100%] p-3">
        
          <center>
            {!userSelected && (
              <>
                <p className="text-black text-xl text-center my-3">
                  Welcome to the Websocket Chat. Select a user below to begin
                  chatting
                </p>
                <hr></hr>
                {users.map((user) => {
                  return (
                    <>
                      <button
                        onClick={() => selectUser(user)}
                        className="text-green-700 my-3 mx-2 bg-gray-100 p-3 rounded-full w-[40%]"
                      >
                        {user}
                      </button>
                      <br></br>
                    </>
                  );
                })}
              </>
            )}
          </center>

          <div className="h-[90%] overflow-auto">
            {messages.length !== 0 && userSelected && (
              <>
                {messages.map((msg) => {
                  return (
                    <ChatBubble
                      type={msg.type}
                      date={msg.date}
                      isCurrentUser={msg.user === userSelected}
                      msg={msg.value}
                      user={msg.user}
                    ></ChatBubble>
                  );
                })}
              </>
            )}

           
          </div>
          {userSelected && (
            <div className="h-[10%] w-[100%]">
              <form onSubmit={sendMessage}>
                <div className="flex">
                  <div className="w-[90%] p-3">
                    <textarea
                      className="w-[100%] p-5 rounded-lg text-black bg-gray-100"
                      value={text}
                      onChange={handleTextareaChange}
                      rows={2}
                      cols={30}
                      placeholder="Enter your text here..."
                    />
                  </div>

                  <div className="w-[10%]" onClick={sendMessage}>
                    <button className="p-2 text-black">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
