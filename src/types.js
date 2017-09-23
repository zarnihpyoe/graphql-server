import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
} from 'graphql'

import * as tables from './tables'

export const NodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    description: '...',

    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolveType: (source) => {
        if(source.__tableName === tables.users.getName()) return UserType
        else return PostType
    }
})

export const UserType = new GraphQLObjectType({
    name: 'User',
    description: '...',
    interfaces: [ NodeInterface ],

    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (source) => tables.dbIdToNodeId(source.id, source.__tableName)
        },
        name: { type: new GraphQLNonNull(GraphQLString) },      // if didn't specify resolve, by default, will look at source[name_of_the_field]
        about: { type: new GraphQLNonNull(GraphQLString) },
    }
})

export const PostType = new GraphQLObjectType({
    name: 'Post',
    description: '...',
    interfaces: [ NodeInterface ],

    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (source) => tables.dbIdToNodeId(source.id, source.__tableName)
        },
        body: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
    }
})