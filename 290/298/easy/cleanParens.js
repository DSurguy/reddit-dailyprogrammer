function cleanParens(input){
    var open = [],
        close = [],
        clone = input.split('');
    
    for( var i=0; i<input.length; i++ ){
        if( input[i] == '(' ){
            open.push(i);
            close.length = open.length;
        }
        else if( input[i] == ')' ){
            for( var j=close.length-1; j>=0; j-- ){
                if( close[j] === undefined ){
                    close[j] = i;
                    break;
                }
            }
        }
    }

    for( var i=0; i<open.length; i++ ){
        if( close[i] == open[i]+1 ){
            //empty paren, omit it
            clone[open[i]] = undefined;
            clone[close[i]] = undefined;
        }
        else if( open[i]+1 == open[i+1] && close[i]-1 == close[i+1] ){
            //extra paren, omit it
            clone[open[i]] = undefined;
            clone[close[i]] = undefined;
        }
    }

    return clone.filter(function (char){return !!char}).join('');
};
module.exports = cleanParens;