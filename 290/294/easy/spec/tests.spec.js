var scrabble = require('../scrabble.js');

describe('Basic Requirements', function (){
    // scrabble("ladilmy", "daily") -> true
    // scrabble("eerriin", "eerie") -> false
    // scrabble("orrpgma", "program") -> true
    // scrabble("orppgma", "program") -> false
    it('"ladilmy", "daily" -> true', function (){
        expect(scrabble("ladilmy", "daily")).toBe(true);
    });
    it('"eerriin", "eerie" -> false', function (){
        expect(scrabble("eerriin", "eerie")).toBe(false);
    });
    it('"orrpgma", "program" -> true', function (){
        expect(scrabble("orrpgma", "program")).toBe(true);
    });
    it('"orppgma", "program" -> false', function (){
        expect(scrabble("orppgma", "program")).toBe(false);
    });
});

describe('Wildcard', function (){
    // scrabble("pizza??", "pizzazz") -> true
    // scrabble("piizza?", "pizzazz") -> false
    // scrabble("a??????", "program") -> true
    // scrabble("b??????", "program") -> false

    it('"pizza??", "pizzazz" -> true', function (){
        expect(scrabble("pizza??", "pizzazz")).toBe(true);
    });
    it('"piizza?", "pizzazz" -> false', function (){
        expect(scrabble("piizza?", "pizzazz")).toBe(false);
    });
    it('"a??????", "program" -> true', function (){
        expect(scrabble("a??????", "program")).toBe(true);
    });
    it('"b??????", "program" -> false', function (){
        expect(scrabble("b??????", "program")).toBe(false);
    });
});

describe('Longest From Dictionary', function (){
    
});