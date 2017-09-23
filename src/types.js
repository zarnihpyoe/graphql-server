import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
} from 'graphql'

import * as tables from './tables'
import * as loaders from './loaders'

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

    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (source) => tables.dbIdToNodeId(source.id, source.__tableName)
        },
        name: { type: new GraphQLNonNull(GraphQLString) },      // if didn't specify resolve, by default, will look at source[name_of_the_field]
        about: { type: new GraphQLNonNull(GraphQLString) },
        friends: {
            type: new GraphQLList(UserType),
            resolve: (source) => (
                loaders.getFriendIdsForUser(source.id).then(rows => {
                    const promises = rows.map(row => {
                        const friendNodeId = tables.dbIdToNodeId(row.user_id_b, row.__tableName)
                        return loaders.getNodeById(friendNodeId)
                    })
                    return Promise.all(promises)
                })
            )
        },
    })
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