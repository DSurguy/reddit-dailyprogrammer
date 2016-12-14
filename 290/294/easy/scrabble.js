var fs = require('fs'),
    _object = require('lodash/fp/object');
    

var dictionaryCache = undefined;

//build cache as a character tree for the recursive solution
function buildDictionaryTree(){
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
                        if( curPath !== dictionaryCache ){
                            //we're in a tile node and need to mark it as a terminus
                            curPath.terminus = true;
                        }
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
//build cache as a list for the iterative solution
function buildDictionaryList(){
    return new Promise((resolve, reject)=>{
        if( !dictionaryCache ){
            dictionaryCache = [];
            var rs = fs.createReadStream('./enable1.txt', {
                    encoding: 'utf8'
                });
            rs.on('readable', ()=>{
                var chunk,
                    word = '';
                while((chunk = rs.read(1)) != null){
                    if( chunk.match(/\r|\n/g) ){
                        if( word !== '' ){
                            dictionaryCache.push(word)
                        }
                        //newline, we need to start over
                        word = '';
                    }
                    else{
                        word += chunk;
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

//utility function to snag tile counts
function getTileCounts(tiles){
    return Array.prototype.slice.call(tiles).reduce(function (counts, tile){
        counts[tile] = (counts[tile]||0)+1;
        return counts;
    }, {});
}

//See if we can make {word} using {tiles}, including wildcards
function scrabble(tiles, word){
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

//recursive approach that does NOT use the existing scrabble solution
//Doesn't pass last test.
function longestRecursive(tiles){
    return new Promise((resolve, reject)=>{
        buildDictionaryTree()
        .then(()=>{
            resolve(getLongestWordA(getTileCounts(tiles),dictionaryCache));            
        }).catch((err)=>{
            reject(err);
        });
    });
};
function getLongestWordA(tileCounts, dictionaryNode){
    var word = undefined;
    //loop through all possible tiles
    for( var tile in tileCounts ){
        //Create updated tile counts to recurse with
        var updatedCounts = _object.assignIn({}, tileCounts);
            updatedCounts[tile]--;
        if( updatedCounts[tile] == 0 ){ delete updatedCounts[tile]; }

        if( tile == '?' ){
            //wildcard, we need to check ALL possible children
            for( var child in dictionaryNode ){
                //recursively build the longest child word
                var childLongest = getLongestWordA(updatedCounts, dictionaryNode[child]);
                //try to create a childWord based on terminus
                if( childLongest ){
                    childWord = child+childLongest;
                }
                else if( dictionaryNode[child].terminus ){
                    childWord = child;
                }

                //combine with tile and update current longest if possible
                if( !word || childWord.length > word.length ){
                    word = childWord;
                }
                //take the alphabetically lower result
                else if( childWord.length == word.length && childWord < word ){
                    word = childWord;
                }
            }
        }
        else if( dictionaryNode[tile] !== undefined ){
            //recursively build the longest child word
            var childLongest = getLongestWordA(updatedCounts, dictionaryNode[tile]),
                childWord = "";
            
            //try to create a childWord based on terminus
            if( childLongest ){
                childWord = tile+childLongest;
            }
            else if( dictionaryNode[tile].terminus ){
                childWord = tile;
            }

            //combine with tile and update current longest if possible
            if( !word || childWord.length > word.length ){
                word = childWord;
            }
            //take the alphabetically lower result
            else if( childWord.length == word.length && childWord < word ){
                word = childWord;
            }
        }
    }
    return word||undefined;
}

//iterative approach that uses the existing scrabble function
function longestReuseScrabble(tiles){
    return new Promise((resolve, reject)=>{
        buildDictionaryList()
        .then(()=>{
            resolve(getLongestWordB(tiles, dictionaryCache));
        }).catch((err)=>{
            reject(err);
        });
    });
};
function getLongestWordB(tiles, dictionaryList){
    var longest = '';
    for( var i=0; i<dictionaryList.length; i++ ){
        if( dictionaryList[i].length > longest.length && scrabble(tiles, dictionaryList[i]) ){
            longest = dictionaryList[i];
        }
    }
    return longest;
};

module.exports = {
    scrabble:scrabble,
    longest:longestReuseScrabble,
    buildDictionaryCache: buildDictionaryList
};