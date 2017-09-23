import express from 'express'
import graphqlHTTP from 'express-graphql'
// import {  } from 'graphql'

import Schema from './schema'

const app = express()

app.use('/graphql', graphqlHTTP({
    schema: Schema,
    graphiql: true,
}))

app.listen(3000, () => {
    console.log('server running at port 3000')
})