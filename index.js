const express = require('express')
const port = 3000
const uuid = require('uuid')

const app = express()
app.use(express.json())

const orders = []

const logRequestInfo = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`)
    next()
}

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex( order => order.id === id )

    if(index < 0){
        return response.status(404).json({message: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.use(logRequestInfo)

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.get('/orders/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex

    const order = orders[index]

    return response.json(order)
})

app.post('/orders', (request, response) => {

    const {order, clientName, price, status} = request.body

    const orderList = {id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(orderList)
    
    return response.status(201).json(orders)
})

app.put('/orders/:id', checkOrderId, (request, response) => {

    const { order, clientName, price, status } = request.body

    const index = request.orderIndex

    const id = request.orderId

    const updatedOrderList = { id, order, clientName, price, status: "Em preparação"}

    orders[index] = updatedOrderList
    
    return response.json(updatedOrderList)
})

app.delete('/orders/:id', checkOrderId, (request, response) => {
   
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.patch('/orders/:id', checkOrderId, (request, response) => {
    
    const index = request.orderIndex
    
    orders[index].status = "Pronto"

    return response.json(orders[index])
})


app.listen(3000, () => {
    console.log(`🚀Server started on port ${port}`)
})