'use strict';

module.exports = function(Memberenquiry) {

  const mongodb = require('mongodb');
	const { ObjectID } = mongodb;
  
	Memberenquiry.remoteMethod('updateIsInterested', {
		accepts: [
			{ arg: 'enquiryId', type: 'string', http: {"source": "query"} },
			{ arg: 'isInterested', type: 'boolean', http: {"source": "query"} }
			],
			http: { path: '/update/isinterested', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Memberenquiry.updateIsInterested = async(enquiryId, isInterested) => {
		await Memberenquiry.upsertWithWhere({ id: ObjectID(enquiryId) }, { isInterested });
	}
	
	Memberenquiry.remoteMethod('updateLastNotified', {
			accepts: { arg: 'enquiryId', type: 'string', http: {"source": "query"}},
			http: { path: '/update/lastnotified', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Memberenquiry.updateLastNotified = async(enquiryId) => {
		await Memberenquiry.upsertWithWhere({ id: ObjectID(enquiryId) }, { isNotified: true, lastNotified: new Date() });
	}
	
	Memberenquiry.remoteMethod('updateRemarks', {
		accepts: [
			{ arg: 'enquiryId', type: 'string', http: {"source": "query"} },
			{ arg: 'remarks', type: 'string', http: {"source": "query"} },
			],
			http: { path: '/update/remarks', verb: 'put' },
			returns: { arg: 'response', type: Object, root: true },
	});

	Memberenquiry.updateRemarks = async(enquiryId, remarks) => {
		await Memberenquiry.upsertWithWhere({ id: ObjectID(enquiryId) }, { remarks });
	}

	Memberenquiry.remoteMethod('getBranchMembers', {
		accepts: { arg: 'branchId', type: 'string', http: {"source": "query"} },
		  http: { path: '/branch/getmembers', verb: 'get' },
		  returns: { arg: 'response', type: Object, root: true },
	  });
	  
	  Memberenquiry.getBranchMembers = async(branchId) => {
	    console.log('--------',branchId)
	    if(branchId === '' || branchId === undefined) {
	      const branchRec = await Memberenquiry.app.models.GymBranch.find({ fields: ["id","branch_name"], order: "branch_number asc"});
	      branchId = branchRec[0]['id'];
		}
	    
	    branchId = ObjectID(branchId);
	  	return await Memberenquiry.find({ where: { branch_id: { eq: branchId }}} ) ;
		   }
	
};
