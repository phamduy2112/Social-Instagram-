import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

function Posts() {
    const {posts}=useSelector((store:any)=>store.post);
    
  return (

    <div>
        {posts.map((post:any)=><Post key={post._id} post={post}/>)}
        </div>
  )
}

export default Posts