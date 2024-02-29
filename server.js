const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname +'/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

function rando(){
    return Math.round(Math.random()*4 + 1);
}

hbs.registerHelper('error404', function(){
    //random number between 20 and 50
    var num = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    var classes = ['still', 'rotate', 'shrink']; //possible classes

    var html = '';

    for(let i = 0; i < num; i++){
        var classNum = Math.floor(Math.random()*classes.length);
        var randomClass = classes[classNum]; 

        html += `<div class="${randomClass}">404</div>`;
    }
    return new hbs.handlebars.SafeString(html);
});


hbs.registerHelper('ptag',(num, messagePassedIn)=>{
    var msg = '';
    for(let i=0; i<num; i++)
    {
        msg+=`<p>${messagePassedIn}</p>`;
    }

    return new hbs.handlebars.SafeString(msg);
});

//app.use(dateLogger);

function dateLogger(req,res,next)
{
    let date = new Date();
    console.log(date);
    req.date = date;
    next();
} 

app.get('/',dateLogger,(req, res)=>{
    console.log(req.body);
})

app.get('/form',(req, res)=>{
    res.render('form.hbs');
})

app.post('/results',(req,res)=>{
    res.render('results.hbs',{
        numberFromForm:req.body.textNumber
    })
})


app.use((req, res, next)=>{
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.render('error.hbs', {
        message:`${error.status} ${error.message}`,
        num:rando()
    });
})

// app.get('*', (req,res)=>{
//     res.render("error.hbs");
// })

app.use((req,res)=>{
    res.status(404).sendFile(__dirname + `/views/error.hbs`)
})

app.listen(3000, ()=>{
    console.log('Server is running on Port 3000');
})

