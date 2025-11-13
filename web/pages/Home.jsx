import React from 'react'
import { useNavigate } from 'react-router-dom'
import B1 from '../components/B1'
import MainHead from '../components/mainHead'
const Home = () => {
  const navigate = useNavigate()

  return (
    <>
      <MainHead />
      <div className="flex justify-center mt-5">
        <B1 label="sign in" onClick={() => navigate('/signin')} />
      </div>
    </>

  )

}

export default Home
