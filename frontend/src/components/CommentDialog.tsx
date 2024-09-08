import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice";

function CommentDialog(props: any) {
    const {selectedPost,posts}=useSelector((store:any)=>store.post)
    const [comment, setComment] = useState([]);

    const [text,setText]=useState("");
    const changeEventHandler=(e:any)=>{
        const inputText=e.target.value;
        if(inputText.trim()){
            setText(inputText);

        }else{
            setText("");
        }
    }
    const dispatch=useDispatch()
    useEffect(() => {
        if (selectedPost) {
          setComment(selectedPost.comments);
        }
      }, [selectedPost]);
    const sendMessageHandler = async () => {

        try {
          const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
    
          if (res.data.success) {
            const updatedCommentData:any = [...comment, res.data.comment];
            setComment(updatedCommentData);
    
            const updatedPostData = posts.map(p =>
              p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
            );
            dispatch(setPosts(updatedPostData));
            toast.success(res.data.message);
            setText("");
          }
        } catch (error) {
          console.log(error);
        }
      }
  return (
    <Dialog open={props.open}>
      <DialogContent
        onInteractOutside={() => props.setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
             src={selectedPost?.image}
              alt=""
              className="w-full h-full rounded-l-lg object-cover"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link to={"/profile"}>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CB</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={""} className="font-semibold text-xs">
                   {selectedPost?.author?.username}
                  </Link>
                  {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal></MoreHorizontal>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {
                    comment.map((comment:any)=><Comment key={comment._id} comment={comment}/>)
                }
              Comments ayenge
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                  className="w-full outline-none border border-gray-300 p-2 rounded"
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant={"outline"} className="h-[43px]">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
