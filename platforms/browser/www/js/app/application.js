'use strict';
//var servicesource = 'http://www.iprofesional.pre.grupovi-da.biz/service/jsonp/';
var servicesource = 'http://www.iprofesional.com/service/jsonp/';
//var servicesource = 'http://192.168.0.13/iprofesional/service/jsonp/';
var isApi = false;

var app_version = '1.0.7';

var iproapp = angular.module('iprofesional', ['ngRoute', 'ngAnimate', 'ngSanitize']);

iproapp.config(['$httpProvider', function($httpProvider) {
	    $httpProvider.defaults.useXDomain = true;
	    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);

iproapp.service('dataService', ['$http', 'dataFactory', '$q', '$location',
	function($http, dataFactory, $q, $location){

	this.load = function(seccion) {
		var defer = $q.defer();
        var promise = defer.promise;
        var url = (isApi === true ) ? apisource + seccion : servicesource + seccion + '.json';
        url = url + '?v='+versionGenerator();
        var dataType = (isApi === true ) ? 'json' : 'jsonp';
   		
   		$.support.cors = true;

		$.ajax({
			async: true,
			method: 'GET',
			url: url,
			dataType: dataType,
			jsonpCallback: 'get',
			crossDomain: true,
			cache: true,
			contentType: 'application/json; charset=UTF-8',
			success: function(response) {
				if (response.app_version) {
					if (app_version !== response.app_version) {
						$location.url('/update');
					}	
				}
				
				dataFactory.setSeccion(seccion, response);
				defer.resolve(true);
			}
		}).fail(function(response){
			alert(JSON.stringify(response));
			errorMessage('Ocurrió un error al conectarse con el servidor.');
		}).error(function(response){
			alert(JSON.stringify(response));
			//errorMessage('Ocurrió un error al conectarse con el servidor.');
		});

        return promise;
	}
}]);

iproapp.controller('appController', 
	['$scope', '$rootScope', '$route', '$routeParams', '$location', 'dataFactory',
	function($scope, $rootScope, $route, $routeParams, $location, dataFactory){
		$scope.$route 		= $route;
     	$scope.$location 	= $location;
     	$scope.$routeParams = $routeParams;
     	$scope.start 		= true;

     	$('#splashloader img').addClass('ready');

     	setTimeout(function(){
     		if($('#splashloader').is(':visible') === true)	$('#splashloader').hide();
			if($('#loading').is(':visible') === false) 		$('#loading').show();
   		}, 1450);

     	$scope.$on('$routeChangeStart', function (event, next, current) {
			$('#loader').html('').data('loadie-loaded', 0).loadie(0);
			if($scope.start === false) $('#loading').show();
			$scope.start = false;
		});

		$scope.$on('$viewContentLoaded', function(){
  			$(window).scrollTop(0);
		});
		$scope.$on('$locationChangeSuccess', function(a, b,  c, d, e){
			$location.replace(); //clear last history route
		});

		dataFactory.setScope($scope);

		$scope.reload = function() {
			errorOut();
			$route.reload();
		}

		$location.url('/');
	}]
);

iproapp.controller('homeController', 
	['$scope', 'templateService', 'dataFactory', 'dataService', 
	function($scope, templateService, dataFactory, dataService){
		$scope.content = false;

		$scope.load = function() {
			$scope.content 		= dataFactory.getSeccion('home');
			$scope.divisas 		= dataFactory.divisas;
			$scope.zoom 		= dataFactory.zoom;
			$scope.indice 		= dataFactory.indice;
			$scope.masleidas	= dataFactory.masleidas;
		}

		if(dataFactory.status('home') === 404) {
			dataService.load('home').then(function(response){
				$scope.load();
			});
		} 
		if(dataFactory.status('home') === 200) {
			$scope.load();
		}
	}]
);

iproapp.controller('seccionController', 
	['$scope', 'templateService', 'dataFactory', 'dataService', '$routeParams',
	function($scope, templateService, dataFactory, dataService, $routeParams){
		$scope.content = false;

		$scope.load = function() {
			$scope.content 		= dataFactory.getSeccion($routeParams.seccion);
			$scope.zoom 		= dataFactory.zoom;
			$scope.masleidas 	= dataFactory.masleidas;
			$scope.indice 		= dataFactory.indice;
		}

		if(dataFactory.status($routeParams.seccion) === 404) {
			dataService.load($routeParams.seccion).then(function(response){
				$scope.load();
			});
		} 
		if(dataFactory.status($routeParams.seccion) === 200) {
			$scope.load();
		}
	}]
);

iproapp.controller('updateController', 
	['$scope', 'templateService', 'dataFactory', 'dataService', '$routeParams',
	function($scope, templateService, dataFactory, dataService, $routeParams){
		
	}]
);

iproapp.controller('newsController', 
	['$scope', 'templateService', '$routeParams', '$route', '$location', 'dataFactory',
	function($scope, templateService, $routeParams, $route, $location, dataFactory){
		$scope.noticia = false;
		$scope.noticia = dataFactory.getNota($routeParams.notaId);
		$scope.masleidas = dataFactory.masleidas;
		$scope.indice = dataFactory.indice;
		
		setTimeout(function(){
     		$('#loader').loadie(1);
     		$('#loading').hide();
     	}, 1000);

		$scope.share = function(channel) {
			var message = 'iProfesional: ' + $scope.noticia.titulo;
			var imagen = '';
			var url = $scope.noticia.url;
			var short_url = $scope.noticia.short_url;

			if ($scope.noticia.adjuntos.imagen_principal !== false) {
				imagen = $scope.noticia.adjuntos.imagen_principal.path;
			} else if ($scope.noticia.adjuntos.imagenes[0] !== false) {
				imagen = $scope.noticia.adjuntos.imagenes[0].path;
			}

			if (channel === 'facebook') {
				window.plugins.socialsharing.shareViaFacebook(message +' '+short_url, null, url, 
				function(response){
					console.log('share ok' + response);
				},
				function(errormsg){
					console.log(errormsg);
				});
			}
			if (channel === 'twitter') {
				window.plugins.socialsharing.shareViaTwitter(message, imagen, short_url);
			}
			if (channel === 'google') {
				window.plugins.socialsharing.shareVia('com.google.android.apps.plus',
					message + ' ' + short_url, null, imagen, url, 
					function(response){
						console.log('share ok' + response);
					},
					function(errormsg){
						console.log(errormsg);
					}
				);
			}
			if (channel === 'linkedin') {
				window.plugins.socialsharing.shareVia('com.linkedin.android',
					message, null, imagen, url, 
					function(response){
						console.log('share ok' + response);
					},
					function(errormsg){
						console.log(errormsg);
					}
				);
			}
			if (channel === 'whatsapp') {
				window.plugins.socialsharing.shareViaWhatsApp(
					message, imagen, short_url, 
					function() {
						console.log('share ok')
					}, 
					function(errormsg){
						
					}
				);
			}
			if (channel === 'email') {
				window.plugins.socialsharing.shareViaEmail(
				  message + '<br /><a href="' + url + '">Mira la noticia aquí</a>',
				  'iProfesional:' + $scope.noticia.titulo,
				  null,
				  null,
				  null, // BCC: must be null or an array
				  [imagen]
				);
			}
		}
	}]
)

iproapp.directive('rowcontainer', 
	['$compile', 'templateService', 'dataFactory', 
	function($compile, templateService, dataFactory){
	
	var getTemplate = function(scope) {
		if(scope.fila.type === 'noticias')
			return templates.fila;
		if(scope.fila.type === 'autos')
			return templates.autos;
		if(scope.fila.type === 'vinos')
			return templates.vinos;
		if(scope.fila.type === 'recreo')
			return templates.recreo;
		if(scope.fila.type === 'empty')
			return templates.fila;
	}

	var linker = function(scope, element, attrs) {
		templateService.get(getTemplate(scope)).then(function(response){
			if(7 === parseInt(scope.row)) {
				scope.zoom = dataFactory.zoom;
			}
			
			if('recreo' === scope.fila.type) {
				scope.masleidas = dataFactory.masleidas;
			}
			element.html(response);
			$compile(element.contents())(scope);
			//$('#loader').html('').data('loadie-loaded', 0).loadie(0);

			$('#loader').loadie((parseInt($('#loader div').css('width')) + 10) / 100);
			
			if (scope.$parent.$last === true) {
             	slidersStart();
             	setTimeout(function(){
             		$('#loader').loadie(1);
             		$('#loading, #splashloader').hide();
             	}, 1000);
             	setTimeout(function(){
             		var swiper = new Swiper('.swiper-container', {
				        pagination: '.swiper-pagination',
				        slidesPerView: 2,
				        slidesPerColumn: 1,
				        paginationClickable: true,
				        spaceBetween: 30
				    });
             	}, 2000);
            }
		});
	}

	return {
        restrict: 'E',
        link: linker,
        scope: {
            fila: '=info',
            row: '=row'
        }
    };
}]);

iproapp.directive('objeto', 
	['$compile', 'templateService', 'dataFactory', 
	function($compile, templateService, dataFactory){
	
	var getTemplate = function(scope) {
		if('nota' === scope.objeto.tipo)
			return templates.noticia_doble;
		if('slider' === scope.objeto.tipo)
			return templates.slider;
		if('principal' === scope.objeto.tipo)
			return templates.principal;
	}

	var linker = function(scope, element, attrs) {
		templateService.get(getTemplate(scope)).then(function(response){
			element.html(response);
			$compile(element.contents())(scope);
		});
	}

	return {
        restrict: 'E',
        link: linker,
        scope: {
            objeto: '=info'
        }
    };
}]);

iproapp.directive('notaswide', function($compile, templateService){
	var getTemplate = function() {
		return templates.notaswide;
	}

	var linker = function(scope, element, attrs) {
		templateService.get(getTemplate()).then(function(response){
			element.html(response);
			$compile(element.contents())(scope);
		});
	}

	return {
        restrict: 'E',
        link: linker,
        scope: {
            content: '=',
            template: '='
        }
    };
});

iproapp.directive('youtube', function($sce) {
	return {
		restrict: 'EA',
		scope: { code:'=', height: '=h' },
		replace: true,
		template: '<div style="height:{{ height }}px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
		link: function (scope) {
		    scope.$watch('code', function (newVal) {
		       if (newVal) {
		           scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal + '?rel=0&amp;controls=0&amp;showinfo=0');
		       }
		    });
		}
	};
});

iproapp.filter('cloud', function($sce){
	return function(input) {
        if (input) {
            var _html = input.replace(new RegExp('../adjuntos/', 'g'), 'http://719ec77057a57996613a-9a5081423686babcde0c8e2e3662dda4.r0.cf1.rackcdn.com/adjuntos/');
            _html = $sce.trustAsHtml(_html);
			return _html;
        }
    }
});



'use strict';

var errorMessage = function(message) { 
	if($('#splashloader').is(':visible') === true) $('#splashloader').hide();
	if($('#loading').is(':visible') === true) $('#loading').hide();
	$('.error-message p').html(message);
	$('.error-message').addClass('in');
}

var errorOut = function() {
	$('.error-message').removeClass('in');	
}

var versionGenerator = function () {
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDay();
	var hour = date.getHours();
	var minutes_d2 = parseInt(date.getMinutes().toString().substr(-1));
	var minutes_d1 = date.getMinutes().toString().substr(0, 1);
	var minutes  = '';
	
	if (minutes_d2 <= 5 && minutes_d2 !== 0) {
		minutes = minutes_d1.toString().concat('0');
	} else 

	if ((minutes_d2 > 5 && minutes_d2 <= 9) || minutes_d2 === 0) {
		minutes = minutes_d1.toString().concat('5');
	}

	return day.toString().concat(hour.toString()).concat(minutes);
}
'use strict';

var templates = {
	'divisas'		: 'views/divisas.html',
	'fila'			: 'views/fila.html',
	'autos'			: 'views/especiales/autos.html',
	'vinos'			: 'views/especiales/vinos.html',
	'recreo'		: 'views/especiales/recreo.html',
	'principal'		: 'views/objetos/objeto_noticia_full.html',
	'noticia_doble'	: 'views/objetos/noticia_doble.html',
	'slider'		: 'views/objetos/slider.html',
	'youtube'		: 'views/objetos/youtube.html'
}
'use strict';

iproapp.factory('dataFactory', function($http){
	return {
		version: 0,
		$scope: null,
		loaded: [
		],
		secciones: {},
		noticias: {},
		divisas: {},
		masleidas: {},
		zoom: {},
		indice: {},
		status: function(seccion){
			var status = (this.loaded.indexOf(seccion) === -1) ? 404 : 200;
			return status;
		},
		setSeccion: function(seccion, content) {
			if (content.app_version) {
				this.version = content.app_version;
			}

			if (this.status(seccion) === 404) {
				if (content.content.hasOwnProperty('cabezal') === true) {
					 
					$.each(content.content.cabezal.notas, function(index, id){
						content.content.cabezal.notas[index] = eval('content.noticias.id'+id);
					});	
				}
				
				$.each(content.content.filas, function(index, fila){
					if (fila.notas_principales) {
						$.each(fila.notas_principales, function(index, object) {
							if (object.noticias instanceof Object === true) {
								$.each(object.noticias, function(index, id) {
								 	if (content.noticias.hasOwnProperty('id'+id) === true) {
										object.noticias[index] = eval('content.noticias.id'+id);	
									}
								});
							}

							if (object.noticias instanceof Object === false) {
								if (content.noticias.hasOwnProperty('id'+object.noticias) === true) {
									fila.notas_principales[index].noticias = eval('content.noticias.id'+object.noticias);	
								}
							}
						});
					}

					$.each(fila.notas_dobles, function(index, object) {
						if (object.noticias instanceof Object === true) {
							$.each(object.noticias, function(index, id) {
							 	if (content.noticias.hasOwnProperty('id'+id) === true) {
									object.noticias[index] = eval('content.noticias.id'+id);	
								}
							});
						}

						if (object.noticias instanceof Object === false) {
							if (content.noticias.hasOwnProperty('id'+object.noticias) === true) {
								fila.notas_dobles[index].noticias = eval('content.noticias.id'+object.noticias);	
							}
						}
					});

					/* Noticias */
					$.each(fila.noticias, function(index, id) {
						if(content.noticias.hasOwnProperty('id'+id) === true) {
							fila.noticias[index] = eval('content.noticias.id'+id);	
						}
					});
					//content.content.filas[index] = fila;
				});

				if (content.hasOwnProperty('masleidas') === true) {
					$.each(content.masleidas, function(index, id){
						if(content.noticias.hasOwnProperty('id'+id) === true) {
							content.masleidas[index] = eval('content.noticias.id'+id);	
						}
					});
					this.masleidas = content.masleidas;
				}

				if (content.hasOwnProperty('indice') === true) {
					$.each(content.indice, function(index, id){
						if(content.noticias.hasOwnProperty('id'+id) === true) {
							content.indice[index] = eval('content.noticias.id'+id);	
						}
					});
					this.indice = content.indice;
				}

				if (content.hasOwnProperty('zoom') === true) {
					$.each(content.zoom, function(index, id){
						if(content.noticias.hasOwnProperty('id'+id) === true) {
							content.zoom[index] = eval('content.noticias.id'+id);	
						}
					});
					this.zoom = content.zoom;
				}

				eval('this.secciones.'+seccion+' = content.content;');
				this.loaded.push(seccion);
				this.noticias = $.extend(this.noticias, content.noticias);

				if (content.hasOwnProperty('divisas') === true) {
					this.divisas = content.divisas;
				}
			}
		},
		getSeccion: function(seccion) {
			return eval('this.secciones.'+seccion+';');
		},
		getNota: function(idnoticia) {
			var content = {};
			if(this.noticias.hasOwnProperty('id'+idnoticia) === true) {
				content = eval('this.noticias.id'+idnoticia);	
			}
			return content;
		},
		setScope: function($scope){
			this.$scope = $scope;
		},
		getScope: function(){
			return this.$scope;
		}
	};
});
iproapp.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {

    
    // $locationProvider.html5Mode({
    //         'enable': true,
    //         'requireBase': false,
    //         'rewriteLinks': false,
    //     });
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController'
      }).
      when('/seccion/:seccion', {
        templateUrl: 'views/seccion.html',
        controller: 'seccionController'
      }).
      when('/home', {
        templateUrl: 'views/home.html',
        controller: 'homeController'
      }).
      when('/nota/:notaId/:titulo', {
        templateUrl: 'views/noticia.html',
        controller: 'newsController'
      }).
      when('/update', {
        templateUrl: 'views/update.html',
        controller: 'updateController'
      }).
      otherwise({
        redirectTo: '/'
      });
      
      $locationProvider.html5Mode(false);
}]);
//'use strict';
/*
var share = function (text, imagen, channel) {
	alert('vamos a compartir esta cosa!');
}
*/
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