require('dotenv').config()
// console.log(process.env.PORT)

const express = require('express')
const app = express()
const port = process.env.PORT
const github = {
    "login": "razerbotog",
    "id": 123809151,
    "node_id": "U_kgDOB2Etfw",
    "avatar_url": "https://avatars.githubusercontent.com/u/123809151?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/razerbotog",
    "html_url": "https://github.com/razerbotog",
    "followers_url": "https://api.github.com/users/razerbotog/followers",
    "following_url": "https://api.github.com/users/razerbotog/following{/other_user}",
    "gists_url": "https://api.github.com/users/razerbotog/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/razerbotog/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/razerbotog/subscriptions",
    "organizations_url": "https://api.github.com/users/razerbotog/orgs",
    "repos_url": "https://api.github.com/users/razerbotog/repos",
    "events_url": "https://api.github.com/users/razerbotog/events{/privacy}",
    "received_events_url": "https://api.github.com/users/razerbotog/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Arif Akhtar",
    "company": null,
    "blog": "",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": "Hi , I'm Arif. And I am a passionate\r\nWEB-DEVELOPER.Currently exploring this platform .",
    "twitter_username": null,
    "public_repos": 16,
    "public_gists": 0,
    "followers": 0,
    "following": 1,
    "created_at": "2023-01-28T10:57:56Z",
    "updated_at": "2023-11-14T06:23:06Z"
  }
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/twitter', (req, res)=>{
    res.send("arif@twitter.com")
})
app.get('/login', (req, res)=>{
    res.send('<h1>Please login</h1>')
})
app.get('/github', (req, res)=>{
    res.json(github)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})