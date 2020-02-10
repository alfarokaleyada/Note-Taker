console.log("start")// test

const path = require('path'); // require path
const express = require("express") // require express
const fs = require('fs').promises;
const app = express() // run express
const port = 3000 // set the port
const shortid = require('shortid');

const bodyParser = require ('body-parser')
const dbFilePath = path.resolve(__dirname,'db','db.json')


        app.use(express.static('public')) // javaScript directory named public

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
        extended:true
        }) )


        // create home route
        app.get('/', (req, res) => {
            const filePath = path.resolve(__dirname,'public','index.html')
            res.sendFile(filePath);
            console.log("test");

        }),

        // create notes route
        app.get('/notes', (req, res) => {
            const filePath = path.resolve(__dirname,'public','notes.html')
            res.sendFile(filePath);
            console.log("test");

        }),

        // get notes 
        app.get('/api/notes', async (req, res) => {
            const fileDate = await fs.readFile(dbFilePath, 'utf-8')
            const data = JSON.parse(fileDate);
            res.json(data);    

        }),

        // post notes
        app.post('/api/notes', async (req, res) => {

            const {title, text} = req.body;

            const fileDate = await fs.readFile(dbFilePath, 'utf-8')
            const data = JSON.parse(fileDate);

            // push  and create id
            data.push({
                id: shortid.generate(),
                title,
                text
            })

            // wait until write the filre to 
            await fs.writeFile(dbFilePath, JSON.stringify(data))

            res.json({
                success : true
            });   

        }),

        // delete notes 
        app.delete('/api/notes/:id', async (req, res) => {
        
            const noteId = req.params.id;

            const fileDate = await fs.readFile(dbFilePath, 'utf-8')
            const data = JSON.parse(fileDate);

            const newData = data.filter(node => node.id != noteId);
            await fs.writeFile(dbFilePath, JSON.stringify(newData)); 

            res.json({
                success : true
            });  
        }),




        // create route to home from unknow
        app.use('*', (req, res) => {
        res.redirect('/');
        }),


    // listen to port
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    });