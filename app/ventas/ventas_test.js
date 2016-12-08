'use strict';

describe('myApp.ventas module', function() {

  beforeEach(module('myApp.ventas'));

  describe('vetas controller', function(){

    it('should contain a controller', inject(function($controller) {
      var ventasCtrl = $controller('VentasCtrl');

      expect(ventasCtrl).toBeDefined();
    }));

  });
});