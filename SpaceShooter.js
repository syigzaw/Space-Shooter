$(document).ready(function() {
    var enemyList = [];
    var keys = {};
    var arena = document.getElementById('arena').getContext('2d');
    var arenaHeight = parseInt($('body').css('height'));
    var arenaWidth = parseInt($('body').css('width'));
    createYou();
    createEnemy((Math.random()-0.5)*(arenaWidth-100)+arenaWidth/2, (Math.random()-0.5)*(arenaHeight-100)+arenaHeight/2);
    createEnemy((Math.random()-0.5)*(arenaWidth-100)+arenaWidth/2, (Math.random()-0.5)*(arenaHeight-100)+arenaHeight/2);
    var randXNum = 0.5;
    var randYNum = 0.5;

    setInterval(moveEnemy, 10);
    setInterval(moveYou, 10);
    setInterval(changeRandNum, 500);

    function createEnemy(xPos, yPos) {
    	var index = 'enemy' + $('#objArena').children().length;
    	$('#objArena').append('<div id="'+index+'" class="enemy"><img src="http://sweetclipart.com/multisite/sweetclipart/files/ufo_gray_red_blue.png" height="50" width="100"></div>');
        $('#'+index).css({'left': xPos+'px', 'top': yPos+'px'});
        enemyList.push({
            randXAcc: 0,
            randYAcc: 0,
            randXVel: 0,
            randYVel: 0,
            randXMove: 0,
            randYMove: 0
        })
    }

    function destroyEnemy(enemy) {
    	enemy.effect('explode')
    }

    function moveEnemy() {
    	$('#objArena').children().each(function() {
            moveEnemyX(this);
            moveEnemyY(this);
        });
    }

    function moveEnemyX(self){
        var enemy = enemyList[$(self).attr('id')[5]]
        enemy.randXMove = parseFloat($(self).css('left'));
        var randXAcc = Math.pow(Math.abs(arenaWidth/(parseFloat($(self).css('left'))-50)), 0.5) - Math.pow(Math.abs(arenaWidth/(arenaWidth-parseFloat($(self).css('left'))-50)), 0.5);
        console.log(randXAcc);
        enemy.randXAcc = randXNum*randXAcc/50;
        enemy.randXVel += enemy.randXAcc;
        if (enemy.randXMove + enemy.randXVel >= 50 && enemy.randXMove + enemy.randXVel <= arenaWidth - 50) {
            enemy.randXMove += enemy.randXVel;
            // $('#x').html('<p>randXMove: ' + enemy.randXMove + '</p><p>randXVel: ' + enemy.randXVel + '</p><p>randXAcc: ' + enemy.randXAcc + '</p>');
            xPos = enemy.randXMove + 'px';
            $(self).css('left', xPos);
        } else {
            enemy.randXVel = 0;
        }
    }

    function moveEnemyY(self) {
        var enemy = enemyList[$(self).attr('id')[5]]
        enemy.randYMove = parseFloat($(self).css('top'));
        var randYAcc = Math.pow(Math.abs(arenaHeight/(parseFloat($(self).css('top'))-25)), 0.5) - Math.pow(Math.abs(arenaHeight/(arenaHeight-parseFloat($(self).css('top'))-25)), 0.5);
        enemy.randYAcc = randYNum*randYAcc/50;
        enemy.randYVel += enemy.randYAcc;
        if (enemy.randYMove + enemy.randYVel >= 25 && enemy.randYMove + enemy.randYVel <= arenaHeight - 25) {
            enemy.randYMove += enemy.randYVel;
            // $('#y').html('<p>randYMove: ' + enemy.randYMove + '</p><p>randYVel: ' + enemy.randYVel + '</p><p>randYAcc: ' + enemy.randYAcc + '</p>');
            yPos = enemy.randYMove + 'px';
            $(self).css('top', yPos);
        } else {
            enemy.randYVel = 0;
        }
    }

    function changeRandNum() {
        randXNum = Math.pow((Math.random()+0.5), 3);
        randYNum = Math.pow((Math.random()+0.5), 3);
    }

    function createYou() {
        $('body').append('<div id="you"><img src="https://crazybookfanatic.files.wordpress.com/2013/07/spaceship.png" height="50" width="115"></div>');
        $('#you').css('left', arenaWidth/2);
        $('#you').css('top', arenaHeight/2);
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
        if (You.xMove + You.xVel >= 57.5 && You.xMove + You.xVel <= arenaWidth - 57.5) {
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
        if (You.yMove + You.yVel >= 25 && You.yMove + You.yVel <= arenaHeight - 25) {
            You.yMove += You.yVel;
            // $('#y2').html('<p>yMove: ' + You.yMove + '</p><p>yVel: ' + You.yVel + '</p>');
            yPos = You.yMove + 'px';
            $('#you').css('top', yPos);
        } else {
            You.yVel = 0;
        }
	}

    var You = {
        xVel: 0,
        yVel: 0,
        xMove: arenaWidth/2,
        yMove: arenaHeight/2
    }

});