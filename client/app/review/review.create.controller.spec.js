'use strict';

describe('Controller: ReviewCtrlCreate', function () {

  // load the controller's module

  beforeEach(module('pitchPerfectApp'));

  var ReviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReviewCtrl = $controller('ReviewCtrl', {
      $scope: scope
    });
  }));

  // *TODO: Failing phantom.js test, as it cannot find where Popcorn is defined.
  // it('should ...', function () {
  //   expect(1).toEqual(1);
  // });

});
