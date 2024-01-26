import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
const [jokes, setJokes] = useState([])
useEffect(()=>{
  // axios.get('http://localhost:3000/api/jokes')
  axios.get('/api/jokes')
  .then((response)=>{
    console.log(response);
    setJokes(response.data)
  })
  .catch((error)=>{
    console.log(error);
  })
})

  return (
    <>
      <h1>Joke APP</h1>
      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke)=>(
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
