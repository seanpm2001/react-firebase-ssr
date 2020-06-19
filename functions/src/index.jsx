const functions = require('firebase-functions');
// import {Helmet} from "react-helmet";
const React = require('react');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const compression = require('compression');
const { renderToString } = require('react-dom/server');
const App = require('../../src/App').default;

const app = express();
app.use(compression({ threshold: 0 }))
app.use(cors({origin: true}));

const publicFolder = path.resolve(__dirname, './public');

// app.use(express.static('public'))
// app.get('*.*', express.static(publicFolder, { maxAge: '30d' }));
app.use(express.static(publicFolder, { maxAge: '30d' }))

const serverRenderer = (req, res) => {

    console.warn('Version = ' + process.env.VERSION);
    console.info('publicFolder = ' + publicFolder);
    
    const indexHtmlPath = path.join(publicFolder, 'client.html');
    const htmlIndex = fs.readFileSync(indexHtmlPath, 'utf8');

    // res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
    
    const html = renderToString(<App />)
    // console.log('Rendering helmet ...', html);
    // const helmet = Helmet.renderStatic();
    // console.log('Helmet', helmet);
    return res.send(
        htmlIndex.replace(
            '<div id="root"></div>',
            `<div id="root">${html}</div> `
        )
    )
}
app.get('**', serverRenderer)

// const runtimeOpts = {
//     memory: '512MB'
// }
// ssr: functions.runWith(runtimeOpts).https.onRequest(app),
exports.ssr = functions.https.onRequest(app);
exports.listFiles = functions.https.onRequest((req, res) => {
    fs.readdir(publicFolder, (err, files) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            console.log('Files', files);
            res.sendStatus(200);
        }
    });
})
