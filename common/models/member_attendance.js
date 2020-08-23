'use strict';

module.exports = function(Memberattendance) {

	const mongodb = require('mongodb');
	const { ObjectID } = mongodb;
	
	Memberattendance.remoteMethod('logAttendance', {
		accepts: [
			{ arg: 'memberId', type: 'string', required: true, http: {"source": "query"} },
			{ arg: 'logType', type: 'number', required: true, http: {"source": "query"} }
		],
		http: { path: '/member/attendancelog', verb: 'put' },
		returns: { arg: 'response', type: Object, root: true },
	});
	
	Memberattendance.logAttendance = async(memberId, logType) => {
		
		const { members } = Memberattendance.app.models;
		const rec = await members.findById(ObjectID(memberId));
		
		const now = new Date();
		
		if(!rec || !rec.isActive) {
			return { message: "Invalid memberId or member not active.", status: 500 };
		}
		
		if(logType === 0) {
			await Memberattendance.create({ memberId, inTime: now, outTime: null });
			await members.upsertWithWhere({ id: ObjectID(memberId) }, { isPresentNow: true });
			return { message: "In-Time marked successfully", status: 200 };
		} else {
			const inRec = await Memberattendance.find({ where: { memberId, outTime: null } });
			if(inRec.length === 0) {
				return { message: "In-Time not recorded", status: 500 };
			}
			await Memberattendance.upsertWithWhere({ id: inRec[0].id }, { outTime: now } );
			await members.upsertWithWhere({ id: ObjectID(memberId) }, { isPresentNow: false });
			return { message: "Out-Time marked successfully", status: 200 };
		}
		
	}
	
	Memberattendance.remoteMethod('getAttendanceDetails', {
		http: { path: '/attendance/details', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});

	Memberattendance.getAttendanceDetails = async() => {
		const rec = await Memberattendance.find({
			include: [{ 
				relation: "members",
				scope: { fields: { id: true, memberId: true, memberName: true } }
			}]
		});
		return rec;
	}
	
	Memberattendance.remoteMethod('getAttendanceDetailsForDate', {
		accepts: [
			{ arg: 'date', type: 'date', required: true, http: {"source": "query"} },
		],
		http: { path: '/attendance/date', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});
	
	Memberattendance.getAttendanceDetailsForDate = async(date) => {
		const start = new Date(date.setHours(0,0,0,0));
		const end = new Date(date.setHours(23,59,59,59));
		const attendanceRec = await Memberattendance.find({
			where: { inTime: { between: [start, end] } },
			include: [{ 
				relation: "members",
				scope: { fields: { id: true, memberId: true, memberName: true } }
			}]
		});
		return attendanceRec;
	}
	
};
