'use strict';

module.exports = function(Trainerattendance) {

	const mongodb = require('mongodb');
	const { ObjectID } = mongodb;
	
	Trainerattendance.remoteMethod('logAttendance', {
		accepts: [
			{ arg: 'trainerId', type: 'string', required: true, http: {"source": "query"} },
			{ arg: 'logType', type: 'number', required: true, http: {"source": "query"} }
		],
		http: { path: '/trainer/attendancelog', verb: 'put' },
		returns: { arg: 'response', type: Object, root: true },
	});
	
	Trainerattendance.logAttendance = async(trainerId, logType) => {
		
		const { trainers } = Trainerattendance.app.models;
		const rec = await trainers.findById(ObjectID(trainerId));
		
		const now = new Date();
		
		if(!rec || !rec.isActive) {
			return { message: "Invalid trainerId or trainer not active", status: 500 };
		}
		
		if(logType === 0) {
			await Trainerattendance.create({ trainerId, inTime: now, outTime: null });
			await trainers.upsertWithWhere({ id: ObjectID(trainerId) }, { isPresentNow: true });
			return { message: "In-Time marked successfully", status: 200 };
		} else {
			const inRec = await Trainerattendance.find({ where: { trainerId, outTime: null } });
			if(inRec.length === 0) {
				return { message: "In-Time not recorded", status: 500 };
			}
			await Trainerattendance.upsertWithWhere({ id: inRec[0].id }, { outTime: now } );
			await trainers.upsertWithWhere({ id: ObjectID(trainerId) }, { isPresentNow: false });
			return { message: "Out-Time marked successfully", status: 200 };
		}
		
	}
	
};
