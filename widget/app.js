'use strict';

(function (angular, buildfire) {
  angular.module('googleAppsDocPluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {

        var WidgetHome = this;
        /*
         * Fetch user's data from datastore
         */

          //Refresh list of bookmarks on pulling the tile bar
          buildfire.datastore.onRefresh(function () {
              WidgetHome.init();
          });

        var googleDocsUrlSuffix = {
          mobile: 'mobilebasic',
          preview: 'preview',
          edit: 'edit'
        };

        var appendSuffix = function(url, suffix){
          var forwardSlash = '/';
          var forwardSlashLength  = forwardSlash.length;
          var suffixLength = suffix.length;
          var urlLength = url.length;
          var endWithForwardSlash = (url.charAt(url.length - 1) == forwardSlash);
          var fullSuffixLength =  (endWithForwardSlash) ? suffixLength + forwardSlashLength : suffixLength;

          //If the URL already ends in the suffix, then exit
          if(url.indexOf(suffix) >= (urlLength - fullSuffixLength)){
            return url;
          }

          //If no suffix is included, append one
          if(url.indexOf(googleDocsUrlSuffix.mobile) == -1 &&
              url.indexOf(googleDocsUrlSuffix.preview) == -1 &&
              url.indexOf(googleDocsUrlSuffix.edit) == -1)
          {
            if(endWithForwardSlash){
              url = url + suffix;
            }
            else{
              url = url + forwardSlash + suffix;
            }

            return url;
          }else {
            //If a suffix exists, then replace it
            //TODO: Be smarter and find the specific index
            url = url.replace(googleDocsUrlSuffix.mobile, suffix);
            url = url.replace(googleDocsUrlSuffix.preview, suffix);
            url = url.replace(googleDocsUrlSuffix.edit, suffix);

            return url;
          }
        };

        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            if(result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};

              console.warn('before', WidgetHome.data.content.docUrl);
              if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview'){
                WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.preview);
              }
              else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable')){
                WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.edit);
              }
              console.warn('after', WidgetHome.data.content.docUrl);

              console.log(">>>>>", WidgetHome.data);
            }else
            {
              WidgetHome.data = {
                content: {}
              };
              var dummyData = {url: "https://docs.google.com/document/d/1SqWeU4ewzXQBpR98TYGiBZ_iPdQH92wOb7jT0y-_Cbc/pub"};
              WidgetHome.data.content.docUrl = dummyData.url;
            }
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

            console.warn('before', WidgetHome.data.content.docUrl);
            if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview'){
              WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.preview);
            }
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable')){
              WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.edit);
            }
            console.warn('after', WidgetHome.data.content.docUrl);

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
