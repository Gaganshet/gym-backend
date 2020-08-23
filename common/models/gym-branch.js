'use strict';

module.exports = function(GymBranch) {

  const mongodb = require('mongodb');
  const { ObjectID } = mongodb;
  
  GymBranch.remoteMethod('loadBranchCombo', {
    http: { path: '/branches/load', verb: 'get' },
    returns: { arg: 'response', type: Object, root: true },
  });
  
  GymBranch.loadBranchCombo = async() => {
    return await GymBranch.find({ fields: ["id","branch_name", "branch_number"], order: "branch_number asc"});
  }
  
	GymBranch.remoteMethod('getBranchMembers', {
	  accepts: { arg: 'branchId', type: 'string', http: {"source": "query"} },
		http: { path: '/branch/getmembers', verb: 'get' },
		returns: { arg: 'response', type: Object, root: true },
	});
	
	GymBranch.getBranchMembers = async(branchId) => {
	  
	  if(branchId === '' || branchId === undefined) {
	    const branchRec = await GymBranch.find({ fields: ["id","branch_name"], order: "branch_number asc"});
	    branchId = branchRec[0]['id'];
	  }
	  
	  branchId = ObjectID(branchId);
	  
		return await GymBranch.app.models.members.find({
		  where: { branch_id: { eq: branchId }},
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
	}
	
};
