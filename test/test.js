var superagent = require('superagent')
var expect = require('chai').expect
const config = require('../../config/environment');

describe('express rest api server', function(){
  var id

  it('post object', function(done){
    let test = { name: 'John'
        , email: 'john@rpjs.co'
      }
    superagent.post('http://localhost:8000/api/collections/test')
      .send()
      .end(function(e,res){
        expect(e).to.eql(null)
        
        expect(res.body.result).to.deep.equal({ ok: 1, n: 1 })


        id = res.body.ops[0]._id
        done()

      })    
  })

  it('retrieves an object', function(done){
    superagent.get('http://localhost:8000/api/collections/test/'+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get('http://localhost:8000/api/collections/test')
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item){return item._id})).to.contain(id)        
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put('http://localhost:8000/api/collections/test/'+id)
      .send({name: 'Peter'
        , email: 'peter@yahoo.com'})
      .end(function(e, res){
        //console.log('update error -> ', e)
        expect(res.body).to.deep.equal({ n: 1, nModified: 1, ok: 1 })
        done()
      })
  })

  it('checks an updated object', function(done){
    superagent.get('http://localhost:8000/api/collections/test/'+id)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)        
        expect(res.body._id).to.eql(id)        
        expect(res.body.name).to.eql('Peter')        
        done()
      })
  })    

  it('removes an object', function(done){
    superagent.del('http://localhost:8000/api/collections/test/'+id)
      .end(function(e, res){
        expect(res.body).to.deep.equal({ ok: 1, n: 1 })
        done()
      })
  })      

})
