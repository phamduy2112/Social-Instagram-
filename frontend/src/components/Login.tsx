import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'


function Login() {
    const [input,setInput]=useState({
        email:"",
        password:""
    })
    const changeEventHandler=(e:any)=>{
        setInput({...input,[e.target.name]:e.target.value});

    }
    const dispatch=useDispatch();
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const signupHandler=async(e:any)=>{
        e.preventDefault();
        
        try{
            setLoading(true)
            const res=await axios.post("http://localhost:8000/api/v1/user/login",input,{
                headers:{
                    "Content-Type":'application/json',

                },
                withCredentials:true,
            })
            if(res.data.success){
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message);
                navigate("/")
                setInput({
               
                    email:"",
                    password:""
                })
            }
        }catch(error){
            console.log(error);
            // toast.error(error.response.data.message)
            
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form  onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
            </div>
            <div>
                <span className='py-1 font-medium'>Email</span>
                <Input type='email'
                    name='email'
                        value={input.email}
                        onChange={changeEventHandler}
                className='focus-visible:ring-transparent my-2'/>
            </div>
            <div>
                <span className='py-1 font-medium'>Password</span>
                <Input type='password' 
                  name='password'
                  value={input.password}
                  onChange={changeEventHandler}
                className='focus-visible:ring-transparent my-2'/>
            </div>
            {
                loading?(<Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin'>Please wait</Loader2>
                </Button>):( <Button type='submit'>Login</Button>)
            }
           
            <span className='text-center'>Doesn't have an account? <Link className='text-blue-600' to={"/login"}>Signup</Link></span>
        </form>
    </div>
  )
}

export default Login