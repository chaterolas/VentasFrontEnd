'use strict';

// TODO: meter en varios archivos
angular.module('myApp.ventas', [])

  .constant('base_url', 'http://localhost:3333/api/ventas')
  
  .service('URLSerivice', ['base_url', function(base_url) {
    var serv = this;

    serv.normal = function() {
      return base_url;
    };

    serv.conParametro = function(id) {
      return base_url + "/" + id;
    };
  }])
  
  .value('productos', [])
  
  .service('ProductoModel', ['productos', 'URLSerivice', '$http', '$q', '$log', 
    function(productos, URLSerivice, $http, $q, $log) {
    var serv = this;

    serv.lista = function() {
      var deferred = $q.defer();
      
      if(productos.length!=0) {
        deferred.resolve(productos);
      }
      else {
        $http.get(URLSerivice.normal())
          .success(function(data, status, headers, config) {
            if(data.success) {
              data.ventas.forEach(function(elem) {
                productos.push(elem);
              });
              deferred.resolve(productos);
            }
          })
          .error(deferred.reject);
      }
      
      return deferred.promise;
    };

    serv.cuenta = function() {
      return productos.length;
    };

    serv.agrega = function(producto) {
      var deferred = $q.defer();

      $http.post(URLSerivice.normal(), producto)
        .success(function(data, status, headers, config) {
          if(data.success) {
            producto._id = data.venta_id;
            productos.push( producto );  
          }
          deferred.resolve(data);
        })
        .error(deferred.reject);

      return deferred.promise;
    };

    serv.edita = function(producto) {
      var deferred = $q.defer();

      $http.put(URLSerivice.conParametro(producto._id), producto)
        .success(function(data, status, headers, config) {
          if(data.success) {
            for(var i=0; i<productos.length; i++) {
              if(productos[i]._id  == producto._id) {
                productos[i] = producto;
              }
            }
          }
          deferred.resolve(data);
        })
        .error(deferred.reject);

      return deferred.promise;
    };

    serv.elimina = function(producto) {
      var deferred = $q.defer();

      $http.delete(URLSerivice.conParametro(producto._id))
        .success(function(data, status, headers, config) {
          if(data.success) {
            productos.remove(function(elem) {
              return elem._id == producto._id;
            }); 
          }
          deferred.resolve(data);
        })
        .error(deferred.reject);

      return deferred.promise;
    };
  }])

  .filter('matches', function() {
    return function(array, attr, str) {
      var regex = new RegExp(str);
      return array.filter(function(elem) {
          return regex.test(elem[attr]);
        });
    };
  })

  .directive('ventaDiv', function() {
    var _controller = function(scope) {

    };

    var _link = function(scope, elem, attrs) {

    };

    return {
      restrict: "E",
      replace: true,
      // TODO: meter en una archivo aparte
      template: 
        '<div class="col-md-4" style="height: 250px; margin-bottom: 10px;">' +
          '<div class="panel panel-default" >' +
            '<div class="panel-heading selectable" ng-click="ventasCtrl.seleccionaEditable(p)">' +
              '<h3 class="panel-title">{{p.producto}}</h3>' +
            '</div>' +
            '<div class="panel-body">' +
              '<strong>Identificador:</strong> <span>{{p._id}}</span> <br/>' +
              '<strong>Tamaño:</strong> <span>{{p.tamano}}</span> <br/>' +
              '<strong>Cantidad:</strong> <span>{{p.cantidad}}</span> <br/>' +
              '<strong>Tienda:</strong> <span>{{p.tienda}}</span> <br/>' +
              '<strong>Precio:</strong> <span>{{p.precio | currency}}</span> <br/>' +
              '<div>' + 
                '<button ng-click="ventasCtrl.eliminaProducto(p)" class="btn btn-danger pull-right">' +
                  'Eliminar' + 
                '</button>'+
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
    };
  })

  .controller('VentasCtrl', ['$log', 'ProductoModel', function($log, productoModel) {
    var ctrl = this;
    ctrl.formularioVisible = false;
    ctrl.dirOrden = '+producto';
    ctrl.ventas = [];
    ctrl.tamanos = [
        {value: 'chico', text: 'Chico'}, 
        {value: 'mediano', text: 'Mediano'}, 
        {value: 'grande', text: 'Grande'}
      ];

    // Control sobre elementos del formulario
    ctrl.isFormularioVisible = function() {
      return ctrl.formularioVisible;
    };

    ctrl.reiniciaFormulario = function() {
      ctrl.producto = {};
      ctrl.ventasForm.$setPristine();
      ctrl.ventasForm.$setUntouched();
      ctrl.ocultaFormulario();
    };

    ctrl.muestraFormulario = function() {
      ctrl.formularioVisible = true;
    };

    ctrl.ocultaFormulario = function() {
      ctrl.formularioVisible = false;
    };

    ctrl.invierteOrden = function() {
      ctrl.dirOrden = ctrl.dirOrden=='+producto' ? '-producto' : '+producto';
    };

    ctrl.direccionOrden = function() {
      return ctrl.dirOrden;
    };

    ctrl.showMessages = function(control) {
      return ctrl.ventasForm[control].$touched
              && ctrl.ventasForm[control].$invalid;
    };

    ctrl.seleccionaEditable = function(producto) {
      ctrl.producto = angular.copy(producto);
      ctrl.muestraFormulario();
    };

    // Modelos
    ctrl.listaProductos = function() {
      productoModel.lista().then(function(result) {
          ctrl.ventas = result;
        });
    };

    ctrl.cuentaProductos = function() {
      return productoModel.cuenta();
    };

    ctrl.agregaProducto = function(producto) {
      productoModel.agrega( angular.copy(producto) )
        .then(function(data) {
          ctrl.listaProductos();  
          ctrl.reiniciaFormulario();
        });
    };

    ctrl.editarProducto = function(producto) {
      $log.debug( producto );
      productoModel.edita( angular.copy(producto) )
        .then(function(data) {
          ctrl.listaProductos();  
          ctrl.reiniciaFormulario();
        });
    }

    ctrl.eliminaProducto = function(producto) {
      productoModel.elimina(producto)
        .then(function(data) {
          ctrl.listaProductos(); 
          ctrl.reiniciaFormulario();
        });
    };


    ctrl.listaProductos();
  }]);