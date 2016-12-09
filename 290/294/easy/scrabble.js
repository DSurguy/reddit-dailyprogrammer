module.exports = function scrabble(tiles, word){
    //convert tiles to an array if it is not and count the tiles
    var tileCount = Array.prototype.slice.call(tiles).reduce(function (counts, tile){
        counts[tile] = (counts[tile]||0)+1;
        return counts;
    }, {});
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