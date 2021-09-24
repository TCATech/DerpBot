const express = require('express')
const app = express()

module.exports = () => {
    app.get('/', (req, res) => {
        res.send('I like economy')
    })

    app.listen(3000)
}