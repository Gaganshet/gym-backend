'use strict';

module.exports = function(Remindermodel) {

	Remindermodel.remoteMethod('testMethod', {
    http: { path: '/method/test', verb: 'get' },
    returns: { arg: 'response', type: Object, root: true },
  });
	
	Remindermodel.testMethod = (callback) => {
		
		const options = {
	    type: 'sms',
	    to: '+919943612776',
	    from: '+919042874550',
	    body: 'THIS IS A SAMPOLE MESSAGE'
		}
		const { text_notifier } = Remindermodel.app.models;
		text_notifier.send(options, callback);
		
		return 1;
		
	}
	
};
