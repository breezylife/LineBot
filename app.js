const config = require("config");
const express = require("express");
const request = require("request");
const mysql = require("mysql");
const line = require('@line/bot-sdk');
const fs = require('fs');

const app = express();
const port = process.env.PORT || process.env.port || 5000;
const client = new line.Client({
    channelAccessToken: '/TttIEJ4FOor43GuTWT+DHCmf5GvaD2M+cw5xs6jmkVEVm4YBwxt9HkczTNCFJ5nhx+KcKrCqzrgVEdZ2Kj80m+efdLETju4j6H7yGkzhR6FF00dML6GVUvWJI4rA9hmOwWFFllNrR88+4BLb4EmbQdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'cab961e9a8ecebd3d3a03dd33f9243ba'
});

app.set('port', port);
app.use(express.json());
app.use(express.static('public'));

app.post("/webhook", async function (req, res) {
    //line richmenu
    const obj = {
        "size": {
            "width": 2500,
            "height": 1686
        },
        "selected": false,
        "name": "Nice richmenu",
        "chatBarText": "Tap to open",
        "areas": [
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 2500,
                    "height": 1686
                },
                "action": {
                    "type": "uri",
                    "uri": "https://www.youtube.com/watch?v=8MG--WuNW1Y&ab_channel=%E9%9F%8B%E7%A6%AE%E5%AE%89WeiBird"
                }
            }
        ]
    };
    let richMenuId = ''

    await client.createRichMenu(obj)
        .then((id) => {
            richMenuId = id
        })
        .catch(err => console.error(err))

    await client.setRichMenuImage(richMenuId, fs.createReadStream('./public/img/richmenu.png'))
        .then(res => console.log(res))

    await client.linkRichMenuToUser(req.body.events[0].source.userId, richMenuId)
        .then(() => client.setDefaultRichMenu(richMenuId))
        .catch(err => console.error(err))

    await client.setDefaultRichMenu(richMenuId)


    //mysql
    const conn = new mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'line',
        port: 3306,
    });

    if (req.body.events[0].type === "follow") {

        conn.connect(
            function (err) {
                if (err) {
                    console.log("!!! Cannot connect !!! Error:");
                    throw err;
                }
                else {
                    console.log("Connection established.");
                    conn.query('SELECT * FROM LINEUSER WHERE userId=?', [req.body.events[0].source.userId],
                        function (err, results, fields) {
                            if (err) throw err;
                            else {
                                // console.log(req.body.events[0].source.userId, req.body.events[0].replyToken, req.body.events[0].timestamp)
                                if (results.length === 0) {
                                    conn.query('INSERT INTO LINEUSER (userId, replyToken, timestamp) VALUES (?,?,?);', [req.body.events[0].source.userId, req.body.events[0].replyToken, req.body.events[0].timestamp],
                                        function (err, results, fields) {
                                            if (err) throw err;
                                            console.log('Inserted ' + results.affectedRows + ' row(s).');
                                        })
                                }
                            }
                            // console.log('Done.');
                        })
                }
            });
    }
    // console.log(req.body)
})

app.post("/receipt", async function (req, res) {
    await client.pushMessage('Uf394168a8e6bfbcafd55325b12301327', {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
            "type": "bubble",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "RECEIPT",
                        "weight": "bold",
                        "color": "#1DB446",
                        "size": "sm"
                    },
                    {
                        "type": "text",
                        "text": "Brown Store",
                        "weight": "bold",
                        "size": "xxl",
                        "margin": "md"
                    },
                    {
                        "type": "text",
                        "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                        "size": "xs",
                        "color": "#aaaaaa",
                        "wrap": true
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "xxl",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Energy Drink",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": "$2.99",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Chewing Gum",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": "$0.99",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "Bottled Water",
                                        "size": "sm",
                                        "color": "#555555",
                                        "flex": 0
                                    },
                                    {
                                        "type": "text",
                                        "text": "$3.33",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "margin": "xxl",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "ITEMS",
                                        "size": "sm",
                                        "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                        "text": "3",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "TOTAL",
                                        "size": "sm",
                                        "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                        "text": "$7.31",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "CASH",
                                        "size": "sm",
                                        "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                        "text": "$8.0",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "CHANGE",
                                        "size": "sm",
                                        "color": "#555555"
                                    },
                                    {
                                        "type": "text",
                                        "text": "$0.69",
                                        "size": "sm",
                                        "color": "#111111",
                                        "align": "end"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "margin": "md",
                        "contents": [
                            {
                                "type": "text",
                                "text": "PAYMENT ID",
                                "size": "xs",
                                "color": "#aaaaaa",
                                "flex": 0
                            },
                            {
                                "type": "text",
                                "text": "#743289384279",
                                "color": "#aaaaaa",
                                "size": "xs",
                                "align": "end"
                            }
                        ]
                    }
                ]
            },
            "styles": {
                "footer": {
                    "separator": true
                }
            }
        }
    })
        .then(() => {
            console.log("success")
        })
        .catch((err) => {
            // error handling
            console.log(err)
        });
})

app.post("/createRichMenu", async function (req, res) {

})

app.listen(app.get('port'), function () {
    console.log('[app.listen]Node app is running on port', app.get('port'));
});

