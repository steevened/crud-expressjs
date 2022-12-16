const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const app = express()
app.use(express.json())
const jsonPath = path.resolve('./file/users.json')

//express are building with middlewares
//a middlewer is a function
//express works with 3 kinds of middleweres
//1. of application
//2. incorporated middlewares
//3. by third middleware

// //this middleware response with any http method(GET, POST, PUT , DELETE, PATCH)
// app.use((req, res) => {
//   res.send('i response anything')
// })

//application middleware for access to request and response methods
app.get('/users', async (req, res) => {
  //get the json
  const jsonFile = await fs.readFile(jsonPath, 'UTF-8')
  //send the data and end with the request (res.end())
  res.send(jsonFile)
})

//to create an user

app.post('/users', async (req, res) => {
  //post send us data inside the body of the request
  //here we cannot use events, instead of, we use middlewares
  const user = req.body
  //get the array from jsonFile
  const usersArray = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  //generate a new id
  const newId = usersArray.length + 1

  //add the body to the json
  usersArray.push({ id: newId, ...user })
  //write to the json
  await fs.writeFile(jsonPath, JSON.stringify(usersArray))
  res.end()
})

app.put('/users', async (req, res) => {
  const userBody = req.body
  const usersArray = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  const arrayToPut = usersArray.map((user) => {
    if (user.id === userBody.id) {
      user = userBody
    }
    return user
  })
  await fs.writeFile(jsonPath, JSON.stringify(arrayToPut))
  res.end()
})

app.delete('/users', async (req, res) => {
  const userBody = req.body
  const users = JSON.parse(await fs.readFile(jsonPath, 'UTF-8'))
  const usersNotDeleted = users.filter((user) => {
    return user.id !== userBody.id
  })
  await fs.writeFile(jsonPath, JSON.stringify(usersNotDeleted))
  res.end()
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
