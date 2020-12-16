const express =require('express');
const ejs=require('ejs');//template engine
const bodyParser =require('body-parser');
const http=require('http');
const container =require('./container');
const cookieParser =require('cookie-parser');
const validator=require('express-validator');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const passport=require('passport');



container.resolve(function(users){

	mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://localhost/footballkik',{useMongoClient:true});

	const app =SetupExpress();
	function SetupExpress()
	{
		const app=express();
		const server=http.createServer(app);
		server.listen(3000,function(){
			console.log('Listening on port 3000');
		});
		ConfigureExpress(app);
		//Setup router
		const router=require('express-promise-router')();
		users.SetRouting(router);

		app.use(router);
	}

		function ConfigureExpress(app){

			require('./passport/passport-local');

			app.use(express.static('public'));
			app.use(cookieParser());
			app.set('view engine','ejs');
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: true}));

			//app.use(validator);
			app.use(session({
				secret:'thisisasecretkey',
				resave:true,
				saveInitialized:true,
				store: new MongoStore({mongooseConnection:mongoose.connection})
			}));
			app.use(flash());

			app.use(passport.initialize());
			app.use(passport.session());
		}
});