/*
zaa.controller("UploadController", function($scope) {

	$scope.bildId = 0;
	
	$scope.save = function()
	{
		console.log('save', $scope.bildId);
	}
	
})
*/
/*
zaa.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
*/

/*
zaa.directive('storageImageUrl', function() {
	return {
		restrict : 'E',
		scope : {
			image : '@'
		},
		controller : function($scope, $http) {
			$http.get('admin/api-admin-storage/image-path', { params: { imageId : $scope.image } }).success(function(response) {
				$scope.imagesrc = response.source;
				$scope.fileId = response.file_id;
			}).error(function(response) {
			})
		},
		template : function() {
			return '<div>{{imagesrc}} {{fileId}} </div>';
		}
	}
});
*/

/*
zaa.directive('storageFileUpload', function() {
	return {
		restrict : 'E',
		scope : {
			ngModel : '='
		},
		link : function(scope, element, attrs) {
			scope.$watch(function() { return scope.ngModel }, function(n, o) {
				if (n !== o) {
					scope.ngModel = n;
				}
			})
			scope.modal = true;
		},
		controller : function($scope, $http) {
			if ($scope.ngModel) {
				console.log('file_here', $scope.ngModel);
				$http.get('admin/api-admin-storage/file-path', { params: { fileId : $scope.ngModel } }).success(function(response) {
					$scope.filesrc = response.source_http;
				}).error(function(response) {
					console.log('error', response);
				})
			} else {
				console.log('no_file_here!');
			}
			
			$scope.$watch(function() { return $scope.ngModel }, function(newValue, oldValue) {
				if (newValue) {
					$scope.modal = true;
				}
			});
			
			$scope.openModal = function() {
				$scope.modal = !$scope.modal;
			}
		},
		templateUrl : 'storageFileUpload'
	}
});

zaa.directive('storageImageUpload', function() {
	return {
		restrict : 'E',
		scope : {
			ngModel : '=',
		},
		controller : function($scope, $http, ApiAdminFilter) {
			
			if ($scope.filterId == undefined) {
				$scope.filterId = 0;
			}
			
			if ($scope.ngModel) {
				$http.get('admin/api-admin-storage/image-path', { params: { imageId : $scope.ngModel } }).success(function(response) {
					$scope.imagesrc = response.source;
					$scope.fileId = response.file_id;
				}).error(function(response) {
					console.log('error', response);
				})
			}
			
			$scope.filters = ApiAdminFilter.query();
			
			$scope.push2 = function() {
				$http.post('admin/api-admin-storage/image-upload', $.param({ fileId : $scope.fileId, filterId : $scope.filterId }), {
		        	headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		        }).success(function(success) {
		        	if (!success) {
		        		alert('IMAGE UPLOAD ERROR!');
		        	} else {
		        		$scope.ngModel = success.id;
		        		
		        		$scope.imagesrc = success.image.source;
		        		
		        	}
				}).error(function(error) {
					console.log('err', error);
				});
			}
			
		},
		templateUrl : 'storageImageUpload'
	}
});
*/

zaa.directive('storageFileUpload', function($http) {
	return {
		restrict : 'E',
		scope : {
			ngModel : '='
		},
		link : function(scope) {
			
			scope.modal = true;
			scope.fileinfo = null;
			
			scope.select = function(fileId) {
				scope.toggleModal();
				scope.ngModel = fileId;
			}
			
			scope.toggleModal = function() {
				scope.modal = !scope.modal;
			}
			
			scope.$watch(function() { return scope.ngModel }, function(n, o) {
				if (n != 0) {
					$http.get('admin/api-admin-storage/file-path', { params: { fileId : n } }).success(function(response) {
						scope.fileinfo = response;
					}).error(function(response) {
						console.log('error', response);
					})
				}
			});
		},
		templateUrl : 'storageFileUpload'
	}
});

