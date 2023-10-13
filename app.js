let express = require('express')
let app = express()
let port = process.env.PORT || 4545;
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./dbController/dbController')
let bodyParser = require('body-parser')
let cors = require('cors')
let Mongo = require('mongodb')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})) 
app.use(cors())

app.get('/',(req,res) => {
    res.send('Zomato API')
})

//get all location

app.get('/location', async (req,res) => {
    let query = {}
    let collection = "location"
    let output = await getData(collection,query)
    res.send(output)
})

//get all mealType

app.get('/mealType', async (req,res) => {
    let query = {}
    let collection = "mealType"
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/restaurants', async (req,res) => {
    let query = {}
    let stateId = Number(req.query.stateId);
    let mealId = Number(req.query.mealId);
    if(stateId){
        query = {state_id : stateId}
    }else if(mealId){
        query = {"mealTypes.mealtype_id" : mealId}
    }else{
        query = {}
    }
    let collection = "restData"
    let output = await getData(collection,query)
    res.send(output)
})


app.get('/filter/:mealId', async (req,res) => {
    let mealId = Number(req.params.mealId);
    let cuisineId = Number(req.query.cuisineId);
    let hCost = Number(req.query.hCost);
    let lCost = Number(req.query.lCost);
    if(cuisineId){
        query = {
            "mealTypes.mealtype_id" : mealId,
            "cuisines.cuisine_id" : cuisineId
        }
    }else if(hCost && lCost){
        query = {
            "mealTypes.mealtype_id" : mealId,
            $and:[{cost:{$gt:hCost,$lt:lCost}}]
        }
    }else{
        query = {}
    }
    let collection = 'restData'
    let output = await getData(collection,query)
    res.send(output)
})

// details page

app.get('/details/:id', async (req,res) => {
    let id = Number(req.params.id);
    let query  = {restaurant_id : id}
    let collection = "restData"
    let output = await getData(collection,query)
    res.send(output)
})

//get menu

app.get('/menu/:id', async (req,res) => {
    let id = Number(req.params.id)
    let query = {restaurant_id : id}
    let collection = "restMenu"
    let output = await getData(collection,query)
    res.send(output)
})

//all orders

app.get('/orders', async(req,res) => {
    let query = {}
    let emailId = req.query.emailId;
    if(emailId){
        query = {email:emailId}
    }else{
        query = {}
    }
    let collection = "orders"
    let output = await getData(collection,query)
    res.send(output)
})

//placeOrder

app.post('/placeOrders', async (req,res) => {
    let query = req.body;
    let collection = "orders"
    let output = await postData(collection,query)
    res.send(output)
})

//menuDetails

app.post("/menuDetails", async (req,res) => {
    let query = {}
    if(Array.isArray(req.body.id)){
        query = {menu_id : {$in : req.body.id}}
    }else{
        res.send('Please Pass data in array format')
    }
    let collection = 'restMenu'
    let output = await getData(collection,query)
    res.send(output)
})

//updateOrder

app.put('/updateOrder', async (req,res) => {
    let collection = 'orders'
    let condition = { "_id" : new Mongo.ObjectId(req.body._id)}
    let data = {
        $set : {
            "status" : req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

//delete Order

app.delete('/deleteOrder', async(req,res) => {
    let collection = 'orders'
    let condition = {"_id" : new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})

app.listen(port, (err) => {
    dbConnect()
    if(err) throw err;
    console.log(`The server is running on port no ${port}`);
})