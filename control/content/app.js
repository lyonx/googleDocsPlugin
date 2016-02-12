'use strict';

(function (angular, buildfire) {
  angular.module('googleAppsDocPluginContent', ['ui.bootstrap'])
    .controller('ContentHomeCtrl', ['$scope', 'Buildfire', 'STATUS_CODE', 'TAG_NAMES', 'DataStore', 'Utils', '$timeout',
      function ($scope, Buildfire, STATUS_CODE, TAG_NAMES, DataStore, Utils, $timeout) {
        var ContentHome = this;
        ContentHome.validUrl = false;
        ContentHome.inValidUrl = false;

        ContentHome.data = {
          content: {
            "docUrl": ""
          }
        };

        ContentHome.saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          ContentHome.success = function (result) {
            console.info('Saved data result: ', result);
          };
          ContentHome.error = function (err) {
            console.error('Error while saving data : ', err);
          };
          DataStore.save(newObj, tag).then(ContentHome.success, ContentHome.error);
        };

        ContentHome.validateUrl = function () {
          ContentHome.data.content.docUrl = ContentHome.docUrl;
          if (Utils.validateUrl(ContentHome.docUrl)) {
            ContentHome.data.content.docUrl=Utils.formatUrl(ContentHome.docUrl);
            ContentHome.validUrl = true;
            $timeout(function () {
              ContentHome.validUrl = false;
            }, 3000);
            ContentHome.inValidUrl = false;
            ContentHome.saveData(ContentHome.data, TAG_NAMES.GOOGLE_DOC_INFO);
          } else {
            ContentHome.inValidUrl = true;
            $timeout(function () {
              ContentHome.inValidUrl = false;
            }, 3000);
            ContentHome.validUrl = false;
          }
        };

        ContentHome.clearUrl = function () {
          if (!ContentHome.docUrl) {
            ContentHome.data.content.docUrl = null;
            ContentHome.saveData(ContentHome.data, TAG_NAMES.GOOGLE_DOC_INFO);
          }
        };

        /*
         * Go pull any previously saved data
         * */
        ContentHome.init = function () {
          ContentHome.success = function (result) {
              console.info('init success result:', result);
              if (Object.keys(result.data).length > 0) {
                ContentHome.data = result.data;
              }
              if (ContentHome.data) {
                if (!ContentHome.data.content)
                  ContentHome.data.content = {};
                if (ContentHome.data.content.docUrl)
                  ContentHome.docUrl = ContentHome.data.content.docUrl;
              }
            }
          ContentHome.error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
              }
              else if (err && err.code === STATUS_CODE.NOT_FOUND) {
                ContentHome.saveData(JSON.parse(angular.toJson(ContentHome.data)), TAG_NAMES.GOOGLE_DOC_INFO);
              }
            };
          DataStore.get(TAG_NAMES.GOOGLE_DOC_INFO).then(ContentHome.success, ContentHome.error);
        };
        ContentHome.init();
      }
    ])
})(window.angular, window.buildfire);