'use strict';

(function (angular, buildfire) {
  angular.module('googleAppsDocPluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {
        buildfire.datastore.disableRefresh();
        var WidgetHome = this;
        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content)
              WidgetHome.data.content = {};
            if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview')
              WidgetHome.data.content.docUrl = WidgetHome.data.content.docUrl.replace('/edit', '/mobilebasic');
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable'))
              WidgetHome.data.content.docUrl = WidgetHome.data.content.docUrl.replace('/mobilebasic', '/edit');
            console.log(">>>>>", WidgetHome.data);
          };
          WidgetHome.error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
          DataStore.get(TAG_NAMES.GOOGLE_DOC_INFO).then(WidgetHome.success, WidgetHome.error);
        };

        WidgetHome.onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.GOOGLE_DOC_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data && !WidgetHome.data.content)
              WidgetHome.data.content = {};
            if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview')
              WidgetHome.data.content.docUrl = WidgetHome.data.content.docUrl.replace('/edit', '/mobilebasic');
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable'))
              WidgetHome.data.content.docUrl = WidgetHome.data.content.docUrl.replace('/mobilebasic', '/edit');
          }
        };

        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);
        WidgetHome.init();

      }])
    .filter('returnUrl', ['$sce', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url);
      }
    }]);
})(window.angular, window.buildfire);
