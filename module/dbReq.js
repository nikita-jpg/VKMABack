'use strict'

const ADD_USER = `INSERT INTO persons (vkId) values(?)`;
exports.addUser = async function(fastify,id){
    return fastify.mysql.query(ADD_USER, [id])
}

const UPDATE_USER_IS_FIRST_OPEN = `UPDATE persons SET isFirstOpen = 1 WHERE vkId = ?`;
exports.updateUserIsFirstOpen = async function(fastify,id){
    return fastify.mysql.query(UPDATE_USER_IS_FIRST_OPEN, [id])
}

const GET_USER = `SELECT * FROM person WHERE vkId = ?;`;
exports.getUserById = async function(fastify,id){
    return fastify.mysql.query(GET_USER, [id])
}

