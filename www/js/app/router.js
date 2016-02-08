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
      otherwise({
        redirectTo: '/'
      });
      
      $locationProvider.html5Mode(false);
}]);