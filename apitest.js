let chai=require("chai")
let chaiHttp=require("chai-http")
// const { response } = require("./app");
chai.use(chaiHttp);
let should = chai.should()

describe("post the signup form for testcase",()=>{
    it("check the post response success for signup",(done)=>{
        let data={
            email:"cmmaran1999@gmail.com",
            password:"123456"
        }
        chai.request("http://localhost:3004/auth")
        .post("/signup")
        .send(data)
        .end((err, res) => {
            // should(res).have.status(200);
             (res).should.have.status(200);
            (res.body).should.be.a('object');
            (res.body).should.have.property("status").eql("success")
       });
       done()
    })
})


describe("login api call",()=>{
    it("check error n login api",(done)=>{
        let data={
            email:"cmmaran1999@gmail.com",
            password:"123456"
        }
        chai.request("http://localhost:3004/auth")
        .post("/login")
        .send(data)
        .end((err, res) => {
            (res).should.have.status(200);
            (res.body).should.be.a('object');
            (res.body).should.have.property("status").eql("success")
       });
       done()
    })
})



// describe("authorization api call with new user signin",()=>{
//     it("going to check authorization token and new signup sign in user",(done)=>{
//         let data={
//             email:"cmmaran1999@gmail.com",
//             password:"123456"
//         }
//         chai.request("http://localhost:3004/auth")
//         .post("/signup")
//         .send(data)
//         .end((err,res)=>{ 
//             (res).should.have.status(200);
//             (res.body).should.be.a('object');
//            (res.body).should.have.property("status").eql("success")
//            chai.request("http://localhost:3004/auth")
//            .post("/login")
//            .send(data)
//            .end((err,res)=>{
//            (res).should.have.status(200)
//            chai.request("http://localhost:3004/auth")
//            .get("/tourpages")
//            .set("x-access-token",res.body.message.token)
//            .end((err,res)=>{
//            })
//            })
//         })
//         done()
//     })
// })


