'use strict';

const MailSender = require('../mailing/mailSender');

module.exports = function(Members) {

	const mongodb = require('mongodb');
	const { ObjectID } = mongodb;
	
	Members.remoteMethod('registerMember', {
		accepts: { arg: 'inputObject', type: 'object', required: true },
		http: { path: '/member/register', verb: 'post' },
		returns: { arg: 'response', type: Object, root: true },
	});

	Members.registerMember = async(inputObject) => {

		const { name, packageId, trainerId, subscription, mailId, number } =  inputObject;
		const { gender, dob, age, height, weight, company, occupation, address, medicalConditions, amount, branchId } = inputObject;
		const { member_profile, member_subscription_history, member_enquiry, package_details } = Members.app.models;

		const rec = await Members.find({ where: { phoneNumber: { eq: number } } });

		const startOfSubscription = subscription[0];
		const endOfSubscription = subscription[1];
		
		if(rec.length > 0) {
			return { message: "Phone number already registered.", status: 500 };
		}

		const existingMembers = await Members.find({ order: "memberId desc" });
		let newMemberId = 1;

		if(existingMembers.length > 0) {
			newMemberId = parseInt(existingMembers[0].memberId) + 1;
		}

		const newMemberRec = await Members.create({ memberId: newMemberId, memberName: name, packageId, trainerId, startOfSubscription, endOfSubscription, emailId: mailId, phoneNumber: number, amountPaid: amount, branch_id: branchId  });
		await member_profile.create({ memberId: newMemberRec.id, gender, dateOfBirth: dob['_d	'], age, height, weight, occupation, company, contactAddress: address, medicalConditions });

		await member_subscription_history.create({ memberId: newMemberRec.id, packageId, startOfSubscription, endOfSubscription, trainerId, amountPaid: amount });
		
		await member_enquiry.upsertWithWhere({ phoneNumber: number }, { hasJoined: true });
		
		const packageName = (await package_details.findById(ObjectID(packageId)))['package_name'];
		
		MailSender.sendRegistrationMail({ toMail: mailId, userName: name, memberId: newMemberId, phoneNumber: number, packageName, endOfSubscription });
		
		return { message: "Member registered successfully.", status: 200 };

	}

	/**Members.remoteMethod('getAllMembers', {
		http: { path: '/member/getAll', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});

	Members.getAllMembers = async() => {
		return await Members.find({
			order: "isActive desc",
			include: [{
				relation: 'packageDetails'
			}, {
				relation: 'trainer_member'
			}, {
				relation: 'memberProfiles'
			},{
				relation: 'gymBranch'
			}]
		});
	} */

	Members.remoteMethod('searchMemberByIdOrName', {
		accepts: [
			{ arg: 'idOrName', type: 'string', http: {"source": "query"} } ,
			],
			http: { path: '/membersearch/idorname', verb: 'get' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Members.searchMemberByIdOrName = async(idOrName) => {
		const isActive = true;
		return await Members.find({ 
			where: {
				or: [
					{ memberId: { eq : idOrName } },
					{ memberName: { like : idOrName }}
					]
			},
      include: [{
				relation: 'packageDetails'
			}, {
				relation: 'trainer_member'
			}, {
				relation: 'memberProfiles'
			}]
		});
	}
	
	Members.remoteMethod('updateIsInterested', {
		accepts: [
			{ arg: 'memberId', type: 'string', http: {"source": "query"} },
			{ arg: 'isInterested', type: 'boolean', http: {"source": "query"} }
			],
			http: { path: '/update/isinterested', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Members.updateIsInterested = async(memberId, isInterested) => {
		await Members.upsertWithWhere({ id: ObjectID(memberId) }, { isInterested });
	}
	
	Members.remoteMethod('updateLastNotified', {
		accepts: [
			{ arg: 'memberId', type: 'string', http: {"source": "query"} },
			],
			http: { path: '/update/lastnotified', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Members.updateLastNotified = async(memberId) => {
		await Members.upsertWithWhere({ id: ObjectID(memberId) }, { isNotified: true, lastNotified: new Date() });
	}
	
	Members.remoteMethod('updateRemarks', {
		accepts: [
			{ arg: 'memberId', type: 'string', http: {"source": "query"} },
			{ arg: 'remarks', type: 'string', http: {"source": "query"} },
			],
			http: { path: '/update/remarks', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Members.updateRemarks = async(memberId, remarks) => {
		await Members.upsertWithWhere({ id: ObjectID(memberId) }, { remarks });
	}
	
	Members.remoteMethod('updateMember', {
		accepts: [
			{ arg: 'memberId', type: 'string', http: {"source": "query"} },
			{ arg: 'reqObj', type: 'object' },
			],
			http: { path: '/update/member', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Members.updateMember = async(memberId, reqObj) => {
		const { member_profile } = Members.app.models;
		let newMemberId = reqObj.memberId;
		const memberObj = {
				amountPaid: reqObj.amount,
				memberName: reqObj.name,
				phoneNumber: reqObj.number,
				packageId: reqObj.packageId,
				startOfSubscription: reqObj.subscription[0],
				endOfSubscription: reqObj.subscription[1]
		}
		const memberProfileObj = {
				contactAddress: reqObj.address,
				company: reqObj.company,
				occupation: reqObj.occupation
		}
		await Members.upsertWithWhere({ id: ObjectID(newMemberId) }, memberObj);
		await member_profile.upsertWithWhere({ newMemberId }, memberProfileObj);
		return { message: "Member updated successfully.", status: 200 };
	}

	Members.remoteMethod('getBranchMembers', {
		accepts: { arg: 'branchId', type: 'string', http: {"source": "query"} },
		  http: { path: '/member/getAll', verb: 'get' },
		  returns: { arg: 'response', type: Object, root: true },
	  });
	  
	  Members.getBranchMembers = async(branchId) => {
		
		if(branchId === '' || branchId === undefined) {
		  const branchRec = await Members.app.models.GymBranch.find({ fields: ["id","branch_name"], order: "branch_number asc"});
		  branchId = branchRec[0]['id'];
		}
		
		branchId = ObjectID(branchId);
		
		  return await Members.app.models.members.find({
			where: { branch_id: { eq: branchId }},
			order: "isActive desc",
			include: [{
				relation: 'packageDetails'
			}, {
				relation: 'trainer_member'
			}, {
				relation: 'memberProfiles'
			}]
		  });
	  }
	
	Members.remoteMethod('testMethod', {
		http: { path: '/method/test', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});
	
	Members.testMethod = async() => {
	}

};
