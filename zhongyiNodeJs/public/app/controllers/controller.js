var nodeApp = angular.module('adminApp',[]);

nodeApp.controller('roleController', ['$scope', '$http', function ($scope, $http) {
    $scope.formData={};
    $scope.refresh = function () {
        alert('fuck you everyday !');
    };
    
    $scope.addrole = function () {
        $.modalOpen({
            id: "Form",
            title: "新增角色",
            url: "/backend/role/addrole",
            width: "550px",
            height: "370px",
            btn: null
        });
    };
    $scope.processForm=function(isValid)
    {
      var roleData=
      {
          name:$scope.formData.name
      };
        if(isValid)
        {
            ngPost($http,isValid,"/backend/role/addrole",$scope.formData,function(data){
                //表格刷新
               top.window.location.reload();
            });
        }

    },
    $scope.test1=function()
    {
        window.location="/backend/role/test1/laozhao";
    }
}]);