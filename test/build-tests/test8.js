/**
 * Created by denman on 1/1/2016.
 */


const Test = require('../../lib').init(module, 'suman.conf.js');


Test.describe('gggg', function () {

    this.beforeEach(function (t, done) {
        done();
    });

    this.after(function (done) {
        done();
    });

    this.after(function (done) {
        done();
    });

    this.context(function () {

        this.after(function (done) {
            done();
        });

        this.beforeEach(function (t, done) {
            done();
        });


        this.describe('moodle', {
            parallel: true
        }, function () {

            this.after(function (done) {
                done();
            });

            this.beforeEach(function (t, done) {
                done();
            });


            this.it('mmm1', {parallel: false}, function (t, done) {
                done();
            });

            this.it('mmm2', {parallel: false}, function (t, done) {
                done();
            });

            this.it('mmm3', {parallel: false}, function (t, done) {
                done();
            });

            this.beforeEach(function (t, done) {
                done();
            });

            this.afterEach(function (t, done) {
                done();
            });


            this.after(function (done) {
                done();
            });


        });

        this.after(function (done) {
            done();
        });


    });

    this.before(function (done) {
        done();
    });


    this.it('7779999', {parallel: false, delay: 100}, function (t) {

        return new Promise(function (resolve) {
            resolve('0')
        });

    });

    this.after(function (done) {
        done();
    });
});