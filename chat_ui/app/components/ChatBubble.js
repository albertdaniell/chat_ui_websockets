import React from "react";

function ChatBubble({ user, msg, date, isCurrentUser, type }) {
  return (
    <div className="grid mt-3">
      {type !== "join_msg" ? (
        <div
          className={`w-[80%] rounded-lg p-3 bg-blue-100 ${
            type == "join_msg"
              ? "justify-self-center"
              : isCurrentUser
              ? "justify-self-end"
              : "justify-self-start"
          }`}
        >
          {type !== "join_msg" ? (
            <>
              <p className="text-gray-500">{user}</p>
              <p className="text-gray-800 mt-1">{msg}</p>

              {date !== undefined && (
                <p className="text-gray-400 mt-2 text-xs text-right">{date}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-800 mt-1">{msg}</p>
            </>
          )}
        </div>
      ) : (
        <div
          className={`w-[80%] rounded-full p-2 bg-gray-100 justify-self-center 
          w-50
           `}
        >
          <p className="text-gray-800 mt-1 text-xs text-center">{msg}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBubble;
