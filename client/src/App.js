import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {LoginPage, SignUpPage,ActivationPage, HomePage} from "./Routes.js"
import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
// import { useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { server } from './server';
// import Store from './redux/store';
// import { loadUser } from './redux/actions/user';
function App() {
  // useEffect(()=>{
  //   axios.get(`${server}/user/getUser`,{withCredentials:true}).then((res)=>{
  //     toast.success(res.data.message)
  //   }).catch(
  //     (err)=>{
  //       toast.error(err.response.data.message)
  //     }
  //   )
  //   // Store.dispatch(loadUser())

  // },[])
  return (
 <BrowserRouter >
 <Routes>
 <Route  path='/' element={<HomePage />}/>
 <Route path='/login' element={<LoginPage/>} />
<Route path="/sign-up" element={<SignUpPage />} />
 <Route  path='/activation/:activation_token' element={<ActivationPage />}/>
 </Routes>
 <ToastContainer
  position='bottom-center'
  autoClose={500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
 draggable
 pauseOnHover
 theme='dark'
/> 
 </BrowserRouter>
  );
}

export default App;