zaa.directive('storageImageUpload', function($http, ApiAdminFilter) {
	return {
		restrict : 'E',
		scope : {
			ngModel : '=',
		},
		link : function(scope) {
			
			scope.fileId = 0;
			scope.filterId = 0;
			scope.imageinfo = null;
			scope.filters = ApiAdminFilter.query();
			
			scope.filterApply = function() {
				if (scope.fileId == 0) {
					alert('Sie müssen zuerst eine Datei auswählen um den Filter anzuwenden.');
					return;
				}
				$http.post('admin/api-admin-storage/image-upload', $.param({ fileId : scope.fileId, filterId : scope.filterId }), {
		        	headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		        }).success(function(success) {
		        	if (!success) {
		        		alert('Beim Anwenden des Filters auf die Datei ist ein Fehler Passiert');
		        		console.log(success);
		        	} else {
		        		scope.ngModel = success.id;
		        	}
				}).error(function(error) {
					alert('Beim Anwenden des Filters auf die Datei ist ein Fehler Passiert');
	        		console.log(error);
				});
			}
			
			scope.$watch(function() { return scope.ngModel }, function(n, o) {
				if (n !== o) {
					if (n !== 0) {
						$http.get('admin/api-admin-storage/image-path', { params: { imageId : n } }).success(function(response) {
							scope.imageinfo = response;
						}).error(function(response) {
							console.log('error', response);
						})
					}
				}
			})
		},
		templateUrl : 'storageImageUpload'
	}
});




/**
 * FILE MANAGER DIR
 */
zaa.directive("storageFileManager", function() {
	return {
		restrict : 'E',
		transclude : false,
		scope : {
			allowSelection : '@selection'
		},
		transclude : false,
		controller : function($scope, $http) {
			
			$scope.uploadurl = 'admin/api-admin-storage/files-upload-flow';
			$scope.bearer = 'Bearer ' + authToken;
			
			$scope.uploader = {};
			
			
			$scope.startUpload = function() {
				$scope.uploader.flow.opts.query = { 'folderId' : $scope.currentFolderId };
				$scope.uploader.flow.upload()
			}
			
			$scope.complete = function() {
				$scope.getFiles($scope.currentFolderId);
			}
			
			$scope.files = [];
			$scope.folders = [];
			$scope.breadcrumbs = [];
			$scope.currentFolderId = 0;
			$scope.selectedFiles = [];
			
			$scope.hasSelection = function() {
				if ($scope.selectedFiles.length > 0) {
					return true;
				}
				
				return false;
			}
			
			$scope.moveFilesTo = function(folder) {
				console.log(folder);
			}
			
			$scope.toggleSelection = function(file) {
				var i = $scope.selectedFiles.indexOf(file.id);
				if (i > -1) {
					$scope.selectedFiles.splice(i, 1);
				} else {
					$scope.selectedFiles.push(file.id);
				}
			}
			
			$scope.inSelection = function(file) {
				response = $scope.selectedFiles.indexOf(file.id);
				
				if (response != -1) {
					return true;
				}
				
				return false;
			}
			
			$scope.createNewFolder = function(newFolderName) {
				$http.post('admin/api-admin-storage/folder-create', $.param({ folderName : newFolderName , parentFolderId : $scope.currentFolderId }), {
		        	headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		        }).success(function(transport) {
		        	if (transport) {
		        		$scope.getFiles($scope.currentFolderId);
		        	}
		        });
			}
			
			$scope.selectFile = function(file) {
				$scope.$parent.select(file.id);
			}
			
			$scope.loadFolder = function(folderId) {
				$scope.currentFolderId = folderId;
				$scope.getFiles(folderId);
			}
			
			$scope.getFiles = function(folderId) {
				$http.get('admin/api-admin-storage/files', { params : { folderId : folderId } }).success(function(response) {
					$scope.folders = response.folders;
					$scope.files = response.files;
					$scope.breadcrumbs = response.breadcrumbs;
				});
			}
			
			$scope.getFiles(0);
		},
		templateUrl : 'storageFileManager'
	}
})