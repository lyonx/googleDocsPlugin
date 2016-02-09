describe('Unit: googleAppsDocPluginContent content app', function () {
  describe('Unit: app', function () {
    beforeEach(module('googleAppsDocPluginContent'));
    var location, route, rootScope;
    beforeEach(inject(function () {

    }));
    var ContentHome, scope, $rootScope, $controller, Buildfire, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, Utils;

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _Utils_) {
      $rootScope = _$rootScope_;
      q = _$q_;
      scope = $rootScope.$new();
      $controller = _$controller_;
      TAG_NAMES = _TAG_NAMES_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      Utils = _Utils_;
      Buildfire = {
        spinner: {
          hide: function () {
            return {}
          },
          show: function () {
            return {}
          }

        }
      };
        ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog'])

    }));

    beforeEach(function () {
      ContentHome = $controller('ContentHomeCtrl', {
        $scope: scope,
        $q: q,
        Buildfire: Buildfire,
        TAG_NAMES: TAG_NAMES,
        ActionItems: ActionItems,
        STATUS_CODE: STATUS_CODE,
        CONTENT_TYPE: CONTENT_TYPE,
        LAYOUTS: LAYOUTS,
        Utils:Utils
      });
    });
    describe('It will test the defined methods', function () {

      it('it should pass if ContentHome is defined', function () {
        expect(ContentHome).not.toBeUndefined();
      });

      it('it should pass if ContentHome.validateUrl is called with success', function () {
        ContentHome.validateUrl();
        var result  = true;
      });

      it('it should pass if ContentHome.validateUrl is called with error', function () {
        ContentHome.custom = 'https://docs.google.com/document/d/1ssHPuiRbE470Y2UWJEDajY-UALH8dyQem5jJxAO9xTg/edit';
        Utils.validateUrl(ContentHome.custom)
        ContentHome.validateUrl();

      });


      it('it should pass if  ContentHome.success is called', function () {
          var result = {};
        ContentHome.saveData(result, TAG_NAMES.GOOGLE_DOC_INFO);
        ContentHome.success(result);
      });

      it('it should pass if  ContentHome.error is called', function () {
        var result = {};
        ContentHome.saveData(result, TAG_NAMES.GOOGLE_DOC_INFO);
        ContentHome.error(result);
      });
      it('it should pass if  ContentHome.clearData is called', function () {
        ContentHome.clearUrl();
      });
      it('it should pass if  ContentHome.init is called', function () {
        ContentHome.init();
        ContentHome.success({data:{content:{}}});
      });
    });
  });
});