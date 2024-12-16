import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import { fetchAuthUser } from './store/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast'

function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.authenticate)
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      await dispatch(fetchAuthUser())
    })()
  }, [fetchAuthUser])

  return (
    <div theme="light">
      {/* {
        authUser && <div className='flex justify-center items-center h-screen'>
          <Loader className="animate-spin size-10" />
        </div>} */}
      <NavBar />
      <Routes>
        <Route path='/home' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
