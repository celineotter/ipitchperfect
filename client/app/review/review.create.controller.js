'use strict';
/*globals Popcorn */

angular.module('pitchPerfectApp')
  .controller('ReviewCtrlCreate', function($scope, $state, $sce, ReviewFactory) {

    var reviewContext = ReviewFactory.reviewContext;

    console.log('review context COMING IN is  ', reviewContext);


    if (!reviewContext.targetResponseId){
      console.log('no target response, going home');
      $state.go('home');
    }

    $scope.url = '';

    // When the response is retrieved form the service, it will
    // use this function to update $scope elements
    var setDataCallback = function(url, qTitle) {

      $scope.question = qTitle;
      // This is required by Angular to allow resources from other domains
      //  In our case, the video hosted on Azure
      var trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      $scope.url = trustSrc(url);

      // Attempt to auto play video after load.  Not working.
      var myVideo = document.getElementById('video-response');
      myVideo.play();

    };

    ReviewFactory.getResponseData(reviewContext.targetResponseId, setDataCallback);
    console.log('review context AFTER SERVICE CALL is  ', reviewContext);

    // Popcorn is lib for video features
    var popcorn = new Popcorn('#video-response');
    popcorn.play();

    $scope.allAnnotations = [];

    $scope.stagedAnnotation = {};

    $scope.saveReview = function() {

      console.log('reviewContext IN SAVE is ', ReviewFactory.reviewContext);

      // Assemble pertinent data for the new Review Object
      var createReviewData = {
        _id: reviewContext._id,
        annotations: $scope.allAnnotations,
        //responseId: reviewContext.responseObj._id,
        questionId: reviewContext.questionObj._id,
        //responseCreatorId: reviewContext.responseObj.userId,
        videoId: reviewContext.responseObj.videoId,
        userDeckId: reviewContext.responseObj.userDeckId,
        complete: true
      };
      // Create the Review
      console.log('createReviewData object is ', createReviewData);

      ReviewFactory.saveReview(createReviewData);
      $state.go('home');

    };

    //  Captures playhead timeline at time of annotation
    $scope.addAnnotation = function() {
      popcorn.pause();
      $scope.stagedAnnotation.timelineActual = popcorn.currentTime();
    };

    // Collect the annotation, clear the text entry field
    $scope.saveAnnotation = function(annotationText) {
      $scope.stagedAnnotation.description = annotationText;

      $scope.allAnnotations.push($scope.stagedAnnotation);
      $scope.stagedAnnotation = {};
      $scope.annotationText = '';
      $('#annotationText').blur();
      popcorn.play();
    };

    // Set the palyhead timeline to that of the annotation
    $scope.playAnnotation = function(timelinePosition) {
      popcorn.pause();
      popcorn.currentTime(timelinePosition);
      popcorn.play();

    };

  });
