/**
 * Tap Race game
 * Just a test using fiddle and jquery, images from Google Images.
 * @author Gil Beyruth
 */

$(function () {
    var gameLoopInterval = null;
    var time = 0;
    var startTime = 0;
    var speedy;
    var wave = 0;
    var explode;
    $("#game").fadeOut(0);
    $("#menu").delay(1000).fadeOut(500).queue(function (n) {
            $("#game").fadeIn(500);
            n();
    });
    
    var startGame = function () {
        startTime = +new Date();
        gameLoopInterval = setInterval(function () {
            gameLoop();
        }, 100);
        
    if (document.body.ontouchstart === undefined){ // this is for all browsers
        $(document).click(function(event){
            var x= event.offsetX;
            if(!x){
                x= event.layerX ;
            }
            var y= event.offsetY;
                if(!y){
                y= event.layerY ;
            }
            if(x < 100) {
                clickLeft();
            } else {
                clickRight();
            }
        });
    }else {  // this is for all touch devices
        $(document).bind('touchstart',function(event){
            var orig = event.originalEvent;  
            var x = orig.changedTouches[0].pageX;  
            var y = orig.changedTouches[0].pageY;  
            if(x < 100) {
                clickLeft();
            } else {
                clickRight();
            }
        });
    }
    
        $(document).keydown(function (e) {
            switch (e.which) {
                case 37:
                    // left
                    clickLeft();
                    break;
                case 39:
                    // right
                    clickRight();
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });
    };
    var gameLoop = function () {
        setBackgroundPosition();
        var truck = $('#truck');
        setEnemy(truck, 3);
		
        var currentTime = +new Date()-startTime;
        var displayTime = msToTime(currentTime);
        $("#timer").html(displayTime);
        
        if (hitTest($("#hero"), $('#truck'))) {
            explode.animate();
            clearInterval(gameLoopInterval);
            setTimeout(function(){ gameReset(); }, 2500);
        };	 
    };

   var onClickStart = function () {
        $("#start").off("click");
        $("#tutorial").fadeOut();
        $("#start").fadeOut(0)
            .queue(function (n) {
            $(this).html("3");
            n();
        }).fadeIn(200).delay(1000)
            .fadeOut(0)
            .queue(function (n) {
            $(this).html("2");
            n();
        }).show(200).delay(1000)
            .fadeOut(0)
            .queue(function (n) {
            $(this).html("1");
            n();
        }).fadeIn(200).delay(1000).fadeOut(0)
            .queue(function (n) {
            startGame();
            n();
        });
    }
    

    //controls
    var clickLeft = function () {
        $("#hero").css({
            left: 65
        });
    };
    var clickRight = function () {
        $("#hero").css({
            left: 110
        });
    };
	
    var gameReset = function(){
        spritesheet = new SpriteSheet("img/explosion.gif", 32.5, 32.5);
		explode = new Animation(spritesheet, 2, 0, 47);
        speedy = undefined;
    	$("#road1").css({
            top: 0
        });
        $("#road2").css({
            top: -400
        });
        $("#truck").css({
            top: -70
        });
        $("#tutorial").fadeIn();
        $("#start").fadeIn(0).html("START");
        $("#hero").css({
            top: 330
        });
        wave = 0;
        $("#start").click(onClickStart);
    }
    
    
    var setBackgroundPosition = function () {
        var r1 = $("#road1");
        var t1 = r1.position().top;
        var r2 = $("#road2");
        var t2 = r2.position().top;

        t1 = t1  -((speedy*1.1) - 10);
        t2 = t2  -((speedy*1.1) - 10);

        if (t1 > 400) {
            t1 = t2 - 400;
        }
        r1.css({
            top: t1
        });

        if (t2 > 400) {
            t2 = t1 - 400;
        }
        r2.css({
            top: t2
        });
    };

    var setEnemy = function (enemy, speed) {
        
        var e1 = enemy;
        var t1 = e1.position().top;
        speedy = speedy == undefined ? speed : speedy;
        speedy = speedy - 0.1;
        
           
        if (t1 > 400 || t1 == -70) {
            var r = Math.round(Math.random() % 2);
            if (r == 0) {
                e1.css({
                    left: 65
                });
            } else {
                e1.css({
                    left: 110
                });
            }
           t1 = -40 -(40* Math.random() % 2);
           wave = wave + 1;
           console.log(wave);
           console.log(speedy);
           if( wave < 16 && $("#hero").position().top > 160){
               var carPInitial = 330;
                var pTop = carPInitial - (wave * 10);
                $("#hero").animate({ 
                    top: pTop,
                  }, 100 );
            }
            if( wave >= 16 && wave < 70 && wave % 2 == 0 && $("#hero").position().top < 330 ){
               var carPInitial = 160;
                var pTop = carPInitial + ((wave-16) * 10);
                $("#hero").animate({ 
                    top: pTop,
                  }, 100 );
            }
            if( wave >= 70 && $("#hero").position().top > 250){
               var carPInitial = 330;
                var pTop = carPInitial - ((wave-60) * 10);
                $("#hero").animate({ 
                    top: pTop,
                  }, 100 );
            }
        }else{
	        t1 = t1 -(speedy - 10);
        }
        e1.css({
            top: t1
        });
        
    };


    var hitTest = function (a, b) {
        var aPos = a.position();
        var bPos = b.position();
		var aLeft = aPos.left;
        var aRight = aPos.left + a.width();
        var aTop = aPos.top;
        var aBottom = aPos.top + a.height();

        var bLeft = bPos.left;
        var bRight = bPos.left + b.width();
        var bTop = bPos.top;
        var bBottom = bPos.top + b.height();
        
        return !(bLeft > aRight || bRight < aLeft || bTop > aBottom || bBottom < aTop);
    }
    
   var msToTime = function(s) {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
		
       
      if(ms<0){ 
          ms = "000"
      } else if(ms<10){
      	ms = "00"+ms;
      } else if(ms<100){
      	ms = "0"+ms;
      } 
       
      if(secs<0){ 
          secs = "00"
      } else if(secs<10){
      	secs = "0"+secs;
      } 
      if(mins<0){ 
          mins = "00"
      } else if(mins<10){
      	mins = "0"+mins;
      } 
      if(hrs<0){ 
          hrs = "00"
      } else if(hrs<10){
      	hrs = "0"+hrs;
      } 

      return hrs + ':' + mins + ':' + secs + '.' + ms;
    }
   
   
   
    var ctx = document.getElementById('canvas').getContext('2d');
    function SpriteSheet(path, frameWidth, frameHeight) {
      this.image = new Image();
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;

      // calculate the number of frames in a row after the image loads
      var self = this;
      this.image.onload = function() {
        self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
      };

      this.image.src = path;
    }
    function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
      var animationSequence = [];  // array holding the order of the animation
      var currentFrame = 0;        // the current frame to draw
      var counter = 0;             // keep track of frame rate
      this.endFrame = endFrame;
	  this.currentFrame = currentFrame;
        console.log("CURR"+this.currentFrame);
      // start and end range for frames
      for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);

      // Update the animation
      this.update = function() {

        // update to the next frame if it is time
        if (counter == (frameSpeed - 1))
          currentFrame = (currentFrame + 1) % animationSequence.length;
        this.currentFrame = currentFrame;
        // update the counter
        counter = (counter + 1) % frameSpeed;

      };

      // draw the current frame
      this.draw = function(x, y) {
        // get the row and col of the frame
        var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
        var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

        ctx.drawImage(
          spritesheet.image,
          col * spritesheet.frameWidth, row * spritesheet.frameHeight,
          spritesheet.frameWidth, spritesheet.frameHeight,
          x, y,
          spritesheet.frameWidth, spritesheet.frameHeight);
      };
      var that = this;
      this.animate = function () {
			if(that.currentFrame != that.endFrame){
              	window.setTimeout(that.animate, 1000 / 60);
          	}
          	ctx.clearRect(0, 0, 50, 50);
			that.update();
			that.draw(10, -5);
        }
    }
    gameReset();
   
});