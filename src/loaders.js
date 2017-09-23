import * as tables from './tables'
import * as database from './database'

export const getNodeById = (nodeId) => {
    const { tableName, dbId } = tables.splitNodeId(nodeId)

    const table = tables[tableName]
    const query = table
        .select(table.star())
        .where(table.id.equals(dbId))
        .limit(1)
        .toQuery()
    
    return database.getSql(query)
        .then((rows) => {
            if(rows[0]) {
                rows[0].__tableName = tableName
            }
            return rows[0]
        })
}

export const getFriendIdsForUser = (userId) => {
    const table = tables.usersFriends
    const query = table
        .select(table.user_id_b)
        .where(table.user_id_a.equals(userId))
        .toQuery()

    return database.getSql(query)
        .then(rows => {
            rows.forEach(row => row.__tableName = tables.users.getName())
            return rows
        })
}