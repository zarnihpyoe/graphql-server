import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
} from 'graphql'

import {
    NodeInterface,
    UserType,
    PostType,
} from './types'

import * as loaders from './loaders'

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'The root query',

    fields: {
        node: {
            type: NodeInterface,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (root, args) => loaders.getNodeById(args.id)       // return a promise which returns data_row
        }
    }
})

let inMemoryStore = {}

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'The root mutation',

    fields: {
        setNode: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                value: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (source, args) => {
                inMemoryStore[args.id] = args.value
                return inMemoryStore[args.id]
            }
        }
    }
})

export default new GraphQLSchema({
    types: [ UserType, PostType ],
    query: RootQuery,
    mutation: RootMutation,
})