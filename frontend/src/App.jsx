import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
export const serverUrl = "http://localhost:3000"

const App = () => {

  useGetCurrentUser()
  return (
    <Routes>
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/forgotpassword' element={<ForgotPassword/>} />
    </Routes>
  )
}

export default App