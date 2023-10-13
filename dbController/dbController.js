let Mongo = require('mongodb')
let {MongoClient} = require('mongodb')
let mongoUrl = "mongodb+srv://vicky_03:2gBDRqpEelizHMgw@kfc.uh3mvos.mongodb.net/?retryWrites=true&w=majority"
// let mongoUrl = "mongodb://127.0.0.1:27017"
let client = new MongoClient(mongoUrl)




let dbConnect = async () => {
    await client.connect()
}

let db = client.db('zomato')

//get data

let getData = async (colName,query) => {
    let output = [];
    try{
        let cursor = db.collection(colName).find(query)
        for await(const data of cursor){
            output.push(data)
        }
        cursor.closed
    }catch(err){
        output.push({"Error" : "Error in getData"})
    }
    return output;
}

//postData

let postData = async (colName,data) => {
    let output = [];
    try{
        await db.collection(colName).insertOne(data)
        output = {"Response" : "Order Placed"}
    }catch(err){
        output = {"Response" : "Error in postData"}
    }
    return output
}

//updateOrders

let updateOrder = async (colName,condition,data) => {
    let output = [];
    try{
        output = await db.collection(colName).updateOne(condition,data)
    }catch(err){
        output = {"Error" : "Error in UpdateData"}
    }
    return output;
}

//delete order

let deleteOrder = async (colName,condition) => {
    let output = [];
    try{
        output = await db.collection(colName).deleteOne(condition)
    }catch(err){
        output = {"Error" : "Error in deleteData"}
    }
    return output;
}


module.exports = {
    dbConnect,
    getData,
    postData,
    updateOrder,
    deleteOrder
}