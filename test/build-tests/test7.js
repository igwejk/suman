/**
 * Created by denman on 1/2/2016.
 */



const Test = require('../../lib').init(module, {
    export: true, //module.exports.wait = false;
    integrants: ['smartconnect', 'dolce-vida']
});


Test.describe('BBB', {parallel: true}, function (fs) {


    this.before(ctn => {
        ctn();
    });

    this.beforeEach((t, ctn) => {

        ctn('poop');

    });


    this.context('1', {efa: true}, function () {

        this.before((done) => {

            setTimeout(function () {
                done();
            }, 10);

        });

        this.test('[test] yo 1', {parallel: true}, (t, fail, done, pass) => {

            fs.createReadStream('/dev/null').pipe(fs.createWriteStream('/dev/null')).on('error', fail).on('finish', pass);

        });


        this.test('[test] yo 2', {parallel: false}, function (t) {

            return new Promise(function (resolve, reject) {

                resolve();

            });

        });

        //this.it('[test] yo 2', {parallel: false}, new Promise(function (resolve, reject) {
        //
        //    Promise.delay(1000).then(function () {
        //        resolve();
        //    });
        //
        //}).then(function(){
        //
        //
        //
        //}));


        function p(val) {
            return new Promise(function (resolve) {
                resolve('doooog' + val);
            });
        }

        this.it('[test] gen', {parallel: false}, function*() {

            var t = yield 3;
            var val = yield p();
            val = yield p(val);

        });


        this.it('yo', {parallel: false}, (t, done) => {

            setTimeout(function () {
                done();
            }, 500);

        });

        this.it('chubs', {parallel: false}, (t, done) => {

            setTimeout(function () {
                done();
            }, 500);

        });

    });


    this.before(() => {

    });


});


/*


 Test.describe('BBB2', function () {


 this.before(() => {


 }).beforeEach(() => {


 });


 this.describe('1', {efa: true}, function () {

 this.before((done) => {

 setTimeout(function () {
 done();
 }, 10);
 });

 this.it('[test] yo', {parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 600);

 });

 this.it('yo', {parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 500);

 });

 this.it({parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 500);

 });


 });


 this.before(() => {

 });


 });


 Test.describe('BBB2', function () {


 this.before(() => {


 }).beforeEach(() => {


 });


 this.describe('1', {efa: true}, function () {

 this.before((done) => {

 setTimeout(function () {
 done();
 }, 10);
 });

 this.it('[test] yo', {parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 500);

 });

 this.it('yo', {parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 500);

 });

 this.it({parallel: false}, (t, done) => {

 setTimeout(function () {
 done();
 }, 500);

 });


 });


 this.before(() => {

 });


 });
 */



