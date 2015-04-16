describe('$componentLoader', function () {
  var elt,
      $compile,
      $rootScope,
      $router,
      $templateCache,
      $controllerProvider,
      $componentLoaderProvider;

  beforeEach(function() {
    module('ng');
    module('ngNewRouter');
  });

  it('should convert a component name to a controller name', inject(function ($componentLoader) {
    expect($componentLoader.controllerName('foo')).toBe('FooController');
  }));

  it('should convert a controller name to a component name', inject(function ($componentLoader) {
    expect($componentLoader.component('FooController')).toBe('foo');
  }));

  it('should convert a component name to a template URL', inject(function ($componentLoader) {
    expect($componentLoader.template('foo')).toBe('./components/foo/foo.html');
  }));

  it('should work with a controller constructor fn and a template url', function () {
    var names = {};
    module(function($componentLoaderProvider) {
      $componentLoaderProvider.setCtrlNameMapping(function (name) {
        return names[name].controller;
      });
      $componentLoaderProvider.setTemplateMapping(function (name) {
        return names[name].templateUrl;
      });
      $componentLoaderProvider.setCtrlAsMapping(function (name) {
        return 'ctrl';
      });
    });

    names.myComponent = {
      controller: Ctrl,
      templateUrl: '/foo'
    };

    inject(function(_$compile_, _$rootScope_, _$router_, _$templateCache_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $router = _$router_;
      $templateCache = _$templateCache_;
    });

    $templateCache.put('/foo', [200, '{{ctrl.message}}', {}]);
    function Ctrl() {
      this.message = 'howdy';
    };

    compile('<ng-viewport></ng-viewport>');

    $router.config([
      { path: '/', component: 'myComponent' }
    ]);

    $router.navigate('/');
    $rootScope.$digest();

    expect(elt.text()).toBe('howdy');
  });

  function compile(template) {
    elt = $compile('<div>' + template + '</div>')($rootScope);
    $rootScope.$digest();
    return elt;
  }
});
