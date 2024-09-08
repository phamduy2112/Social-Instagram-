import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FaHeart, FaRegHeart  } from "react-icons/fa";

import { Button } from './ui/button';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import { Badge } from './ui/badge';

function Post(props:any) {
    const [text,setText]=useState("");
    const [open,setOpen]=useState(false);
    const {user}=useSelector((store:any)=>store.auth)
    const {posts}=useSelector((store:any)=>store.post);
    const [liked, setLiked] = useState(props.post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(props.post.likes.length);
    const [comment,setComment]=useState(props.post.comments);

    const dispatch=useDispatch()
    const deletePostHandler=async()=>{
        try{
            const res=await axios.delete(`http://localhost:8000/api/v1/post/delete/${props.post._id}`,{withCredentials:true})
            if(res.data.success){
                const updatedPostData=posts.filter((postItem:any)=>postItem._id!==props.post?._id)
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        }catch(e){


        }
    }
    const likeOrDislikeHandler=async()=>{
        try{
            const action=liked?'dislike':'like'
            const res=await axios.get(`http://localhost:8000/api/v1/post/${props.post._id}/${action}`,{withCredentials:true})
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // apne post ko update krunga
                const updatedPostData = posts.map(p =>
                    p._id === props.post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        }catch(e){
            console.log(e);
            
        }
    }
    const commentHandler=async()=>{
        const res=await axios.post(`http://localhost:8000/api/v1/post/${props.post._id}/comment`,{ text }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        console.log(res.data);
        
        if (res.data.success) {
            const updatedCommentData = [...comment, res.data.comment];
            setComment(updatedCommentData);

            const updatedPostData = posts.map(p =>
                p._id === props.post._id ? { ...p, comments: updatedCommentData } : p
            );

            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
            setText("");
        }
    }
    const changeEventHandler=(e:any)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);

        }else{
            setText("")
        }
    }
  return ( 
    <div className='my-8 w-full max-w-sm mx-auto'>
        <div className='flex items-center justify-between'>
            <div className="flex items-center gap-2">

            <Avatar>
        <AvatarImage src={props.post.author?.profilePicture}/>
        <AvatarFallback>{props.post.author?.username[0]}</AvatarFallback>
      </Avatar> 
      <div className='flex items-center justify-center gap-3'>
        <h1>{props.post.author?.username}</h1>

        {user?._id===props.post.author._id &&   <Badge variant="secondary">Author</Badge>}
      
      </div>
      
            </div>
     <Dialog>
        <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer'/>
        </DialogTrigger>
        <DialogContent className='flex flex-col items-center text-sm text-center'>
            <Button variant="ghost" className='cursor-pointer w-fit text-[#ED4956] font-bold'>Unfollow</Button>
            <Button variant="ghost" className='cursor-pointer w-fit'>Add to favorites</Button>
           {
            user&&user?._id===props.post?.author._id &&  <Button 
            
            onClick={deletePostHandler}
            variant="ghost" className='cursor-pointer w-fit'>Delete</Button>
           }
           
        </DialogContent>
     </Dialog>
        </div>
        <img src={props.post.image} alt="" className='rounded-sm my-2 w-full aspect-square object-cover'/>
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                

<MessageCircle className='cursor-pointer hover:text-gray-600' onClick={()=>{
    dispatch(setSelectedPost(props.post))
    setOpen(true)}}
    
    />
<Send className='cursor-pointer hover:text-gray-600'/>
                </div>
     <Bookmark className='cursor-pointer hover:text-gray-600'/>
            </div>
  <span className='font-medium block mb-2'>{postLike} likes</span>
  <p>
    <span className='font-medium mr-2'>{props.post.author?.username}</span>
    {props.post.caption}
  </p>
  {
    comment.length >0 &&(
<span onClick={()=>setOpen(true)} className='cursor-pointer text-sm text-gray-400'>View all {props.post.comments.length} comments</span>   
    )
  }
    
    <CommentDialog open={open} setOpen={setOpen}/> 
    <div className='flex items-center justify-between'>
        <input type="text" placeholder='Add a comment...'
        className='outline-none text-sm w-full'
        value={text}
        onChange={changeEventHandler}
        />
        {text&&     <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}

        </div>  
    </div>
  )
}

export default Post