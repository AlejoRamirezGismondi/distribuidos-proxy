const express = require('express')
const app = express()
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

app.use(cors())
const port = 9898
const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
}
app.get('/geoService', (req, res) => {
    const packageDefinition = protoLoader.loadSync( __dirname + 'protobuf/geo.proto', options);
    const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition);
    new packageObject.GeoService(host + ':' + port, grpc.credentials.createInsecure())
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send('/')
})