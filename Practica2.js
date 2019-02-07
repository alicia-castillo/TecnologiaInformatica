const express = require('express')
const app = express()
const port = 3000

/*app.get('/:name', (req, res) => {
    console.log(req.query);
    console.log(req.params);
    res.send(`<h3>Hello ${req.params.name}!</h3>`)
});*/

app.get('/json', (req,res)=>{
    res.json ({'name' : 'Cucho'});
});

app.post('/json',(req,res)=>{
    res.json({'name':'Jelly'});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
