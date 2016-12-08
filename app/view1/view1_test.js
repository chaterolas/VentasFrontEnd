'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should exists', inject(function($controller) {
      var view1Ctrl = $controller('View1Ctrll');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});