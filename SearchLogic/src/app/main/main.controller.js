export class MainController {
  constructor ($scope, $log, $http) {
    'ngInject';

    this.scope = $scope;
    this.log = $log;
    this.http = $http;

    this.items = [];
  }

  search() {

    var self = this;

    self.items = [];

    var searchTerm = this.searchTerm;
    self.log.debug('searchTerm:' + searchTerm);

    const internalServerErrorItem = {
      'title': 'Opps, an error occurred with Flickr web service: 502',
      'author': 'System administrator',
      'link': 'javascript:;',
      'media': { 'm': '' },
      'tags': [
        {value: 'error', isSearchTerm: false},
        {value: '502', isSearchTerm: true}
      ]
    };

    if ( searchTerm.length < 3 ) { return; }

    const searchTerms = searchTerm.split(' ');
    const formattedSearchTerms = searchTerms.join(',');

    self.loading = true;

    self.http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK', {
      params: { format: 'json', tagmode: 'all', tags: formattedSearchTerms }
    }).success(function(feed){

      var items = [];

      try {
        if (feed.items.length > 0) {

          items = feed.items;

          angular.forEach(items, function(item) {
            var strTags = item.tags;
            var splitedTags = strTags.split(' ');

            item.tags = splitedTags.map(function(strTag){
              return { value: strTag, isSearchTerm: searchTerms.indexOf(strTag) >= 0 ? true : false };
            });
          });

        } else {
          items = [{
            'title': 'Opps, your search for ' + searchTerm + ' returned no results',
            'author': 'System administrator',
            'link': 'javascript:;',
            'media': { 'm': '' },
            'tags': [{value:'no-results', isSearchTerm: true}]
          }];
        }

      }
      catch(exception) {
        items = [internalServerErrorItem];
      }
      finally{
          self.scope.$broadcast('masonry.reload');
      }

      self.items = items;

    }).error(function(data, status) {
        self.log.error('error: ' + status + 'data: ' + data);

        self.items = [internalServerErrorItem];

    }).finally(function () {
      self.loading = false;
    });
  }
}
