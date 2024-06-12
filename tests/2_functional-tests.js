const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings').puzzlesAndSolutions
chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST requests to /api/solve', () => {
        test('hanldle valid puzzle', function (done) {
            puzzles.forEach(str => {
                chai
                    .request(server)
                    .keepOpen()
                    .post('/api/solve')
                    .send({ puzzle: str[0] })
                    .end((err, res) => {
                        assert.isObject(res.body)
                        assert.property(res.body, 'solution')
                        assert.equal(res.body.solution, str[1])
                    })
            })
            done()
        })
        test('handle missing puzzle string', function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Required field missing')
                    done();
                })
        })
        test('handle puzzle with invalid characters', function (done) {
            const testStr1 = '..839.7.575.....964..1.../...16.29846.9.312.f..754.....62..5.78.8...3.2...492...1'
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: testStr1 })
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Invalid characters in puzzle')
                    done();
                })
        })
        test('handle puzzle with incorrect length', function (done) {
            const testStr2 = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...'
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: testStr2 })
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                    done();
                })
        })
        test('handle puzzle that cannot be solved', (done) => {
            const testStr3 = '1.5..2784..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            chai
                .request(server)
                .keepOpen()
                .post('/api/solve')
                .send({ puzzle: testStr3 })
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Puzzle cannot be solved')
                    done();
                })
        })
    })
    suite('POST requests to /api/check', () => {
        test('check placement with all fields', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'c4', value: '1'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'valid')
                    assert.isTrue(res.body.valid)
                    done()
                })
        })
        test('check placement with single placement conflict', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'f7', value: '2'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'valid')
                    assert.property(res.body, 'conflict')
                    assert.isArray(res.body.conflict)
                    assert.isFalse(res.body.valid)
                    assert.equal(res.body.conflict[0], 'row')
                    done()
                })
        })
        test('check placement with multipe placement conflicts', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'e6', value: '6'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'valid')
                    assert.property(res.body, 'conflict')
                    assert.isArray(res.body.conflict)
                    assert.isFalse(res.body.valid)
                    assert.equal(res.body.conflict.length, 2)
                    assert.include(res.body.conflict, 'row' )
                    assert.include(res.body.conflict, 'region')
                    done()
                })
        })
        test('check placement with all placement conflicts', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'c6', value: '4'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'valid')
                    assert.property(res.body, 'conflict')
                    assert.isArray(res.body.conflict)
                    assert.isFalse(res.body.valid)
                    assert.equal(res.body.conflict.length, 3)
                    assert.include(res.body.conflict, 'row' )
                    assert.include(res.body.conflict, 'region')
                    assert.include(res.body.conflict, 'column')
                    done()
                })
        })
        test('check placement with missing fields', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, value: '4'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Required field(s) missing')
                    done()
                })
        })
        test('check placement with invalid characters', (done) => {
            const testStr1 = '..839.7.575.....964..1.../...16.29846.9.312.f..754.....62..5.78.8...3.2...492...1'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr1, coordinate: 'c4', value: '4'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Invalid characters in puzzle')
                    done()
                })
        })
        test('check placement with incorrect length', (done) => {
            const testStr1 = '..839.7.575.....964..1....16.29846.9.312....754.....62..5.78.8...3.2...492...1'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr1, coordinate: 'c4', value: '4'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                    done()
                })
        })
        test('check placement with invalid coordinate', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'k4', value: '4'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Invalid coordinate')
                    done()
                })
        })
        test('check placement with invalid value', (done) => {
            const testStr4 = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            chai
                .request(server)
                .keepOpen()
                .post('/api/check')
                .send({puzzle: testStr4, coordinate: 'c4', value: '40'})
                .end((err, res) => {
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'Invalid value')
                    done()
                })
        })
    })
});

