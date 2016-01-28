$(document).ready(function() {
    initialize();

    function initialize() {
        level = 1;
        lives = 3;
        enemyList = {};
        shotList = {};
        keys = {};
        numOfEnemies = 0;
        numOfShots = 0;
        numOfExplosions = 0;
        enemyXRadius = 50;
        enemyYRadius = 29;
        youXRadius = 50;
        youYRadius = 29.17;
        shotRadius = 10;
        randXNum = 0;
        randYNum = 0;
        arenaHeight = parseInt($('body').css('height'));
        arenaWidth = parseInt($('body').css('width'));
        $('.playAgain').hide();
        $('#statsDisplay').html('<h3>Level: '+level+'</h3><h3>Lives: '+lives+'</h3>');
        $('#titleDisplay .results').html('Level '+level).fadeIn(500).delay(2000).fadeOut(1000, function() {
            createYou();
            createNewEnemies(level);
            setIntervals();            
        });
    }

    function createNewEnemies(num) {
        for (i = 0; i < num; i++) {
            createEnemy((Math.random()-0.5)*(arenaWidth-100)+arenaWidth/2, (Math.random()-0.5)*(arenaHeight-100)+arenaHeight/2);
        }
    }

    function setIntervals() {
        moveEnemyInterval = setInterval(moveEnemy, 10);
        moveYouInterval = setInterval(moveYou, 10);
        changeRandNumInterval = setInterval(changeRandNum, 500);
        enemyShootInterval = setInterval(enemyShoot, 2000);
        shootInterval = setInterval(shoot, 10);
    }

    function createEnemy(xPos, yPos) {
    	var index = 'enemy' + numOfEnemies;
    	$('#objArena').append('<div id="'+index+'" class="enemy"><img id="enemyImg'+numOfEnemies+'" src="http://i86.photobucket.com/albums/k81/trekkie313/2009-08-16_KG_LH_X1-007C.png?t=1271886751" height="'+parseFloat(enemyYRadius*2+12.41)+'" width="'+parseFloat(enemyXRadius*2+16.73)+'" draggable="false"></div>');
        var enemy = {
            randXAcc: 0,
            randYAcc: 0,
            randXVel: 0,
            randYVel: 0,
            randXMove: 0,
            randYMove: 0,
        }
        enemyList[numOfEnemies] = enemy;
        numOfEnemies += 1;
        $('#'+index).css({'left': xPos+'px', 'top': yPos+'px'});
        $('#objArena > .enemy > img').css('left', -enemyXRadius-12.41/2);
        $('#objArena > .enemy > img').css('top', -enemyYRadius-16.73/2);
    }

    function destroyEnemy(i) {
        enemyExplode(enemyList[i].randXMove, enemyList[i].randYMove);
        delete enemyList[i];
        $('#enemy'+i).remove();
        if (jQuery.isEmptyObject(enemyList)) {
            if (level < 10) {
                level += 1;
                $('#titleDisplay .results').html('Level '+level).fadeIn(500).fadeOut(2000, function() {
                    createNewEnemies(level);
                });
            } else {
                winGame();
            }
            $('#statsDisplay').html('<h3>Level: '+level+'</h3><h3>Lives: '+lives+'</h3>');
        }
    }

    function moveEnemy() {
    	$('#objArena').children().each(function() {
            moveEnemyX(this);
            moveEnemyY(this);
        });
    }

    function moveEnemyX(self){
        var enemy = enemyList[$(self).attr('id').substring(5)];
        enemy.randXMove = parseFloat($(self).css('left'));
        var randXAcc = Math.pow(Math.abs(arenaWidth/(parseFloat($(self).css('left'))-enemyXRadius)), 0.5) - Math.pow(Math.abs(arenaWidth/(arenaWidth-parseFloat($(self).css('left'))-enemyXRadius)), 0.5);
        enemy.randXAcc = randXNum*randXAcc/50;
        enemy.randXVel += enemy.randXAcc;
        if (enemy.randXMove + enemy.randXVel >= enemyXRadius && enemy.randXMove + enemy.randXVel <= arenaWidth - enemyXRadius) {
            enemy.randXMove += enemy.randXVel;
            // $('#x').html('<p>randXMove: ' + enemy.randXMove + '</p><p>randXVel: ' + enemy.randXVel + '</p><p>randXAcc: ' + enemy.randXAcc + '</p>');
            xPos = enemy.randXMove + 'px';
            $(self).css('left', xPos);
        } else {
            enemy.randXVel = 0;
        }
    }

    function moveEnemyY(self) {
        var enemy = enemyList[$(self).attr('id').substring(5)];
        enemy.randYMove = parseFloat($(self).css('top'));
        var randYAcc = Math.pow(Math.abs(arenaHeight/(parseFloat($(self).css('top'))-enemyYRadius)), 0.5) - Math.pow(Math.abs(arenaHeight/(arenaHeight-parseFloat($(self).css('top'))-enemyYRadius)), 0.5);
        enemy.randYAcc = randYNum*randYAcc/50;
        enemy.randYVel += enemy.randYAcc;
        if (enemy.randYMove + enemy.randYVel >= enemyYRadius && enemy.randYMove + enemy.randYVel <= arenaHeight - enemyYRadius) {
            enemy.randYMove += enemy.randYVel;
            // $('#y').html('<p>randYMove: ' + enemy.randYMove + '</p><p>randYVel: ' + enemy.randYVel + '</p><p>randYAcc: ' + enemy.randYAcc + '</p>');
            yPos = enemy.randYMove + 'px';
            $(self).css('top', yPos);
        } else {
            enemy.randYVel = 0;
        }
    }

    function enemyShoot() {
        $('#objArena').children().each(function() {
            var enemy = enemyList[$(this).attr('id').substring(5)];
            var distanceDenominator = Math.sqrt(Math.pow(enemy.randXMove-You.xMove, 2)+Math.pow(enemy.randYMove-You.yMove, 2))
            shotList[numOfShots] = {
                xPos: enemy.randXMove + (enemyXRadius+15)*(You.xMove-enemy.randXMove)/distanceDenominator,
                yPos: enemy.randYMove + (enemyYRadius+15)*(You.yMove-enemy.randYMove)/distanceDenominator,
                xShot: You.xMove,
                yShot: You.yMove,         
            };
            var index = numOfShots;
            numOfShots += 1;
            $('#shotArena').append('<div id="'+index+'" class="enemyShot"></div>');
            // console.log('Enemy:', Object.keys(shotList).length-$('#shotArena').children().length);
            $('#'+index).css({'left': (shotList[index].xPos-shotRadius)+'px', 'top': (shotList[index].yPos-shotRadius)+'px'});
        });            
    }

    function changeRandNum() {
        randXNum = Math.pow((Math.random()+0.5), 3);
        randYNum = Math.pow((Math.random()+0.5), 3);
    }

    function createYou() {
        $('body').append('<div id="you"><img id="youImg" src="http://icons.iconarchive.com/icons/jonathan-rey/star-wars-vehicles/256/Millenium-Falcon-02-icon.png" height="'+youXRadius*2+'" width="'+youYRadius*2+41.67+'" draggable="false"></div>');
        $('#you').css('left', arenaWidth/2);
        $('#you').css('top', arenaHeight/2);
        $('#you > img').css('left', -youXRadius);
        $('#you > img').css('top', -youYRadius-41.67/2);
        You = {
            xVel: 0,
            yVel: 0,
            xMove: arenaWidth/2,
            yMove: arenaHeight/2,
        }
    }

    function destroyYou() {
        lives -= 1;
        youExplode();
        if (lives <= 0) {
            loseGame();
        }
        $('#statsDisplay').html('<h3>Level: '+level+'</h3><h3>Lives: '+lives+'</h3>');
    }

    $('body').keydown(function(event) {
        keys[event.which] = event.which;
    });

    $('body').keyup(function(event) {
        delete keys[event.which];
    });

    function moveYou() {
        for (var i in keys) {
            switch (i) {
                case '65':
                    You.xVel -= 1/20;
                    break;
                case '87':
                    You.yVel -= 1/20;
                    break;
                case '68':
                    You.xVel += 1/20;
                    break;
                case '83':
                    You.yVel += 1/20;
                    break;
            }
        }
        moveYouX();
        moveYouY();            
    }

    function moveYouX() {
        // $('#x2').html('<p>xMove: ' + You.xMove + '</p><p>xVel: ' + You.xVel + '</p>');
        if (You.xMove + You.xVel >= youXRadius && You.xMove + You.xVel <= arenaWidth - youXRadius) {
            You.xMove += You.xVel;
            // $('#x2').html('<p>xMove: ' + You.xMove + '</p><p>xVel: ' + You.xVel + '</p>');
            xPos = You.xMove + 'px';
            $('#you').css('left', xPos);
        } else {
            You.xVel = 0;
        }
    }

    function moveYouY() {
        // $('#y2').html('<p>yMove: ' + You.yMove + '</p><p>yVel: ' + You.yVel + '</p>');
        if (You.yMove + You.yVel >= youYRadius && You.yMove + You.yVel <= arenaHeight - youYRadius) {
            You.yMove += You.yVel;
            // $('#y2').html('<p>yMove: ' + You.yMove + '</p><p>yVel: ' + You.yVel + '</p>');
            yPos = You.yMove + 'px';
            $('#you').css('top', yPos);
        } else {
            You.yVel = 0;
        }
	}

    $('body').click(function(event) {
    if ($('#you').css('left')) {
            var distanceDenominator = Math.sqrt(Math.pow(event.pageX-You.xMove, 2)+Math.pow(event.pageY-You.yMove, 2))
            shotList[numOfShots] = {
                xPos: You.xMove + (youXRadius+15)*(event.pageX-You.xMove)/distanceDenominator,
                yPos: You.yMove + (youYRadius+15)*(event.pageY-You.yMove)/distanceDenominator,
                xShot: event.pageX,
                yShot: event.pageY,         
            };
            var index = numOfShots;
            numOfShots += 1;
            $('#shotArena').append('<div id="'+index+'" class="youShot"></div>');
            // console.log('You:', Object.keys(shotList).length-$('#shotArena').children().length);
            $('#'+index).css({'left': (shotList[index].xPos-shotRadius)+'px', 'top': (shotList[index].yPos-shotRadius)+'px'});
        }
    });

    function shoot() {
        for (var i in shotList) {
            var shot = shotList[parseInt(i)];
            if (shot.xPos >= 0 && shot.xPos <= arenaWidth && shot.yPos >= 0 && shot.yPos <= arenaHeight) {
                // console.log('hello');
                // $('#x').html('<p>xPos: ' + shot.xPos + '</p><p>yPos: ' + shot.yPos + '</p><p>xShot: ' + shot.xShot + '</p><p>yShot: ' + shot.yShot + '</p>');
                var movementDenominator = Math.sqrt(Math.pow(shot.xShot-shot.xPos, 2)+Math.pow(shot.yShot-shot.yPos, 2));
                shot.xPos += 5*(shot.xShot-shot.xPos)/movementDenominator;
                shot.yPos += 5*(shot.yShot-shot.yPos)/movementDenominator;            
                shot.xShot += 5*(shot.xShot-shot.xPos)/movementDenominator;
                shot.yShot += 5*(shot.yShot-shot.yPos)/movementDenominator;
                $('#'+i).css({'left': shot.xPos+'px', 'top': shot.yPos+'px'});
            } else {
                delete shotList[i];
                $('#'+i).remove();
                // console.log('Delete:', Object.keys(shotList).length-$('#shotArena').children().length);
                // console.log('shot.xPos:', shot.xPos, 'shot.yPos:', shot.yPos);
            }
            for (var j in enemyList) {
                enemy = enemyList[j];
                enemyDistance = Math.pow(((enemy.randXMove-shot.xPos)/(enemyXRadius+shotRadius)),2)+Math.pow(((enemy.randYMove-shot.yPos)/(enemyYRadius+shotRadius)),2)
                if (enemyDistance <= 0.75) {
                    delete shotList[i];
                    $('#'+i).remove();
                    destroyEnemy(j);
                }
            }
            youDistance = Math.pow(((You.xMove-shot.xPos)/(youXRadius+shotRadius)),2)+Math.pow(((You.yMove-shot.yPos)/(youYRadius+shotRadius)),2)
            if (youDistance <= 0.75) {
                delete shotList[i];
                $('#'+i).remove();
                destroyYou();
            }
        }
    }

    function enemyExplode(xPos, yPos) {
        var explosionNum = numOfExplosions;
        $('body').append('<img class="explosion" id="enemyExplosion'+explosionNum+'" src="http://flashvhtml.com/html/img/action/explosion/Explosion_Sequence_A%2012.png" height="200" width="200">');
        $('#enemyExplosion'+explosionNum).css({'left': (xPos-100)+'px', 'top': (yPos-100)+'px'});
        $('#enemyExplosion'+explosionNum).fadeOut(2000, function() {
            $('#enemyExplosion'+explosionNum).remove();
        });
        numOfExplosions += 1;
    }

    function youExplode() {
        var explosionNum = numOfExplosions;
        $('#you').append('<img class="explosion" id="youExplosion'+explosionNum+'" src="http://flashvhtml.com/html/img/action/explosion/Explosion_Sequence_A%2012.png" height="200" width="200">');
        $('#youExplosion'+explosionNum).css({'left': (-100)+'px', 'top': (-100)+'px'});
        $('#youExplosion'+explosionNum).fadeOut(2000, function() {
            $('#youExplosion'+explosionNum).remove();
        });
        numOfExplosions += 1;
    }

    function winGame() {
        clearInterval(moveEnemyInterval);
        clearInterval(moveYouInterval);
        clearInterval(changeRandNumInterval);
        clearInterval(enemyShootInterval);
        clearInterval(shootInterval);
        $('#objArena').children().each(function() {
            $(this).remove();
        });
        $('#shotArena').children().each(function() {
            $(this).remove();
        });
        $('#you').remove();
        $('#titleDisplay .results').html('You Win!').fadeIn(500).delay(2000).fadeOut(1000, function() {
            $('#titleDisplay .playAgain').show();
        });
    }

    function loseGame() {
        clearInterval(moveEnemyInterval);
        clearInterval(moveYouInterval);
        clearInterval(changeRandNumInterval);
        clearInterval(enemyShootInterval);
        clearInterval(shootInterval);
        $('#objArena').children().each(function() {
            $(this).remove();
        });
        $('#shotArena').children().each(function() {
            $(this).remove();
        });
        $('#you').remove();
        $('#titleDisplay .results').html('You Lose.').fadeIn(500).delay(2000).fadeOut(1000, function() {
            $('#titleDisplay .playAgain').show();
        });
    }

    window.onresize = function(event) {
        arenaHeight = parseInt($('body').css('height'));
        arenaWidth = parseInt($('body').css('width'));
        $('canvas').attr('width', arenaWidth);
        $('canvas').attr('height', arenaHeight);
    };

    $('.playAgain').click(function() {
        initialize();
    });

});