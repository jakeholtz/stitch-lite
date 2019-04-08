const stitchLite = angular.module('stitchLite',[]);

stitchLite.controller('ProductsController', ['$scope', '$http', function($scope, $http) {
  
  $scope.products = [];

  $http({ method: 'GET', url: '/products'})
    .then((res) => {
      $scope.products = res.data;
    }, (res, err) => {
      if (err) throw err;
    }
  );

}]);