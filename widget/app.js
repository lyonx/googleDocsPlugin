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

        var forwardSlash = '/';

        var appendSuffix = function(url, newSuffix){
          var urlEndsInSuffix = function(url, suffix){
            var forwardSlashLength  = forwardSlash.length;
            var suffixLength = suffix.length;
            var endWithForwardSlash = (url.charAt(url.length - 1) == forwardSlash);
            var fullSuffixLength =  (endWithForwardSlash) ? suffixLength + forwardSlashLength : suffixLength;

            return (url.indexOf(suffix) >= (urlLength - fullSuffixLength));
          };

          var urlLength = url.length;
          var endWithForwardSlash = (url.charAt(url.length - 1) == forwardSlash);

          var hasMobileSuffix = urlEndsInSuffix(url, googleDocsUrlSuffix.mobile);
          var hasPreviewSuffix = urlEndsInSuffix(url, googleDocsUrlSuffix.preview);
          var hasEditSuffix = urlEndsInSuffix(url, googleDocsUrlSuffix.edit);

          //If the URL already ends in the desired suffix, then keep the origin url
          if(urlEndsInSuffix(url, newSuffix)){
            return url;
          }

          //Either update the suffix, or append a new one
          if(hasMobileSuffix){
            return url.replace(googleDocsUrlSuffix.mobile, newSuffix);
          }
          else if(hasPreviewSuffix){
            url = url.replace(googleDocsUrlSuffix.preview, newSuffix);
          }
          else if(hasEditSuffix){
            url = url.replace(googleDocsUrlSuffix.edit, newSuffix);
          }
          else
          {
            //If there are no matching suffixes, append the desired one
            if(endWithForwardSlash){
              url = url + newSuffix;
            }
            else{
              url = url + forwardSlash + newSuffix;
            }
          }

          return url;
        };

        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            if(result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};

              if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview'){
                WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.mobile);
              }
              else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable')){
                WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.edit);
              }
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

            if (WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'preview'){
              WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.mobile);
            }
            else if ((WidgetHome.data.content.mode && WidgetHome.data.content.docUrl && WidgetHome.data.content.mode == 'editable')){
              WidgetHome.data.content.docUrl = appendSuffix(WidgetHome.data.content.docUrl, googleDocsUrlSuffix.edit);
            }
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
