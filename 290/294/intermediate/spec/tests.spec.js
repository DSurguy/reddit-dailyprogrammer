var scrabble = require('../scrabble.js');

describe('(prep) Dictionary Load', function (){
    beforeAll((done) => {
        scrabble.prep().then(done);
    });
    it('should calculate points and sort the list', function (){
        var dict = scrabble.getDictionary();
        expect(dict[0].points).not.toBe(undefined);
        expect(dict[0].points > dict[1].points).toBe(true);
    });
});