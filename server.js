"use strict";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

let Botkit = require('botkit'),
    formatter = require('./modules/slack-formatter'),
    salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
        token: SLACK_BOT_TOKEN
    });

bot.startRTM(err => {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});


controller.hears(['ayuda', 'ayudame', 'ayudarme'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `Puedes preguntarme cosas como:
    "Busca la cuenta Acme" o "Busca Acme en cuentas"
    "Busca a Lisa Smith" o "Busca Lisa Smith en contactos"
    "Busca la oportunidad Renovación"
    "Crea un contacto"
    "Crea un caso"`
    });
});


controller.hears(['busca la cuenta (.*)', 'busca (.*) en cuentas'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findAccount(name)
        .then(accounts => bot.reply(message, {
            text: "He encontrado esta/s cuenta/s que coinciden con '" + name + "':",
            attachments: formatter.formatAccounts(accounts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['busca a (.*)', 'Busca (.*) en contactos'], 'direct_message,direct_mention,mention', (bot, message) => {
    let name = message.match[1];
    salesforce.findContact(name)
        .then(contacts => bot.reply(message, {
            text: "He encontrado est@/s contacto/s que coinciden con '" + name + "':",
            attachments: formatter.formatContacts(contacts)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['top (.*) deals', 'top (.*) opportunities'], 'direct_message,direct_mention,mention', (bot, message) => {
    let count = message.match[1];
    salesforce.getTopOpportunities(count)
        .then(opportunities => bot.reply(message, {
            text: "Here are your top " + count + " opportunities:",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['busca la oportunidad (.*)', 'encuentra la oportunidad (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {

    let name = message.match[1];
    salesforce.findOpportunity(name)
        .then(opportunities => bot.reply(message, {
            text: "He encontrado la/s siguiente/s oportunidades que coinciden con '" + name + "':",
            attachments: formatter.formatOpportunities(opportunities)
        }))
        .catch(error => bot.reply(message, error));

});

controller.hears(['crear caso', 'nuevo caso'], 'direct_message,direct_mention,mention', (bot, message) => {

    let subject,
        description;

    let askSubject = (response, convo) => {

        convo.ask("¿Cual es el Asunto?", (response, convo) => {
            subject = response.text;
            askDescription(response, convo);
            convo.next();
        });

    };

    let askDescription = (response, convo) => {

        convo.ask('Introduce la descripción del caso', (response, convo) => {
            description = response.text;
            salesforce.createCase({subject: subject, description: description})
                .then(_case => {
                    bot.reply(message, {
                        text: "He creado el siguiente caso:",
                        attachments: formatter.formatCase(_case)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, creo que puedo ayudarte con eso!");
    bot.startConversation(message, askSubject);

});

controller.hears(['crear contacto', 'nuevo contacto', 'crear un contacto'], 'direct_message,direct_mention,mention', (bot, message) => {

    let firstName,
        lastName,
        title,
        phone;

    let askFirstName = (response, convo) => {

        convo.ask("¿Cual es su nombre? (solo nombre)", (response, convo) => {
            firstName = response.text;
            askLastName(response, convo);
            convo.next();
        });

    };

    let askLastName = (response, convo) => {

        convo.ask("¿Y sus Apellidos?", (response, convo) => {
            lastName = response.text;
            askTitle(response, convo);
            convo.next();
        });

    };

    let askTitle = (response, convo) => {

        convo.ask("¿Cual es su cargo?", (response, convo) => {
            title = response.text;
            askPhone(response, convo);
            convo.next();
        });

    };

    let askPhone = (response, convo) => {

        convo.ask("¿Y su número de teléfono?", (response, convo) => {
            phone = response.text;
            salesforce.createContact({firstName: firstName, lastName: lastName, title: title, phone: phone})
                .then(contact => {
                    bot.reply(message, {
                        text: "Perfecto! He creado el contacto:",
                        attachments: formatter.formatContact(contact)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "OK, creo que puedo ayudarte con eso!");
    bot.startConversation(message, askFirstName);

});