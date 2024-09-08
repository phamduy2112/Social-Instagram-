import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '../lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';

function CreatePost(props:any) {
    const imageRef=useRef();
    const [file,setFile]=useState("");
    const [caption,setCaption]=useState("");
    const [imagePreview,setImagePreview]=useState("");
    const [loading,setLoading]=useState(false);
    const {user}=useSelector((store:any)=>store.auth)
    const {posts}=useSelector((store:any)=>store.post);
    const dispatch=useDispatch();

    const createPostHandler=async(e:any)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append("caption",caption);
        if(imagePreview) formData.append("image",file);
            try {
                setLoading(false)
                const res=await axios.post("http://localhost:8000/api/v1/post/addpost",formData,{
                    headers:{
                        "Content-Type":"multipart/form-data"
                    },
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setPosts([res.data.post, ...posts]));// [1] -> [1,2] -> total element = 2
                    toast.success(res.data.message)
                    props.setOpen(false)
                }
         } catch (error:any) {
            console.log(error);
            
        }finally{
            setLoading(true)
        }
    }
    const fileChangeHandler=async(e:any)=>{
        const file=e.target.files?.[0];
   
        
        if(file){
            setFile(file);
            const dataUrl=await readFileAsDataURL(file)
            setImagePreview(dataUrl)
        }

    }
  return (
    <Dialog open={props.open}>
        <DialogContent onInteractOutside={()=>props.setOpen(false)}>
            <DialogHeader className='text-center font-semibold'>
                Create New Post
            </DialogHeader>
            <div className="flex gap-3 items-center">
            <Avatar>
        <AvatarImage src={user?.profilePicture} />
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>  
                <div>
                    <h1 className='font-semibold text-xs'>{user?.username}</h1>
                    <span className='text-gray-600 text-xs'>Bio here...</span>
                </div>
            </div>
            <Textarea 
            value={caption}
            onChange={(e)=>setCaption(e.target.value)}
            className='focus-visible:ring-transparent border-none' placeholder='Write a caption...'>

            </Textarea>
            {
                imagePreview && (
                    <div className='w-full h-64 flex items-center justify-centerw'>
                        <img src={imagePreview} alt="preview_img"  className='object-cover h-full w-full rounded-md'/>
                    </div>
                )
            }
            <input 
            ref={imageRef}
            type='file' className='hidden' onChange={fileChangeHandler}/>
            <Button onClick={()=>imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>
            {
                imagePreview&&(
                    loading?(
                      <Button>
                        <Loader2 className='mr-2 h-4 w-4 amimate-spin'/>
                        Please wait
                      </Button>   
                    ):(
                            <Button onClick={createPostHandler} type='submit' className='w-full'>Post</Button>
                    )
                )
            }
            {/* <Button onClick={createPostHandler} type='submit' className='w-full'>Post</Button> */}
           
        </DialogContent>
    </Dialog>
  )
}

export default CreatePost