'use strict';

describe('routerComponent', function() {

  var elt,
      ctrlRouter,
      $compile,
      $rootScope,
      $templateCache;

  beforeEach(function() {
    module('ngFuturisticRouter');

    module(function($controllerProvider) {
      $controllerProvider.register('UserController', UserController);
      $controllerProvider.register('RouterController', function($scope, router) {
        ctrlRouter = router;
      });
    });

    inject(function(_$compile_, _$rootScope_, _$templateCache_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $templateCache = _$templateCache_;
    });
  });

  it('should work', inject(function() {
    put('user', '<div>hello {{name}}, {{user.name}}</div>');
    compile('<router-component component-name="user"></router-component>');

    expect(elt.text()).toBe('hello Brian, Controller');
  }));


  it('should get the root router instance if it has no children', inject(function(router) {
    put('router', '<div></div>');
    compile('<router-component component-name="router"></router-component>');

    expect(ctrlRouter).toBe(router);
  }));


  it('should get the root router instance if it has children', inject(function(router) {
    put('router', '<div router-view-port></div>');
    compile('<router-component component-name="router"></router-component>');

    expect(ctrlRouter).toBe(router);
  }));

  function put(name, template) {
    $templateCache.put(componentTemplatePath(name), [200, template, {}]);
    $rootScope.$digest();
  }

  function compile(template) {
    elt = $compile('<div>' + template + '</div>')($rootScope);
    $rootScope.$digest();
    return elt;
  }
});


describe('routerComponent animations', function() {

  var elt,
      ctrlRouter,
      $animate,
      $compile,
      $rootScope,
      $controllerProvider,
      $templateCache;

  beforeEach(function() {
    module('ngAnimate');
    module('ngAnimateMock');
    module('ngFuturisticRouter');

    module(function($controllerProvider) {
      $controllerProvider.register('UserController', UserController);
    });

    inject(function(_$compile_, _$rootScope_, _$templateCache_, _$animate_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $templateCache = _$templateCache_;
      $animate = _$animate_;
    });
  });

  afterEach(function() {
    expect($animate.queue).toEqual([]);
  });

  it('should have an enter hook', function() {
    var item;

    put('user', '<div>hello {{name}}, {{user.name}}</div>');
    compile('<router-component component-name="user"></router-component>');

    item = $animate.queue.shift();
    expect(item.event).toBe('enter');

    expect(elt.text()).toBe('hello Brian, Controller');
  });

  function put(name, template) {
    $templateCache.put(componentTemplatePath(name), [200, template, {}]);
    $rootScope.$digest();
  }

  function compile(template) {
    elt = $compile('<div>' + template + '</div>')($rootScope);
    $rootScope.$digest();
    return elt;
  }
});

function UserController($scope) {
  $scope.name = 'Brian';
  this.name = 'Controller';
}

function componentTemplatePath(name) {
  return './components/' + dashCase(name) + '/' + dashCase(name) + '.html';
}

function dashCase(str) {
  return str.replace(/([A-Z])/g, function ($1) {
    return '-' + $1.toLowerCase();
  });
}
