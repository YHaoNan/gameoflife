/**
 * This file provide a 2d array for game.
 */


/**
 * @param {*} len game board width and height 
 * @param {*} callback The function will be called when the game board change.
 */
function initGame(len,callback){
    // Game object
    var game = {
        speed: 80,
        boardEdgeLength: len,
        gameBoard: null,
        mainLoop: null,
        callback: callback
    };
    
    var notifyChanged = function(){
        game.callback(game.gameBoard);
    }

    game.gameBoard = genFalseBoard(game.boardEdgeLength);
    notifyChanged();

    var nextStep = function(){
        var gameBoardClone = clone2DimArray(game.gameBoard);
        for(var i = 0;i<game.boardEdgeLength;i++){
            for(var j = 0;j<game.boardEdgeLength;j++){
                function r(n){return (game.boardEdgeLength+n)%game.boardEdgeLength;}
                var neighbours = [
                    //Top 3
                    game.gameBoard[r(i-1)][r(j-1)], game.gameBoard[r(i-1)][j],game.gameBoard[r(i-1)][r(j+1)],
                    //Left and Right
                    game.gameBoard[i][r(j-1)],game.gameBoard[i][r(j+1)],
                    //Bottom 3
                    game.gameBoard[r(i+1)][r(j-1)], game.gameBoard[r(i+1)][j] ,game.gameBoard[r(i+1)][r(j+1)]];
                var aliveCount = 0;
                neighbours.forEach(function(nb){
                    if(nb)aliveCount++;
                });
                if(!game.gameBoard[i][j] && aliveCount==3)gameBoardClone[i][j]=true;
                else if(aliveCount<2 || aliveCount>3)gameBoardClone[i][j]=false;
            }
        }
        game.gameBoard = clone2DimArray(gameBoardClone);
        notifyChanged();
    }

    
    return {
        changePoint: function(x,y){
            if(x>=game.boardEdgeLength || y>=game.boardEdgeLength || x<0 || y<0)return;
            game.gameBoard[x][y] = !game.gameBoard[x][y];
            notifyChanged();            
        },
        reqNotify: notifyChanged,
        setGameBoard: function(gameBoard){
            game.gameBoard = gameBoard;
            notifyChanged();            
        },
        getGameBoard: function(){
            return game.gameBoard;
        },
        setBoardWidth: function(w){
            throw "Function is not implement."
        },
        start: function(){
            if(game.mainLoop==null){
                game.mainLoop = setInterval(nextStep,game.speed,game.callback);
            }  
        },
        step: nextStep,
        stop: function(){
            if(game.mainLoop){
                clearInterval(game.mainLoop);
                game.mainLoop=null;
            }
        },
        setSpeed: function(spd){
            this.stop();
            game.speed = spd;
            this.start();
        },
        getPos: function(i,j){return game.gameBoard[i][j]},
        close: function(){
            this.stop();
            delete fn;
            game = null;
        }
    };
}




