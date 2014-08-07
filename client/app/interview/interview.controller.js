'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl', function ($scope, $window, $interval, InterviewFactory, $http, $resource) {

    $scope.message = 'Hello';

    $scope.startPrompt = false;
    $scope.startInterview = false;
    $scope.finishVideo = false;
    $scope.processInterview = false;
    $scope.reviewInterview = false;
    $scope.scriptingInterview = '';
    $scope.instructions = false;

    $scope.title = InterviewFactory.contextObject.title;
    $scope.description = InterviewFactory.contextObject.description;
    $scope.questions = InterviewFactory.questionObj;

    $scope.getClassResponse = function getClass(id) {
      if (InterviewFactory.contextObject.questionsResponded[id]) {
        return {'list-group-item-success': true};
      } else {
        return { 'list-group-item': true};
      }
    };

    $scope.getClassReview = function getClass(id) {
      if (InterviewFactory.contextObject.responsesReviewed[id]) {
        return {'list-group-item-success': true};
      } else {
        return { 'list-group-item': true};
      }
    };

    $scope.questionSelected = function (question) {
      console.log('question selected', question);
    };

    $scope.startStopWatch = function () {
      $scope.sec = 0;
      $scope.min = 0;
      $interval(function(){
        if ($scope.sec === 59) {
          $scope.sec = 0;
          $scope.min = $scope.min + 1;
          return;
        }
        $scope.sec++;
        if ($scope.sec < 10) {
          $scope.sec = '0'+ $scope.sec;
        }
      },1000,0);

    };

    $scope.changePromptStatus = function () {
      $scope.startPrompt = !$scope.startPrompt;
    };

    $scope.changeFinishVideoStatus = function () {
      $scope.finishVideo = !$scope.finishVideo;
    };

    $scope.changeInterviewStatus = function () {
      // $scope.scriptingInterview = '';
      $scope.instructions = false;
      $scope.startInterview = !$scope.startInterview;
      if ($scope.startInterview) {
        $scope.startStopWatch();
      }
    };

    $scope.changeProcessInterviewStatus = function () {
      $scope.processInterview = !$scope.processInterview;
    };

    $scope.synchReviewInterview = function () {
      $scope.reviewInterview = !$scope.reviewInterview;
    };

    $scope.changeItemStatus = function (item) {
      $scope[item] = !$scope[item];
    };

    $scope.getPreviousResponse = function () {
      var response = InterviewFactory.retrieveResponse();
      console.log(response);
    };

    $scope.getQuestion = function (questionId, i) {
      console.log('getThisQuestion:', questionId);
      var getQuestions = $resource('/api/questions/:id/', {
        id: '@_id'
      },
      {
        get: {
          method: 'GET',
          params: {
            id: questionId
          }
        }
      });

      getQuestions.get({}, function(question) {
        console.log('question received @home', question);
        InterviewFactory.questionObj[i] = question;
        console.log('questions collection', InterviewFactory.questionObj[i]);
      }, function(err) {
        console.log('question err:', err);
      }); //.$promise; ???
    };

    // the question object should have been transfered from home to interview
    $scope.getAllDeckQuestions = function () {    // Actually want all questions from deck id.

      for (var i = 0; i < InterviewFactory.contextObject.questions.length; i++) {
        $scope.getQuestion(InterviewFactory.contextObject.questions[i], i);
      }
    };





    // Submit video.
    $scope.submitVideo = function (videoId) {    // Actually want all questions from deck id.
      // console.log('InterviewFactory.questionObj', InterviewFactory.questionObj);
      // console.log('InterviewFactory.userDeck', InterviewFactory.userDeck);

      var postObject = {
        userId: InterviewFactory.questionObj.userId,
        video: videoId,
        deck: InterviewFactory.questionObj.deck,
        userDeck: InterviewFactory.userDeck._id,
        question: InterviewFactory.questionObj._id,
        questionTitle: InterviewFactory.questionObj.title,
        description: '1min 30sec long',
        textVideo: 'new text video',
        active: true,
      };
      console.log('postObject', postObject);

      $http.post('/api/responses', postObject).success(function(createdResponse) {
          console.log('@interview, response created', createdResponse);

      }).error(function(err) {
        console.log('error creating response', err);
      }); //.bind(this));
    };



    /*  DAVID'S VIDEO INTEGRATIONS */
    // $scope.startRecordingVideo = function() {
    //   var navigator = $window.navigator;
    //   if (navigator !== undefined) {
    //     var video = $window.document.getElementById('video-record');
    //   }
    // };

    $scope.startPreviewVideo = function() {
      var navigator = $window.navigator;
      if ((navigator !== undefined) && (navigator !== null)) {
        var video = $window.document.getElementById('video-preview');

        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia;

        if (navigator.getUserMedia !== undefined) {
          navigator.getUserMedia (
            // Constraints
            {
              audio: true,
              video: true
            },

            // Success callback
            function(stream) {
              video.src = URL.createObjectURL(stream);
              video.muted = true;
              video.controls = true;
              video.play();
              //callback(stream);
            },

            // Error callback
            function(error) {
              console.error(error);
            }
          );
        }
      }
    };
    // Go ahead and start the preview video.
    $scope.startPreviewVideo();
    $scope.getAllDeckQuestions();
  });
