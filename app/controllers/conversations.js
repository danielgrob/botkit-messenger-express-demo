/* eslint-disable brace-style */
/* eslint-disable camelcase */

module.exports = function (controller) {
    var Flickr = require("flickrapi"),
        flickrOptions = {
            api_key: "2f2c9a670cd4aff1722f2fa5969618ca",
            secret: "33170ce46589a0ce"
        };

    // this is triggered when a user clicks the send-to-messenger plugin
    controller.on('facebook_optin', function (bot, message) {
        bot.reply(message, 'Welcome, friend')
    })

    // user said hello
    controller.hears(['hello'], 'message_received', function (bot, message) {
        bot.reply(message, 'Hey there.')
    })

    controller.hears(['.*'], 'message_received', function (bot, message) {
        bot.startConversation(message, function (err, convo) {
            handleActions(convo, message).then(function () {
                    convo.say(message.watsonData.output.text.join('\n'));
                }
            );
        });
    });

    function handleActions(convo, message) {
        let promise = new Promise((resolve, reject) => {
                let action = message.watsonData.output.action;
                if (action) {
                    if (action.hasOwnProperty('call_image')) {
                        handleCallImageAction(message, convo, resolve);
                    } else if (action.hasOwnProperty('call_top_offer')) {
                        handleTopOfferAction(convo, resolve);
                    } else if (action.hasOwnProperty('call_show_products')) {
                        handleShowProductsAction(convo, resolve);
                    } else if (action.hasOwnProperty('call_show_police')) {
                        handleShowPoliceAction(convo, resolve);
                    } else {
                        resolve();
                    }
                }
                else {
                    resolve();
                }
            }
        );

        return promise;

    }

    function handleCallImageAction(message, convo, resolve) {
        Flickr.tokenOnly(flickrOptions, function (error, flickr) {
            flickr.photos.search({
                text: message.watsonData.input.text,
                per_page: 1
            }, function (err, result) {
                if (err) {
                    throw new Error(err);
                }
                let photo = result.photos.photo[0];
                let url = 'https://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg';

                let attachment = {
                    'type': 'template',
                    'payload': {
                        'template_type': 'generic',
                        'elements': [
                            {
                                'title': 'Auto',
                                'image_url': url,
                                'subtitle': 'Ihr Gefährt',
                                'buttons': [
                                    {
                                        'type': 'postback',
                                        'title': 'Versichern',
                                        'payload': 'ja'
                                    }
                                ]
                            }
                        ]
                    }
                };

                convo.say({attachment: attachment});
                resolve();
            });
        });
    }

    function handleTopOfferAction(convo, resolve) {
        let attachment = {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [
                    {
                        'title': 'Vollkasko Paket',
                        'subtitle': 'Das rundum sorglos Paket für CHF 750.-',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Versichern',
                                'payload': 'ja'
                            }
                        ]
                    }
                ]
            }
        };

        convo.say({attachment: attachment});
        resolve();
    }

    function handleShowProductsAction(convo, resolve) {
        let attachment = {
            'type': 'template',
            'payload': {
                'template_type': 'list',
                'top_element_style': 'compact',
                'elements': [
                    {
                        'title': 'Vollkasko Paket',
                        'subtitle': 'Das rundum sorglos Paket für CHF 750.-',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Versichern',
                                'payload': 'vollkasko'
                            }
                        ]
                    },
                    {
                        'title': 'Teilkasko Paket',
                        'subtitle': 'Unser Bestseller für CHF 500.-',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Versichern',
                                'payload': 'teilkasko'
                            }
                        ]
                    },
                    {
                        'title': 'Haftpflicht Paket',
                        'subtitle': 'Das Angebot für unsere Sparfüchse, nur CHF 250.-',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Versichern',
                                'payload': 'haftpflicht'
                            }
                        ]
                    }
                ]
            }
        };

        convo.say({attachment: attachment});
        resolve();
    }

    function handleShowPoliceAction(convo, resolve) {
        let attachment = {
            "type":"file",
            "payload":{
                "url":"https://canoocodecamp.localtunnel.me/MF-Kompass.pdf"
            }
        };

        convo.say({attachment: attachment});
        resolve();
    }

}
