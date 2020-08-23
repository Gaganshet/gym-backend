'use strict';

module.exports = function(Textnotifier) {

	const cronScheduler = require('node-cron');
	
	const outLogSchedule = cronScheduler.schedule('0 30 21 * * *', async() => {
		
		const { members, member_attendance } = Textnotifier.app.models;
		const now = new Date();
		
		const expiredRec = await members.find({ where: { endOfSubscription: { lt: now } } });
		
		expiredRec.forEach(async(rec) => {
			await members.upsertWithWhere({ id: rec.id }, { isActive: false });
		});
		
		const outMembersList = await members.find({ isPresentNow: true });
		
		outMembersList.forEach(async(member) => {
			await members.upsertWithWhere({ id: member.id }, { isPresentNow: false });
			await member_attendance.upsertWithWhere({ memberId: member.id }, { outTime: now });
		});
		
	});
	
	outLogSchedule.start();
	
};
