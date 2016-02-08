//var counter = 0;
iproapp.service('templateService', 
    ['$templateRequest', '$q', function($templateRequest, $q){
    	var scope = null;
    	
    	this.loadtemplate = function(path, index){
    		var defered = $q.defer();
        	var promise = defered.promise;
        	
        	$templateRequest(path).then(function(response){
        		eval('defered.resolve({'+keyviews[index] + ':response})');
        	});

        	return promise;
		}

		this.get = function(path){
    		var defered = $q.defer();
        	var promise = defered.promise;
        	
        	$templateRequest(path).then(function(response){
        		defered.resolve(response);
        	});

        	return promise;
		}
	}]
)