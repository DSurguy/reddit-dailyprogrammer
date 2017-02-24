var hangingParens = require('./hangingParens.js');

function testSuite(tests, label){
    console.log('== SUITE: '+label+' ==');
    var result, erro;
    for( var i=0; i<tests.length; i++ ){
        result = undefined;
        var error = undefined;
        try{
            result = hangingParens(tests[i].in);
        } catch (e){
            error = e.stack;
        } finally {
            console.log(result == tests[i].out ? 'Pass': '\u001b[31mFail\u001b[39m');
            console.log('  Expected \''+tests[i].in+'\' -> \''+tests[i].out+'\'');
            if( error ){
                console.log('    Result: '+error);
            }
            else{
                console.log('    Result: \''+result+'\'');
            }
        }
    }
}

var tests = [
    {in: ")(asdf)))", out: "*)*(asdf)))"},
    {in: "((((asdf)))", out: "*(*(((asdf)))"},
    {in: "((((asdf))", out: "(*(*((asdf))"},
    {in: "(ab)((cd)(asdf)))", out: "(ab)((cd)(asdf))*)*"},
    {in: "(ab)((cd)(asdf)())", out: "(ab)((cd)(asdf)())"},
    {in: "(ab)(((cd)(asdf)", out: "(ab)(*(*(cd)(asdf)"},
    {in: "(ab)(((cd)(asdf", out: "(ab)((*(*cd)(asdf"},
    {in: "(ab)(((cd)(asdf)))))", out: "(ab)(((cd)(asdf)))*)*)"}
];

testSuite(tests, 'Base Tests');