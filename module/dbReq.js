'use strict'

const { default: fastify } = require("fastify");

const ADD_USER = `INSERT INTO persons (vkId) values(?)`;
exports.addUser = async function(fastify,id){
    return fastify.mysql.query(ADD_USER, [id])
}

const UPDATE_USER_IS_FIRST_OPEN = `UPDATE persons SET isFirstOpen = 1 WHERE vkId = ?`;
exports.updateUserIsFirstOpen = async function(fastify,id){
    return fastify.mysql.query(UPDATE_USER_IS_FIRST_OPEN, [id])
}



const getSurvey = async(prefixEra) =>{
    const GET_SURVEY_BY_PREFIX = `SELECT * FROM surveys WHERE Era_prefixEra = ?`;
    return surveys = fastify.mysql.query(GET_SURVEY_BY_PREFIX,[prefixEra])
}
const GET_START_ERAS = `SELECT * FROM eras;`
// const GET_USER = `SELECT * FROM person WHERE vkId = ?;`;
exports.getStartDate = async function(fastify,id){


    let eras = await fastify.mysql.query(GET_START_ERAS);
    eras = eras[0];

    let erasObjects = [];
    console.log(eras)
    for(let era in eras){
        console.log(era.prefixEra)
        // console.log(getSurvey(era.prefixEra))
    }

    let surveys
    return eras
}

