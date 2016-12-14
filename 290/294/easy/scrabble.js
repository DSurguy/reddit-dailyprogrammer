var fs = require('fs');
    //was included for extend, maintaining to quickly reopen recursive solution 
    //_object = require('lodash/fp/object');

var dictionaryCache = undefined,
    pointValues = {
        a: 1,
        b: 3,
        c: 3,
        d: 2,
        e: 1,
        f: 2,
        g: 2,
        h: 4,
        i: 1,
        j: 8,
        k: 5,
        l: 1,
        m: 3,
        n: 1,
        o: 1,
        p: 3,
        q: 10,
        r: 1,
        s: 1,
        t: 1,
        u: 1,
        v: 4,
        w: 4,
        x: 8,
        y: 4,
        z: 10,
        '?': 0
    };

//build cache as a character tree for the recursive solution
/*function buildDictionaryTree(){
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
};*/

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

//return points value of a {word} if it can be made using given {tiles}, including wildcards
//return -1 if not possible
function scrabblePoints(tiles, word){
    var tileCount = getTileCounts(tiles),
        points = 0;
    //reduce tile counts until we make the word or run out.
    for( var i=0; i<word.length; i++ ){
        //check and decrement
        if( !tileCount[word[i]] ){
            //see if we can use a wildcard
            if( !tileCount['?'] ){
                //can't make the word, no wildcards to use
                return -1;
            }
            else{
                tileCount['?']--;
            }
        } else {
            tileCount[word[i]]--;
            points += pointValues[word[i]];
        }
    }
    return points;
}

//recursive approach that does NOT use the existing scrabble solution
//Doesn't pass last test. Saving for posterity.
/*function longestRecursive(tiles){
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
}*/

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

//Return highest value word that can be created using given {tiles}
function highest(tiles){
    return new Promise((resolve, reject)=>{
        buildDictionaryList()
        .then(()=>{
            resolve(getHighest(tiles, dictionaryCache));
        }).catch((err)=>{
            reject(err);
        });
    });
}
function getHighest(tiles, dictionaryList){
    var points = 0,
        word = '';
    for( var i=0; i<dictionaryList.length; i++ ){
        var newWordPoints = scrabblePoints(tiles, dictionaryList[i]);
        if( newWordPoints > points ){
            word = dictionaryList[i];
            points = newWordPoints;
        }
    }
    return word;
};

module.exports = {
    scrabble:scrabble,
    longest:longestReuseScrabble,
    buildDictionaryCache: buildDictionaryList, //export to make tests run faster
    highest: highest,
    scrabblePoints: scrabblePoints //export to print values if necessary
};