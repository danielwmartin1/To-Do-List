const express = require('express')
const app = express()
const port = 4000
// In-memory data store
let tasks = [
    {
      id: 1,
      title: "The Rise of Decentralized Finance",
    },
    {
      id: 2,
      title: "The Impact of Artificial Intelligence on Modern Businesses",
    },
    {
      id: 3,
      title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    },
  ];


app.get('/tasks', (req, res) => {
  res.send(tasks)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})