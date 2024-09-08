import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Comment(props:any) {

  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
        <Avatar>
                    <AvatarImage src={props.comment?.author?.profilePicture} />
                    <AvatarFallback>CB</AvatarFallback>
                  </Avatar>
                  <h1 className='font-bold text-sm'>{props.comment?.author?.username} <span className='font-normal pl-1'>{props.comment?.text}</span></h1>
        </div>
    </div>
  )
}

export default Comment