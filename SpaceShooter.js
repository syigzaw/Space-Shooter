$(document).ready(function() {
    screenDimensions();

    window.onresize = function(event) {
        screenDimensions();
    };

    $('#singleplayer').click(function() {
        initializeSinglePlayer();
    });

    $('#multiplayer').click(function() {
        initializeMultiPlayer();
    });

    function screenDimensions() {
        arenaWidth = parseInt($('body').css('width'));
        arenaHeight = parseInt($('body').css('height'));
        if(arenaWidth/1920 < arenaHeight/1080) {
            $('#space').css({'width': 'auto', 'height': '100%'})
        } else {
            $('#space').css({'width': '100%', 'height': 'auto'})
        }
    }

    function initializeSinglePlayer() {
        isSinglePlayer = true;
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
        shotRadius = 10;
        randXNum = 0;
        randYNum = 0;
        $('.playAgain').hide();
        $('#statsDisplay').show();
        $('#statsDisplay').html('<h3>Level: '+level+'</h3><h3>Lives: '+lives+'</h3>');
        $('#titleDisplay img').hide();
        $('#titleDisplay .results').hide().html('Level '+level).fadeIn(500).delay(1000).fadeOut(1000, function() {
            createYou();
            createNewEnemies(level);
            setIntervalsSinglePlayer();            
        });
    }

    function initializeMultiPlayer() {
        isSinglePlayer = false;
        shotList = {};
        keys = {};
        numOfShots = 0;
        numOfExplosions = 0;
        shotRadius = 10;
        randXNum = 0;
        randYNum = 0;
        $('.playAgain').hide();
        $('#titleDisplay img').hide();
        $('#titleDisplay .results').hide().html('Valar Morghulis').fadeIn(500).delay(1000).fadeOut(1000, function() {
            createPlayer1();
            createPlayer2();
            setIntervalsMultiPlayer();            
            $('#statsDisplay').show();
            $('#statsDisplay').html('<h3>Player 1: '+Player1.lives+' Lives</h3><h3>Player 2: '+Player2.lives+' Lives</h3>')
        });
    }

    function createNewEnemies(num) {
        for(i = 0; i < num; i++) {
            createEnemy((Math.random()-0.5)*(arenaWidth-100)+arenaWidth/2, (Math.random()-0.5)*(arenaHeight-100)+arenaHeight/2);
        }
    }

    function setIntervalsSinglePlayer() {
        moveEnemyInterval = setInterval(moveEnemy, 10);
        moveYouInterval = setInterval(function() {
            moveYou(You);
        }, 10);
        changeRandNumInterval = setInterval(changeRandNum, 500);
        enemyShootInterval = setInterval(enemyShoot, 2000);
        shootInterval = setInterval(shoot, 10);
    }

    function setIntervalsMultiPlayer() {
        movePlayer1Interval = setInterval(function() {
            moveYou(Player1);
        }, 10);
        movePlayer2Interval = setInterval(function() {
            moveYou(Player2);
        }, 10);
        changeRandNumInterval = setInterval(changeRandNum, 500);
        shootInterval = setInterval(shoot, 10);
    }

    function createEnemy(xPos, yPos) {
    	var index = 'enemy' + numOfEnemies;
    	$('#objArena').append('<div id="'+index+'" class="enemy"><img id="enemyImg'+numOfEnemies+'" src="http://i86.photobucket.com/albums/k81/trekkie313/2009-08-16_KG_LH_X1-007C.png?t=1271886751" height="'+parseFloat(enemyYRadius*2+12.41)+'" width="'+parseFloat(enemyXRadius*2+16.73)+'" draggable="false"></div>');
        var enemy = {
            xAcc: 0,
            yAcc: 0,
            xVel: 0,
            yVel: 0,
            xPos: 0,
            yPos: 0,
        }
        enemyList[numOfEnemies] = enemy;
        numOfEnemies += 1;
        $('#'+index).css({'left': xPos+'px', 'top': yPos+'px'});
        $('#objArena > .enemy > img').css('left', -enemyXRadius-12.41/2);
        $('#objArena > .enemy > img').css('top', -enemyYRadius-16.73/2);
    }

    function destroyEnemy(i) {
        enemyExplode(enemyList[i].xPos, enemyList[i].yPos);
        delete enemyList[i];
        $('#enemy'+i).remove();
        if(jQuery.isEmptyObject(enemyList)) {
            if(level < 10) {
                level += 1;
                $('#titleDisplay .results').html('Level '+level).fadeIn(500).delay(1000).fadeOut(1000, function() {
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
        enemy.xPos = parseFloat($(self).css('left'));
        var xAcc = Math.pow(Math.abs(arenaWidth/(parseFloat($(self).css('left'))-enemyXRadius)), 0.5) - Math.pow(Math.abs(arenaWidth/(arenaWidth-parseFloat($(self).css('left'))-enemyXRadius)), 0.5);
        enemy.xAcc = randXNum*xAcc/50;
        enemy.xVel += enemy.xAcc;
        if(enemy.xPos + enemy.xVel >= enemyXRadius && enemy.xPos + enemy.xVel <= arenaWidth - enemyXRadius) {
            enemy.xPos += enemy.xVel;
            xPos = enemy.xPos + 'px';
            $(self).css('left', xPos);
        } else {
            enemy.xVel = 0;
        }
    }

    function moveEnemyY(self) {
        var enemy = enemyList[$(self).attr('id').substring(5)];
        enemy.yPos = parseFloat($(self).css('top'));
        var yAcc = Math.pow(Math.abs(arenaHeight/(parseFloat($(self).css('top'))-enemyYRadius)), 0.5) - Math.pow(Math.abs(arenaHeight/(arenaHeight-parseFloat($(self).css('top'))-enemyYRadius)), 0.5);
        enemy.yAcc = randYNum*yAcc/50;
        enemy.yVel += enemy.yAcc;
        if(enemy.yPos + enemy.yVel >= enemyYRadius && enemy.yPos + enemy.yVel <= arenaHeight - enemyYRadius) {
            enemy.yPos += enemy.yVel;
            yPos = enemy.yPos + 'px';
            $(self).css('top', yPos);
        } else {
            enemy.yVel = 0;
        }
    }

    function enemyShoot() {
        $('#objArena').children().each(function() {
            var enemy = enemyList[$(this).attr('id').substring(5)];
            var distanceDenominator = Math.sqrt(Math.pow(enemy.xPos-You.xPos, 2)+Math.pow(enemy.yPos-You.yPos, 2))
            shotList[numOfShots] = {
                xPos: enemy.xPos + (enemyXRadius+15)*(You.xPos-enemy.xPos)/distanceDenominator,
                yPos: enemy.yPos + (enemyYRadius+15)*(You.yPos-enemy.yPos)/distanceDenominator,
                xShot: You.xPos,
                yShot: You.yPos,         
            };
            var index = numOfShots;
            numOfShots += 1;
            $('#shotArena').append('<div id="'+index+'" class="enemyShot"></div>');
            $('#'+index).css({'left': (shotList[index].xPos-shotRadius)+'px', 'top': (shotList[index].yPos-shotRadius)+'px'});
        });            
    }

    function changeRandNum() {
        randXNum = Math.pow((Math.random()+0.5), 3);
        randYNum = Math.pow((Math.random()+0.5), 3);
    }

    function createYou() {
        You = {
            xVel: 0,
            yVel: 0,
            xPos: arenaWidth/2,
            yPos: arenaHeight/2,
            xRadius: 50,
            yRadius: 29.17,
            string: 'You',
        }
        $('body').append('<div id="you"><img id="youImg" src="http://icons.iconarchive.com/icons/jonathan-rey/star-wars-vehicles/256/Millenium-Falcon-02-icon.png" height="100px" width="100px" draggable="false"></div>');
        $('#you').css('left', arenaWidth/2);
        $('#you').css('top', arenaHeight/2);
        $('#you > img').css('left', -You.xRadius);
        $('#you > img').css('top', -You.yRadius-41.67/2);
    }

    function createPlayer1() {
        Player1 = {
            xVel: 0,
            yVel: 0,
            xPos: arenaWidth/4,
            yPos: arenaHeight/4,
            xRadius: 50,
            yRadius: 30.3,
            lives: 10,
            canShoot: true,
            string: 'Player1',
        }
        $('body').append('<div id="player1"><img id="player1Img" src="http://icons.iconarchive.com/icons/everaldo/starwars/128/X-Wing-icon.png" height="100px" width="100px" draggable="false"></div>');
        $('#player1').css('left', arenaWidth/4);
        $('#player1').css('top', arenaHeight/4);
        $('#player1 > img').css('left', -Player1.xRadius);
        $('#player1 > img').css('top', -Player1.yRadius-30.3/2);
    }

    function createPlayer2() {
        Player2 = {
            xVel: 0,
            yVel: 0,
            xPos: 3*arenaWidth/4,
            yPos: 3*arenaHeight/4,
            xRadius: 50,
            yRadius: 30.3,
            lives: 10,
            canShoot: true,
            string: 'Player2',
        }
        $('body').append('<div id="player2"><img id="player2Img" src="http://icons.iconarchive.com/icons/everaldo/starwars/128/X-Wing-icon.png" height="100px" width="100px" draggable="false"></div>');
        $('#player2').css('left', 3*arenaWidth/4);
        $('#player2').css('top', 3*arenaHeight/4);
        $('#player2 > img').css('left', -Player2.xRadius);
        $('#player2 > img').css('top', -Player2.yRadius-30.3/2);
    }

    function destroyYou() {
        lives -= 1;
        youExplode();
        if(lives <= 0) {
            loseGame();
        }
        $('#statsDisplay').html('<h3>Level: '+level+'</h3><h3>Lives: '+lives+'</h3>');
    }

    function destroyPlayer(self) {
        self.lives -= 1;
        switch(self) {
            case Player1:
                playerExplode('#player1');
                break
            case Player2:
                playerExplode('#player2');
                break
        }
        if(self.lives <= 0) {
            gameOver();
        }
        $('#statsDisplay').html('<h3>Player 1: '+Player1.lives+' Lives</h3><h3>Player 2: '+Player2.lives+' Lives</h3>')
    }

    $('body').keydown(function(event) {
        if(gameIsOn()) {
            keys[event.which] = event.which;           
        }
    });

    $('body').keyup(function(event) {
        if(gameIsOn()) {
            delete keys[event.which];            
        }
    });

    function moveYou(self) {
        var selfId = '';
        for(var i in keys) {
            if(self.string != 'Player2') {
                switch (i) {
                    case '65':
                            self.xVel -= 1/20;
                        break;
                    case '87':
                            self.yVel -= 1/20;
                        break;
                    case '68':
                            self.xVel += 1/20;
                        break;
                    case '83':
                            self.yVel += 1/20;
                        break;
                }
            } else {
                switch (i) {
                    case '37':
                        Player2.xVel -= 1/20;
                        selfId = 'player2';
                        break;
                    case '38':
                        Player2.yVel -= 1/20;
                        selfId = 'player2';
                        break;
                    case '39':
                        Player2.xVel += 1/20;
                        selfId = 'player2';
                        break;
                    case '40':
                        Player2.yVel += 1/20;
                        selfId = 'player2';
                        break;
                }
            }
        }
        if(self.string == 'Player2') {
            selfId = 'player2';
        } else {
            selfId = self.string.toLowerCase();
        }
        moveYouX(self, selfId);
        moveYouY(self, selfId);
    }

    function moveYouX(self, selfId) {
        if(self.xPos + self.xVel >= self.xRadius && self.xPos + self.xVel <= arenaWidth - self.xRadius) {
            self.xPos += self.xVel;
            xPos = self.xPos + 'px';
            $('#'+selfId).css('left', xPos);
        } else {
            self.xVel = 0;
        }
    }

    function moveYouY(self, selfId) {
        if(self.yPos + self.yVel >= self.yRadius && self.yPos + self.yVel <= arenaHeight - self.yRadius) {
            self.yPos += self.yVel;
            yPos = self.yPos + 'px';
            $('#'+selfId).css('top', yPos);
        } else {
            self.yVel = 0;
        }
	}

    $('body').click(function(event) {
        if(gameIsOn() && isSinglePlayer) {
            calculateShot(You, event.pageX, event.pageY);
        }
    });

    $('body').keydown(function(event) {
        if(gameIsOn() && !isSinglePlayer) {
            for(var i in keys) {
                switch (i) {
                    case '32':
                        if(Player1.canShoot) {
                            calculateShot(Player1, Player2.xPos, Player2.yPos);
                            Player1.canShoot = false;
                            setTimeout(function() {
                                Player1.canShoot = true;
                            }, 1000);
                        }
                        break;
                    case '13':
                        if(Player2.canShoot) {
                            calculateShot(Player2, Player1.xPos, Player1.yPos);
                            Player2.canShoot = false;
                            setTimeout(function() {
                                Player2.canShoot = true;
                            }, 1000);
                        }
                        break;
                }
            }
        }
    });

    function calculateShot(self, xPos, yPos) {
        if(gameIsOn()) {
            var distanceDenominator = Math.sqrt(Math.pow(xPos-self.xPos, 2)+Math.pow(yPos-self.yPos, 2))
            shotList[numOfShots] = {
                xPos: self.xPos + (self.xRadius+15)*(xPos-self.xPos)/distanceDenominator,
                yPos: self.yPos + (self.yRadius+15)*(yPos-self.yPos)/distanceDenominator,
                xShot: xPos + (self.xRadius+15)*(xPos-self.xPos)/distanceDenominator,
                yShot: yPos + (self.yRadius+15)*(yPos-self.yPos)/distanceDenominator,
            };
            var index = numOfShots;
            numOfShots += 1;
            $('#shotArena').append('<div id="'+index+'" class="youShot"></div>');
            $('#'+index).css({'left': (shotList[index].xPos-shotRadius)+'px', 'top': (shotList[index].yPos-shotRadius)+'px'});
        }
    };

    function shoot() {
        for(var i in shotList) {
            var shot = shotList[parseInt(i)];
            if(shot.xPos >= 0 && shot.xPos <= arenaWidth && shot.yPos >= 0 && shot.yPos <= arenaHeight) {
                var movementDenominator = Math.sqrt(Math.pow(shot.xShot-shot.xPos, 2)+Math.pow(shot.yShot-shot.yPos, 2));
                var xMovement = (shot.xShot-shot.xPos)/movementDenominator;
                var yMovement = (shot.yShot-shot.yPos)/movementDenominator;
                shot.xPos += 5*xMovement;
                shot.yPos += 5*yMovement;
                shot.xShot += 5*xMovement;
                shot.yShot += 5*yMovement;
                $('#'+i).css({'left': shot.xPos+'px', 'top': shot.yPos+'px'});
            } else {
                delete shotList[i];
                $('#'+i).remove();
            }
            if(isSinglePlayer) {
                for(var j in enemyList) {
                    enemy = enemyList[j];
                    enemyDistance = Math.pow(((enemy.xPos-shot.xPos)/(enemyXRadius+shotRadius)),2)+Math.pow(((enemy.yPos-shot.yPos)/(enemyYRadius+shotRadius)),2)
                    if(enemyDistance <= 0.75) {
                        delete shotList[i];
                        $('#'+i).remove();
                        destroyEnemy(j);
                    }
                }
                youDistance = Math.pow(((You.xPos-shot.xPos)/(You.xRadius+shotRadius)),2)+Math.pow(((You.yPos-shot.yPos)/(You.yRadius+shotRadius)),2)
                if(youDistance <= 0.75) {
                    delete shotList[i];
                    $('#'+i).remove();
                    destroyYou();
                }                
            } else {
                player1Distance = Math.pow(((Player1.xPos-shot.xPos)/(Player1.xRadius+shotRadius)),2)+Math.pow(((Player1.yPos-shot.yPos)/(Player1.yRadius+shotRadius)),2)
                if(player1Distance <= 0.75) {
                    delete shotList[i];
                    $('#'+i).remove();
                    destroyPlayer(Player1);
                }                
                player2Distance = Math.pow(((Player2.xPos-shot.xPos)/(Player2.xRadius+shotRadius)),2)+Math.pow(((Player2.yPos-shot.yPos)/(Player2.yRadius+shotRadius)),2)
                if(player2Distance <= 0.75) {
                    delete shotList[i];
                    $('#'+i).remove();
                    destroyPlayer(Player2);
                }
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

    function playerExplode(self) {
        var explosionNum = numOfExplosions;
        $(self).append('<img class="explosion" id="'+self.substring(1)+'Explosion'+explosionNum+'" src="http://flashvhtml.com/html/img/action/explosion/Explosion_Sequence_A%2012.png" height="200" width="200">');
        $(self+'Explosion'+explosionNum).css({'left': (-100)+'px', 'top': (-100)+'px'});
        $(self+'Explosion'+explosionNum).fadeOut(2000, function() {
            $(self+'Explosion'+explosionNum).remove();
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
        $('#titleDisplay .results').html('You Win!').fadeIn(500).delay(1000).fadeOut(1000, function() {
            $('#statsDisplay').hide();
            $('.playAgain').show();
            $('#titleDisplay img').show();
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
        $('#titleDisplay .results').html('You Lose.').fadeIn(500).delay(1000).fadeOut(1000, function() {
            $('#statsDisplay').hide();
            $('.playAgain').show();
            $('#titleDisplay img').show();
        });
    }

    function gameOver() {
        clearInterval(movePlayer1Interval);
        clearInterval(movePlayer2Interval);
        clearInterval(changeRandNumInterval);
        clearInterval(shootInterval);
        $('#shotArena').children().each(function() {
            $(this).remove();
        });
        $('#player1').remove();
        $('#player2').remove();
        var winner = '';
        if(Player1.lives == 0) {
            winner = 'Player 2';
        } else if(Player2.lives == 0) {
            winner = 'Player 1';
        }
        $('#titleDisplay .results').html(winner+' Wins!').fadeIn(500).delay(1000).fadeOut(1000, function() {
            $('#statsDisplay').hide();
            $('.playAgain').show();
            $('#titleDisplay img').show();
        });
    }

    function gameIsOn() {
        return $('#you').css('left') || $('#player1').css('left') || $('#player2').css('left');
    }

});