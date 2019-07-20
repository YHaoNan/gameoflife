
function genFalseBoard(len){
    var result = [];
    for(var i=0;i<len;i++){
        var tmpList = []
        for(var j=0;j<len;j++)
            tmpList.push(false);
        result.push(tmpList);
    }
    return result;
}
function clone2DimArray(from){
    var result = [];
    for(var i=0;i<from.length;i++){
        var tmpList = [];
        for(var j=0;j<from[i].length;j++){
            tmpList.push(from[i][j]);
        }
        result.push(tmpList);
    }
    return result;
}
function random2DimBooleanArray(width){
    var result = [];
    for(var i=0;i<width;i++){
        var tmpList = [];
        for(var j=0;j<width;j++){
            tmpList.push(Math.random()>0.7?true:false);
        }
        result.push(tmpList);
    }
    return result;
}
function export2DimBooleanArray(array){
    var width = array.length;
    var str = width;
    var currentLineHasData = false;
    for(var i=0;i<width;i++){
        for(var j=0;j<width;j++){
            if(j==0)currentLineHasData=false;
            var bol = array[i][j];
            if(bol){
                if(!currentLineHasData){
                    currentLineHasData = true;
                    str+='|'+i+':';
                }
                if(str.charAt(str.length-1)!=':')str+=',';
                str+=j;
            }
        }
    }
    return str;
}
function importTo2DimBooleanArray(str){
    try{
        var arr = str.split('|');
        var width = parseInt(arr[0]);
        var result = genFalseBoard(width);
        for(var i=1;i<arr.length;i++){
            var lineAndData = arr[i].split(':');
            var line = parseInt(lineAndData[0]),
                data = lineAndData[1].split(',');
                // data = lineAndData[1].split(',').map(nb=>parseInt(nb));
            for(var j=0;j<data.length;j++){
                result[line][parseInt(data[j])] = true;
            }
        }
        return result;
    }catch(e){
        console.log(e);
        return null;
    }
    
}
function export2DimBooleanArrayDep(array){
    var width = array.length;
    var str = width;
    for(var i=0;i<width;i++){
        for(var j=0;j<width;j++){
            var bol = array[i][j];
            if(bol) str+='|'+i+','+j;            
        }
    }
    return str;
}
function importTo2DimBooleanArrayDep(str){
    try{
        var arr = str.split('|');
        var width = parseInt(arr[0]);
        var result = genFalseBoard(width);
        for(var i=1;i<arr.length;i++){
            var pos = arr[i].split(',');
            var x = parseInt(pos[0]),
                y = parseInt(pos[1]);
            result[x][y] = true;
        }
        return result;
    }catch(e){
        return null;
    }
}