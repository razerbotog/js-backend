import express from "express";

const app = express();

app.use(express.static('dist')); //serving static file directly
app.get('/', (req, res)=>{
    res.send("Server is ready")
})
app.get('/api/jokes', (req, res)=>{
    const jokesArray = [
        {
          id: 1,
          title: "Dad Joke",
          content: "Why couldn't the bicycle stand up by itself? It was two-tired."
        },
        {
          id: 2,
          title: "Pun Time",
          content: "I told my wife she should embrace her mistakes. She gave me a hug."
        },
        {
          id: 3,
          title: "Knock, Knock",
          content: "Knock, knock. Who’s there? Alpaca who? Alpaca the suitcase, you load up the car."
        },
        {
          id: 4,
          title: "Tech Humor",
          content: "Why do programmers prefer dark mode? Because light attracts bugs."
        },
        {
          id: 5,
          title: "Classic Joke",
          content: "Why did the scarecrow win an award? Because he was outstanding in his field."
        }
      ];
    res.send(jokesArray)
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})