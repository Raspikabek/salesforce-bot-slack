"use strict";

let color = "#009cdb";

let formatAccounts = accounts => {

    if (accounts && accounts.length>0) {
        let attachments = [];
        accounts.forEach(account => {
            let fields = [];
            fields.push({title: "Nombre", value: account.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + account.getId(), short:true});
            fields.push({title: "Teléfono", value: account.get("Phone"), short:true});
            fields.push({title: "Dirección", value: account.get("BillingStreet") + ", " + account.get("BillingCity") + " " + account.get("BillingState"), short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "Lo siento, no he encontrado nada."}];
    }

};

let formatContacts = contacts => {

    if (contacts && contacts.length>0) {
        let attachments = [];
        contacts.forEach(contact => {
            let fields = [];
            fields.push({title: "Nombre", value: contact.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
            fields.push({title: "Teléfono", value: contact.get("Phone"), short:true});
            fields.push({title: "Móvil", value: contact.get("MobilePhone"), short:true});
            fields.push({title: "Email", value: contact.get("Email"), short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "Lo siento, no he encontrado nada."}];
    }

};

let formatContact = contact => {

    let fields = [];
    fields.push({title: "Nombre", value: contact.get("FirstName") + " " + contact.get("LastName"), short:true});
    fields.push({title: "Link", value: "https://login.salesforce.com/" + contact.getId(), short:true});
    fields.push({title: "Cargo", value: contact.get("Title"), short:true});
    fields.push({title: "Teléfono", value: contact.get("Phone"), short:true});
    return [{color: color, fields: fields}];

};

let formatOpportunities = opportunities => {

    if (opportunities && opportunities.length>0) {
        let attachments = [];
        opportunities.forEach(opportunity => {
            let fields = [];
            fields.push({title: "Oportunidad", value: opportunity.get("Name"), short:true});
            fields.push({title: "Link", value: "https://login.salesforce.com/" + opportunity.getId(), short:true});
            fields.push({title: "Etapa", value: opportunity.get("StageName"), short:true});
            fields.push({title: "Fecha de Cierre", value: opportunity.get("CloseDate"), short:true});
            fields.push({title: "Importe", value: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(opportunity.get("Amount")), short:true});
            fields.push({title: "Probabilidad", value: opportunity.get("Probability") + "%", short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "Lo siento, no he encontrado nada."}];
    }

};

let formatCase = _case => {

    let fields = [];
    fields.push({title: "Asunto", value: _case.get("subject"), short: true});
    fields.push({title: "Link", value: 'https://login.salesforce.com/' + _case.getid(), short: true});
    fields.push({title: "Descripción", value: _case.get("description"), short: false});
    return [{color: color, fields: fields}];

};

exports.formatAccounts = formatAccounts;
exports.formatContacts = formatContacts;
exports.formatContact = formatContact;
exports.formatOpportunities = formatOpportunities;
exports.formatCase = formatCase;