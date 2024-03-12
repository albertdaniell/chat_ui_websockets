import React from 'react'

function ChatBubble({user,msg,date,isCurrentUser}) {
  return (
  <div className='grid mt-3'>
    <div className={`w-[80%] rounded-lg p-3 bg-blue-100 ${isCurrentUser ? "justify-self-end":"justify-self-start"}`}>
        <p className='text-gray-500'>{user}</p>
        <p className='text-gray-800 mt-1'>{msg}</p>


        <p className='text-gray-400 mt-2 text-xs'>
            Date
        </p>
    </div>
  </div>
  )
}

export default ChatBubble