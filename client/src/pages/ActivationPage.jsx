import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import  {server} from "../server"
import axios from "axios"
const ActivationPage = () => {
const {activation_token}=useParams( )
const [error,setError]=useState(false)
useEffect(() => {
  if (activation_token) {
    const sendRequest = async () => {
      try {
        const response = await axios.post(`${server}/user/activation`, {
          activation_token
        });
        console.log(response.data.message); // Log the response data
      } catch (error) {
        console.error(error.response.data.message); // Log the error for debugging
        setError(true); // Set an error state or display an error message to the user
      }
    };

    sendRequest();
  }
}, [activation_token]);


  return (
    <div className='w-[100vw] h-[100vh] justify-center items-center flex '>
      {error ?(
        <p>your token is expired </p>
      ):(
        <p>Your account has been created successfully</p>
      )}
    </div>
  )
}

export default ActivationPage