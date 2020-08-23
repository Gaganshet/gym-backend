'use-strict';

const fileSystem = require('fs');
const server = require('../../server/server');

module.exports = class MailSender {

	static async sendRegistrationMail(mailOptions) {

		try {
			const subject = "Registration Successful - 24x7 Fitness Studio";
			const from = "24x7 Fitness Studio <>";

			const { toMail, userName, memberId, phoneNumber, packageName, endOfSubscription } = mailOptions;

			const templatePath = 'common\\mailtemplates\\registration';

			let text = "";
			let html = "";

			fileSystem.readFile(templatePath + '.txt', 'UTF8', async(err, text) => {
				if (err) text = "";
				fileSystem.readFile(templatePath + '.html', 'UTF8', async(err, html) => {
					if (err) html = "";

					text = text.replace(/\[userName\]/g, userName)
					.replace(/\[memberId\]/g, memberId)
					.replace(/\[phoneNumber\]/g, phoneNumber)
					.replace(/\[packageName\]/g, packageName)
					.replace(/\[endOfSubscription\]/g, endOfSubscription);

					html = html.replace(/\[userName\]/g, userName)
					.replace(/\[memberId\]/g, memberId)
					.replace(/\[phoneNumber\]/g, phoneNumber)
					.replace(/\[packageName\]/g, packageName)
					.replace(/\[endOfSubscription\]/g, endOfSubscription);

					await server.models.MailModel.send({
						to: toMail, from, subject, text, html
					}, function(err, mail) {
						if(err)  console.log(`Registration Mail to the user ${toMail} sending failed`);
						else {
							console.log(`Registration Mail to the user ${toMail} sent successfully`);
						}
					}.bind(this));

				});
			});
		} catch(error) {
			console.log(`Error sending registration mail ${error}`);
		}
	}

	static async sendExpirationMail(toMail, userName, endOfSubscription) {
		try {
			const subject = "Expiration Reminder - 24x7 Fitness Studio";
			const from = "24x7 Fitness Studio <>";

			const { toMail, userName, endOfSubscription } = mailOptions;

			const templatePath = 'common\\mailtemplates\\expiryNotification';

			let text = "";
			let html = "";

			fileSystem.readFile(templatePath + '.txt', 'UTF8', async(err, text) => {
				if (err) text = "";
				fileSystem.readFile(templatePath + '.html', 'UTF8', async(err, html) => {
					if (err) html = "";

					text = text.replace(/\[userName\]/g, userName)
					.replace(/\[endOfSubscription\]/g, endOfSubscription);

					html = html.replace(/\[userName\]/g, userName)
					.replace(/\[endOfSubscription\]/g, endOfSubscription);

					await server.models.MailModel.send({
						to, from, subject, text, html
					}, function(err, mail) {
						if(err)  console.log(`Expiration Mail to the user ${toMail} sending failed`);
						else {
							console.log(`Expiration Mail to the user ${toMail} sent successfully`);
						}
					}.bind(this));

				});
			});
		} catch(error) {
			console.log(`Error sending expiration mail ${error}`);
		}
	}

}