'use strict';
//var urlsource = 'http://192.168.0.29/iprofesionalApp/iprofesional.json';
//var urlsource = 'http://deviprofesional.com/mobile/app/iproapp.php';
//var urlsource = 'http://www.iprofesional.pre.grupovi-da.biz/mobile/app/iproapp.php';
//var urlsource = 'http://deviprofesional.com/api/v1/mobile.php?v=' + Math.random();
var urlsource = 'http://192.168.0.29/iprofesional/service/json/iprofesional.json?v=' + Math.random();
// var urlsource = 'http://deviprofesional.com/service/json/iprofesional.json?v=' + Math.random();
// var urlsource = 'http://www.iprofesional.com/service/json/iprofesional.json?v=' + Math.random();

var iproapp = angular.module('iprofesional', ['ngRoute', 'ngAnimate', 'ngSanitize']);

iproapp.config(['$httpProvider', function($httpProvider) {
	    $httpProvider.defaults.useXDomain = true;
	    delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);


iproapp.service('dataService', ['$http', 'dataFactory', '$q',
	function($http, dataFactory, $q){

	this.load = function() {
		var defer = $q.defer();
        var promise = defer.promise;
        	$http({
				method: 'GET',
	            url: urlsource,
	            headers: {
	               'Content-Type': 'x-www-form-urlencoded'
	            }
			}).then(function(response){
				$('#splashloader img').addClass('ready');
				setTimeout(function(){
					dataFactory.setContent(response);
					defer.resolve(true);
				}, 1000);
			},
			function(response){
				alert(JSON.stringify(response));
			});

        return promise;
	}
}]);

iproapp.controller('appController', 
	['$scope', '$rootScope', '$route', '$routeParams', '$location', 'dataFactory',
	function($scope, $rootScope, $route, $routeParams, $location, dataFactory){
		$scope.$route = $route;
     	$scope.$location = $location;
     	$scope.$routeParams = $routeParams;
     	$scope.start = true;

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
		
		$location.url('/');
	}]
);

iproapp.controller('homeController', 
	['$scope', 'templateService', 'dataFactory', 'dataService',
	function($scope, templateService, dataFactory, dataService){
		$scope.content = false;

		if(dataFactory.status === 500) {
			dataService.load().then(function(response){
				$scope.content = dataFactory.getSeccion('home');
				$scope.divisas = dataFactory.divisas();
				$scope.zoom = dataFactory.zoom();
				$scope.masleidas = dataFactory.masleidas();
			});
		} 
		if(dataFactory.status === 200) {
			$scope.content = dataFactory.getSeccion('home');
			$scope.divisas = dataFactory.divisas();
			$scope.zoom = dataFactory.zoom();
			$scope.masleidas = dataFactory.masleidas();
		}
	}]
);

iproapp.controller('seccionController', 
	['$scope', 'templateService', 'dataFactory', 'dataService', '$routeParams',
	function($scope, templateService, dataFactory, dataService, $routeParams){
		$scope = dataFactory.getScope();
		$scope.$routeParams = $routeParams;
		$scope.content = false;
		if(dataFactory.status === 500) {
			dataService.load().then(function(response){
				$scope.content = dataFactory.getSeccion($routeParams.seccion);
				$scope.divisas = dataFactory.divisas();
				$scope.zoom = dataFactory.zoom();
				$scope.masleidas = dataFactory.masleidas();
			});	
		}
		if(dataFactory.status === 200) {
			$scope.content = dataFactory.getSeccion($routeParams.seccion);
			$scope.divisas = dataFactory.divisas();
			$scope.zoom = dataFactory.zoom();
			$scope.masleidas = dataFactory.masleidas();
		}
	}]
);

iproapp.controller('newsController', 
	['$scope', 'templateService', '$routeParams', '$route', '$location', 'dataFactory',
	function($scope, templateService, $routeParams, $route, $location, dataFactory){
		$scope.noticia = false;
		$scope.noticia = dataFactory.getNota($routeParams.notaId);
		
		setTimeout(function(){
     		$('#loader').loadie(1);
     		$('#loading').hide();
     	}, 1000);

		$scope.share = function() {
			var message = $scope.noticia.titulo;
			var imagen = $scope.noticia.adjuntos.imagen_principal.path;
			var url = $scope.noticia.url;
			
			window.plugins.socialsharing.shareViaFacebook(message, imagen, url, 
				console.log('share ok'), 
				function(errormsg){
					alert(errormsg);
				});
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
			if(scope.row == 7) {
				scope.zoom = dataFactory.zoom();
			}
			element.html(response);
			$compile(element.contents())(scope);
			$('#loader').html('').data('loadie-loaded', 0).loadie(0);
			
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
		if(scope.objeto.tipo === 'nota')
			return templates.noticia_doble;
		if(scope.objeto.tipo === 'slider')
			return templates.slider;
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

iproapp.factory('dataFactory', function($http){
	return {
			$scope: null,
			status: 500,
			data: {

			},
			setScope: function($scope){
				this.$scope = $scope;
			},
			getScope: function(){
				return this.$scope;
			},
			setContent: function(content){
				this.data = content.data;
				this.status = 200;
			},
			getContent: function(){
				return this.data;
			},
			cabezal: function(){
				return this.data.seccion;
			},
			getSeccion: function(nombre){
				var content = {};
				this.data.seccion.forEach(function(seccion){
					if (seccion.nombre == nombre) {
						content = seccion;
						return content;
					}
				});
				return content;
			},
			divisas: function(){
				return this.data.divisas;
			},
			zoom: function(){
				return this.data.zoom;
			},
			masleidas: function(){
				return this.data.masleidas;
			},
			getNota: function(idnoticia) {
				var content = {};
				this.data.noticias.forEach(function(noticia){
					if(noticia.id === idnoticia) {
						content = noticia;
						return content;
					}
				});
				return content;
			}
		};
});