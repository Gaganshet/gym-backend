'use strict';

module.exports = function(Trainers) {

	Trainers.remoteMethod('registerTrainer', {
		accepts: { arg: 'inputObject', type: 'object', required: true },
		http: { path: '/trainer/register', verb: 'post' },
		returns: { arg: 'response', type: Object, root: true },
	});

	Trainers.registerTrainer = async(inputObject) => {

		const { trainerName, emailId, phoneNumber, gender, dateOfBirth, age, height, weight, achievements, contactAddress, isFullTime } = inputObject;
		const { trainer_profile } = Trainers.app.models;

		const rec = await Trainers.find({ where: { phoneNumber: { eq: phoneNumber } } });

		if(rec.length > 0) {
			return { message: "Phone number already registered.", status: 500 };
		}

		const existingTrainers = await Trainers.find({ order: "trainerId desc" });
		let newTrainerId = 1;

		if(existingTrainers.length > 0) {
			newTrainerId = parseInt(existingTrainers[0].trainerId) + 1;
		}

		const newTrainerRec = await Trainers.create({ trainerId: newTrainerId, trainerName, emailId, phoneNumber  });
		await trainer_profile.create({ trainerId: newTrainerRec.id, gender, dateOfBirth, age, height, weight, achievements, contactAddress, isFullTime });

		return { message: "Trainer registered successfully.", status: 200 };

	}


	Trainers.remoteMethod('getAllTrainers', {
		http: { path: '/trainer/getAll', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});

	Trainers.getAllActiveTrainers = async() => {
		return await Trainers.find({ 
			order: "isActive desc",
			include: [{
				relation: 'trainerProfiles'
			}]
		});

	}

	Trainers.remoteMethod('searchTrainerByIdOrName', {
		accepts: [
			{ arg: 'idOrName', type: 'string', http: {"source": "query"} } ,
			],
			http: { path: '/trainersearch/idorname', verb: 'get' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Trainers.searchTrainerByIdOrName = async(idOrName) => {
		const isActive = true;
		return await Trainers.find({ 
			where: {
				or: [
					{ trainerId: { eq : idOrName } },
					{ trainerName: { like : idOrName }}
					]
			}
		});
	}

};
