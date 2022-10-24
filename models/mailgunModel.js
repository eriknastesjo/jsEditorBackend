const mailgun = require("mailgun-js");

require('dotenv').config();

const mailgunModel = {
    send: function send(res, req) {

        const apiKey = process.env.MG_API_KEY ?? "apiKeyIsMissing";
        const domain = process.env.MG_DOMAIN ?? "domainIsMissing";

        const mg = mailgun({ apiKey: apiKey, domain: domain });

        const { recipient, subject, text } = req;

        const data = {
            from: "Erik's editor <eriknastesjo@hotmail.com>",
            to: `${recipient}`,
            subject: `${subject}`,
            text: `${text}`
        };

        mg.messages().send(data, function (error, body) {
            if (error) {
                return res.status(400).json ({
                    status: 400,
                    message: "Error, email was not sent."
                });
            }

            console.log(body);

            return res.status(201).json({
                status: 201,
                message: "Email succesfully sent."
            });
        });
    }
};

module.exports = mailgunModel;



