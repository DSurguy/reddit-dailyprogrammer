var fs = require('fs');

var dictionaryCache = undefined;

var scrabble = function(tiles, word){
    //convert tiles to an array if it is not and count the tiles
    var tileCount = getTileCounts(tiles);
    //reduce tile counts until we make the word or run out.
    for( var i=0; i<word.length; i++ ){
        //check and decrement
        if( !tileCount[word[i]] ){
            //see if we can use a wildcard
            if( !tileCount['?'] ){
                //can't make the word, no wildcards to use
                return false;
            }
            else{
                tileCount['?']--;
            }
        } else {
            tileCount[word[i]]--;
        }
    }
    return true;
};
var longest = function (tiles){
    return new Promise((resolve, reject)=>{
        buildDictionaryCache()
        .then(()=>{
            var tileCount = getTileCounts(tiles);
            var checkedPaths = {};
        }).catch((err)=>{
            throw err;
        });
    });
};
var buildDictionaryCache = function (){
    return new Promise((resolve, reject)=>{
        if( !dictionaryCache ){
            dictionaryCache = {};
            var curPath = dictionaryCache,
                rs = fs.createReadStream('./enable1.txt', {
                    encoding: 'utf8'
                });
            rs.on('readable', ()=>{
                var chunk;
                while((chunk = rs.read(1)) != null){
                    if( chunk.match(/\r|\n/g) ){
                        //newline, we need to start over
                        curPath = dictionaryCache;
                    }
                    else{
                        if( !curPath[chunk] ){
                            //add the character to the path and update reference
                            curPath[chunk] = {};
                        }
                        curPath = curPath[chunk];
                    }
                }
            });
            rs.on('end', ()=>{
                resolve();
            });
            rs.on('error', (err)=>{
                reject(err);
            });
        }
        else{
            resolve();
        }
    });
};
var getTileCounts = function (tiles){
    return Array.prototype.slice.call(tiles).reduce(function (counts, tile){
        counts[tile] = (counts[tile]||0)+1;
        return counts;
    }, {});
}

module.exports = {scrabble:scrabble, longest:longest};