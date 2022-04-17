const express = require('express');
// const mongoose = require('mongoose');
const mysql = require('mysql');
const util = require('util');

const app = express();

app.use(express.json());

const {WebhookClient} = require('dialogflow-fulfillment');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'test123',
    database: 'bitbot'
})

connection.connect(function(err) {
    if (err) throw err;
    
    
    
});

const query = util.promisify(connection.query).bind(connection);

function getStudentMarks(usn,subject){

    let sql = `select * from studentMarks where usn = "${usn}"`;
    let msg = "random";
    (async () => {

        try{
            const rows = await query(sql);
            console.log(rows);
            
            msg = `marks if ${rows[0]['marks']}`;

            
            
        }
        catch{
            connection.end();
        }

    })()

    return Promise.resolve(msg);

}

marks = [
    {usn:"1bi18cs027",sub:"18p26",marks:91}
]

function getStudentMarksHandler(agent){
    console.log(agent.parameters)
    let usn = agent.parameters["usn"];
    let subject = agent.parameters["subjectcode"];
    let msg = "no result";

    let sql = `select * from studentMarks where usn = "${usn}"`;
    connection.query(sql,function(err,result){
        if(err) throw err;
        
        msg = `marks of ${usn} for ${subject} is ${result[0]['marks']}`;

        console.log(msg)

        agent.add(msg);

        return ;
        

    })
    .catch(function (err){
        console.log("error",err);
    })

    // agent.add(msg);
    // 
    // msg = `marks of ${usn} for ${subject} is ${marks[0]['marks']}`;

    // agent.add(msg);
    
}




function getCollegeFee(agent){
    // console.log(agent.intent);
    // console.log(agent.payload);

    

    let year = agent.parameters["year"]
    console.log(year)
    let fee = collegeFee[year]
    let msg = `college fee for ${year} is ${fee}`
    agent.add(msg)

}

function getExamFee(agent){
    return examFee["all"];
}

app.post('/', function(req, res) {
    // console.log("hello world")
    let agent = new WebhookClient({request:req, 
    response:res})

    let intentMap = new Map();

    // intentMap.set('college_fee',getCollegeFee)
    intentMap.set('studentMarks',getStudentMarksHandler);

    agent.handleRequest(intentMap)

})

app.get('/',(request, response) => {

    response.sendFile('views/index.html', {root: __dirname })



});

app.listen(33333,(err) => {
        if (err) throw err;
})

