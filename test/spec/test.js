(function () {
  'use strict';

  describe('One silly passing test', function () {
    it('should run here few assertions', function () {
      // expect(foo).to.equal('bar');
      // assert.equal(1 * 1 == 2, false);
      // assert.
      assert.equal(-1, [1,2,3].indexOf(4));
      // throw new Error('fail');
    });
  });

  describe('Funky little monkey', function(){
    it('should return a monkey', function(){
      var testMonkey = monkey();
      expect(testMonkey).to.equal('monkey');
    });
  });
  
})();
