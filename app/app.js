'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMessages',
  'myApp.ventas',
  'myApp.view1',
  'myApp.view2',
  'myApp.version' 
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider
    .when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    })
    .when('/ventas', {
      templateUrl: 'ventas/ventas.html',
      controller: 'VentasCtrl as ventasCtrl'
    })
    .otherwise({
      redirectTo: '/view1'
    });

    // Extend array prototype
    Sugar.Array.extend();
}]);
