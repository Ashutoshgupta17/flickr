import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';

angular.module('angularFlickrSearch', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'wu.masonry'
  ])
  .config(config)
  .config(routerConfig)
  .run(runBlock)

  .controller('MainController', MainController)

