'use strict';

module.exports = function(server) {
	
	const defaultPackages = [
		{
			package_name: "Monthly Package",
			package_period_in_months: 1,
			package_cost: 1500,
			description: "Monthly package"
		}, {
			package_name: "Quarterly Package",
			package_period_in_months: 2,
			package_cost: 3500,
			description: "Quarterly package"
		}, {
			package_name: "Halfyearly Package",
			package_period_in_months: 6,
			package_cost: 6500,
			description: "Halfyearly package"
		}, {
			package_name: "Annual Package",
			package_period_in_months: 12,
			package_cost: 9000,
			description: "Annual package"
		}
	]
	
	const defaultUser = {
	    username : "Admin",
	    password : "admin@123",
	    email_id : "admin@gmail.com",
      	email : "admin@gmail.com",
	    phone_number : "9865320147"
	};
	
	const defaultGymLocations = [{
		branch_number: 1,
		branch_name: "THORAIPAKKAM",
		branch_address: "THORAIPAKKAM"
	},{
		branch_number: 2,
		branch_name: "PADUR",
		branch_address: "PADUR"
	}];
	
	insertPackages();
	insertAdminUser();
	insertDefaultGymBranches();
	
	async function insertPackages() {
		const existingPackages = await server.models.package_details.find({});
		if(existingPackages.length === 0) {
			defaultPackages.forEach(async(pack) => await server.models.package_details.create(pack));
      console.log('PACKAGES INSERTED');
		}
	}
	
	async function insertAdminUser() {
		const existingUsers = await server.models.User.find({});
		const userNames = existingUsers.map(user => user.username);
		if(userNames.indexOf('Admin') !== 0) {
			await server.models.User.create(defaultUser);
			console.log('DEFAULT USER INSERTED!');
		}
	}
	
	async function insertDefaultGymBranches() {
		const existingBranches = await server.models.GymBranch.find({});
		if(existingBranches.length === 0) {
			await server.models.GymBranch.create(defaultGymLocations);
			console.log('DEFAULT BRANCH INSERTED!!');
		}
	}
	
};
