// let data =[

// ]
const fs = require('fs')
const path = require('path');

const getSubDirArr = (pathToDir) =>{
    const fullPatchToDir = path.join(__dirname, pathToDir);
    const fileNames = fs.readdirSync(fullPatchToDir);

    if(fileNames)
        return fileNames
    else
        return fastify.log.error("Not subDirectories");

}

const getPatches = () => {
    const mainDirectory = "questionnaires";
    let patchesArr = [{mainPath:mainDirectory}];
    let arrFirstLevel = getSubDirArr("../" + mainDirectory +"/");
    for(way of arrFirstLevel){
        patchesArr.push({
            era:way,
            surveysArr:[]
        })
    }

    for (firstLevelName of arrFirstLevel){
        let test = getSubDirArr("../" + mainDirectory +"/" + firstLevelName)
        console.log(test)
    }



    // console.log(patchesArr)
}
getPatches();

// let testPath = path.join(__dirname, )
// console.log(testPath)
// fs.readdir(testPath,function(err, files){
//     if (err) {
//        return console.error(err);
//     }
//     files.forEach( function (file){
//        console.log( file );
//     });
//  });

module.exports = {
    method: "GET",
    auth: true,
    // root: false,
    // config: config,
    async execute(fastify, request, reply) {
        try {
            // console.log(fs.readdirSync("/questionnaires"))
            fastify.response.All(200, "data", reply)
        }
        catch (error) {
            fastify.response.All(500, "This is very bad =(", reply)
        }
    }
}

// [
//     {
//         era:"эпоха1",
//         surveysArr:
//         [
//             "Опрос1",
//             "Опрос2",
//             "Опрос3"
//         ]
//     }
// ]

questionnaires/
[
    {
        eraPrefix:"1",
        eraName:"Роси империя",
        eraPhoto:"RusEmp.jpg",
        eraDescription:"",
    }
]

questionnaires/1/
[
    {
        surveyPrefix:"1.1",
        surveyName:"Роси империя",
        surveyPhoto:"RusEmp.jpg",
        surveyPercentProgress:"0/1"
    }
]

questionnaires/1/1.1/
[
    {
        question:"",
        image:"",
        overSideImg: "img1",
        questionText: "Текст вопроса",
        answerOptions: [
            {
                text: "Вариант 1",
                score: 1
            },
            {
                text: "Вариант 2",
                score: 0
            },
            {
                text: "Вариант 3",
                score: 0
            }
        ]
        
    }
]




questionnaires/era1/survey1

{
    surveyName:"Роси империя",
    surveyPhoto:"RusEmp.jpg",

    // eraSurveys:
    // [
    //     "survey1",
    //     "survey2",
    //     "survey3"
    // ]
}


{
    eraPrefix:"RussianEmpire",
    eraPhoto:"mainPhoto.jpg",
    eraName:"Российская Империя",
    eraSurveys:
    [
        {
            surveyPrefix:"main.jpg",
            surveyPhoto:"main.jpg",
            surveyName:"Пётр 1"
            surveyQuestions:"questions.js",
            surveyPhoto:[
                "1.jpg",
                "2.jpg"
            ]
        },
        {
            mainPhoto:"main.jpg",
            questions:"questions.js",
            arrPhoto:[
                "1.jpg",
                "2.jpg"
            ]
        },
        {
            mainPhoto:"main.jpg",
            questions:"questions.js",
            arrPhoto:[
                "1.jpg",
                "2.jpg"
            ]
        }
    ]

}