var blockWidth = 0;
var gameBoardWidth = 50;
var maxSenceWidth = 600;
var gridColor = '#aaaaaa';
var blockColor = '#000000';


function reDraw(gameBoardArr){
    var len = gameBoardArr.length;
    var canvas = document.getElementById('game_board');
    canvas.setAttribute('width',len*blockWidth);
    canvas.setAttribute('height',len*blockWidth);
    if(!canvas.getContext){alert('啊哦，当前浏览器好像不支持绘制图形，试试微信和QQ的自带浏览器或者Chrome吧！');return;}
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);    
    context.beginPath();
    context.strokeStyle = gridColor;
    for(var i=1;i<len;i++){
        context.moveTo(0,i*blockWidth);
        context.lineTo(len*blockWidth,i*blockWidth);
        context.moveTo(i*blockWidth,0);
        context.lineTo(i*blockWidth,len*blockWidth);
    }
    context.stroke();
    context.fillStyle = blockColor;
    for(var i=0;i<gameBoardArr.length;i++){
        for(var j=0;j<gameBoardArr[i].length;j++){
            if(gameBoardArr[i][j]){
                context.fillRect(j*blockWidth,i*blockWidth,blockWidth,blockWidth);
            }
        }
    }

}

var preinstallDatas = {
    干杯Bilibili:'50|11:29|12:14,28|13:15,27|14:16,26|15:17,25|16:14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29|17:14,29|18:14,19,24,29|19:14,18,25,29|20:14,17,26,29|21:14,29|22:14,21,22,29|23:14,29|24:14,29|25:14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29|26:16,17,26,27',
    'Google Dino':'50|14:19,20,21,22,23,24|15:18,19,21,22,23,24,25|16:18,19,20,21,22,23,24,25|17:18,19,20,21,22,23,24,25|18:18,19,20,21|19:18,19,20,21,22,23,24|20:7,17,18,19,20|21:7,15,16,17,18,19,20|22:7,8,13,14,15,16,17,18,19,20,21,22|23:7,8,9,12,13,14,15,16,17,18,19,20,22|24:7,8,9,10,11,12,13,14,15,16,17,18,19,20|25:8,9,10,11,12,13,14,15,16,17,18,19,20|26:9,10,11,12,13,14,15,16,17,18,19|27:10,11,12,13,14,15,16,17,18,19|28:11,12,13,14,15,16,17,18|29:6,7,8,9,12,13,14,16,17|30:12,13,17,20,21,22,23,24,25,26,27,28,29|31:9,10,12,17|32:12,13,17,18,28|33:6,7',
    脉冲星星:'50|16:21,23,25|17:21,25|18:21,25|19:21,25|20:21,23,25',
    细胞:'50|0:1|1:2|2:0,1,2',
    轻量级飞船:'50|1:2,3|2:1,2,3,4|3:1,2,4,5|4:3,4',
    十十归一:'50|21:20,21,22,23,24,25,26,27,28,29',
    玻璃杯:'50|15:16,17,19,20|16:16,17,19,20|17:17,19|18:15,17,19,21|19:15,17,19,21|20:15,16,20,21',
    子弹发射机:'50|4:30,31,41,42|5:29,31,41,42|6:7,8,16,17,29,30|7:7,8,15,17|8:15,16,23,24|9:23,25|10:23|11:42,43|12:42,44|13:42|16:31,32,33|17:31|18:32'
}


window.onload = function(){

    var controller = null;
    //Auto set blockWidth
    blockWidth = Math.min(document.body.clientWidth-40,maxSenceWidth) / gameBoardWidth;
    window.onresize = function(){
        blockWidth = Math.min(document.body.clientWidth-40,maxSenceWidth) / gameBoardWidth;
        controller.reqNotify();
    }

    
    var buttons = {
        clear: function(){
            if(controller!=null)
                controller.close();
            controller = initGame(gameBoardWidth,function(gameBoard){reDraw(gameBoard)});
            document.getElementById('start').onclick = controller.start;
            document.getElementById('stop').onclick = controller.stop;
            document.getElementById('step').onclick = controller.step;
        },
        random: function(){
            controller.setGameBoard(random2DimBooleanArray(gameBoardWidth));
        },
        export: function(){
            var exportData = export2DimBooleanArray(controller.getGameBoard());
            var exportDataTargetElement = document.getElementById('export-data');
            exportDataTargetElement.value = exportData;
        },
        import: function(){
            var exportDataTargetElement = document.getElementById('export-data');
            var board = importTo2DimBooleanArray(exportDataTargetElement.value);
            if(board)
                controller.setGameBoard(board);
            else
                alert('导入的数据不正确');    
        },
        about: function(){
            alert('嗯，这是个不怎么会写前端的人写的东西\n\n更新日志：\n\t1. 适配不同屏幕\n\t2. 更新导入导出数据的格式，长度减少50%\n\t3. 修复在夸克、IE、小米等浏览器上画面不渲染的问题');
        },
        tutorial: function(){
            window.open('https://lilpig.site/post/other-gameoflife');
        }
    }




    //Bind onclick callback to the button
    Object.keys(buttons).forEach(function(id){
        document.getElementById(id).onclick = buttons[id];
    });


    //Call clear to init canvas
    buttons.clear();

    var preinstallSelect = document.getElementById('preinstall');
    preinstallSelect.onchange = function(ev){
        var data = preinstallDatas[ev.target.value]
        if(data){
            var board = importTo2DimBooleanArray(data);
            controller.setGameBoard(board);
        }
    }


    // Game board touch
    var canvas = document.getElementById('game_board');
    var isPressed = false;
    var lastState = null;

    function changePoint(isMove,ev){
        var j = parseInt(ev.offsetX / blockWidth),
            i = parseInt(ev.offsetY / blockWidth);
        if(!isMove || (isPressed && !isEquals([i,j,controller.getPos(i,j)],lastState))){
            controller.changePoint(i,j);
            lastState = [i,j,controller.getPos(i,j)];
        }
    }

    canvas.onmousedown = function(ev){
        isPressed=true;
        changePoint(false,ev);
    };
    document.onmouseup = function(ev){isPressed = false};
    canvas.onmousemove = function(ev){
        changePoint(true,ev);
    };

    function isEquals(last,curr){
        return last[0]==curr[0] && last[1]==curr[1] && last[2]==curr[2];
    }
}