"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import ChatBubble from "./components/ChatBubble";

export default function Home() {
  let ws = new WebSocket("ws://localhost:8765");
  const [text, setText] = useState("");
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
      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        ws.send(
          JSON.stringify({
            type: "join_msg",
            value: `${userSelected} joined chat`,
            user: userSelected,
            date: new Date(),
          })
        );
      };

      ws.onmessage = (event) => {
        // Handle incoming messages

        let msg = event.data;
        let new_msg_array = [...messages, msg];
        msg = JSON.parse(msg);
        console.log({ new_msg_array });
        SetMessages((messages) => [...messages, msg]);

        console.log("Received:", event.data);
      };
      ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };
      return () => {
        ws.close();
      };
    }
  }, [userSelected]);

  const selectUser = (val) => {
    SetUserSelected(val);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    ws.send(
      JSON.stringify({
        type: "chat_msg",
        value: text,
        user: userSelected,
        date: new Date(),
      })
    );
    console.log("Sent!");
    setText("");

    setTimeout(() => {
      setText(null);
    }, 100);

    // socket.emit('chat message', newMessage);
    // setNewMessage('');
  };
  // <main className="flex min-h-screen flex-col items-center justify-between p-24">

  return (
    <>
      <div className="h-[100vh]  flex justify-center items-center">
        <div className="m-0 w-[50%] bg-white h-[100%] p-3">
          {/* <div>
        Preview:
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div> */}

          {!userSelected && (
            <>
              {users.map((user) => {
                return (
                  <button
                    onClick={() => selectUser(user)}
                    className="text-green-700 my-3 mx-2 bg-gray-100 p-3 rounded-full"
                  >
                    {user}
                  </button>
                );
              })}
            </>
          )}

          <div className="h-[90%] overflow-auto">
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
            {/* <ChatBubble msg="haha hahah hahah" user="Daniel"></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble>
            <ChatBubble msg="haha hahah hahah" user="Daniel" isCurrentUser={true}></ChatBubble> */}
          </div>
          {userSelected && (
            <div className="h-[10%] w-[100%]">
              <form onSubmit={sendMessage}>
                <div className="flex">
                  <div className="w-[90%] p-3">
                    <textarea
                      className="w-[100%] p-2 rounded-lg text-black"
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
