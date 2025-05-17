// require('dotenv').config();
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const MongoStore = require('connect-mongo');
// const app = express();

// const mongodb_host = process.env.MONGODB_HOST;
// const mongodb_user = process.env.MONGODB_USER;
// const mongodb_password = process.env.MONGODB_PASSWORD;
// const mongodb_database = process.env.MONGODB_DATABASE;
// const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
// const node_session_secret = process.env.NODE_SESSION_SECRET;

// app.use(express.static('public'));

// var {database} = include('databaseConnection');
// const imageCollection = database.db(mongodb_database).collection('image');

// app.use(express.urlencoded({extended: false}));

// var mongoStore = MongoStore.create({
// 	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
// 	crypto: {
// 		secret: mongodb_session_secret
// 	}
// })
// /*
// app.use(session({ 
//     secret: node_session_secret,
//     store: mongoStore, //default is memory store 
//     saveUninitialized: false, 
//     resave: true
// }
// ));
// */
// const testCreateImage = async (req, res) => {
//     if (!req.file) {
//         return res.send('There is no file.');
//     }
//     const imagePath = `/images/${req.file.filename}`;
//     await imageCollection.insertOne({image: imagePath});
//     res.redirect("/test/testSelectImage");
// }

// const testSelectImage = async (req, res) => {
//     const images = await imageCollection.find().toArray(); // DB에서 전부 가져오기
//     res.render('pages/testSelectImage', { images });
    
// };

// module.exports = {testCreateImage, testSelectImage};