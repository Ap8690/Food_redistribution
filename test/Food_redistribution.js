const { assert } = require('chai');

const Food_redistribution = artifacts.require('./Food_redistribution.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Food_redistribution',([deployer, user]) => {
  let food_redistribution

   before(async () => {
     food_redistribution = await Food_redistribution.deployed()
   })

   describe('deployment', async ()=> {
       it('deployes successfully', async ()=>{
           const address = await food_redistribution.address
           assert.notEqual(address, 0x0)
           assert.notEqual(address, '')
		       assert.notEqual(address, null)
		       assert.notEqual(address, undefined)
        })

        it('has a name', async ()=> {
            const name = await food_redistribution.name()
            assert.equal(name, 'Food waste Redistribution')
        })
   })

   describe('user', async ()=>{
     let result, userCount

     before(async ()=>{
       result = await food_redistribution.createUser('Ajaypal singh', 'pipar road', [8,6,9,0,2,5,8,1,6,2], { from: user})
       userCount = await food_redistribution.userCount()
     })

     it('creates user', async ()=>{
       const event = result.logs[0].args
       assert.equal(event.userId.toNumber(), userCount.toNumber(), 'id is correct')
       assert.equal(event.userName, 'Ajaypal singh', 'user name is correct')
       assert.equal(event.Address, 'pipar road', 'Address is correct')
       assert.equal(event.phone_no.toString(), [8,6,9,0,2,5,8,1,6,2], 'phone number is correct')
       assert.equal(event.user, user, 'user is right')
     })
   })

   describe('super admin',async()=>{
     let result

     before(async()=>{
       result = await food_redistribution.createAdmin({from: deployer})
     })

     it('creates admin', async ()=>{
       const event = result.logs[0].args
       assert.equal(event.admin, deployer, 'It is super admin')
     })

     it('allows user to tip posts', async () =>{
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(deployer)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await food_redistribution.tip_us({from: user, value: web3.utils.toWei('1', 'Ether')})

      const event = result.logs[0].args
      assert.equal(event.donate_tip, '1000000000000000000','tip amount is correct')
      assert.equal(event.admin, deployer,'Holder is correct')

      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(deployer)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let donate_tip
      donate_tip = await web3.utils.toWei('1', 'Ether')
      donate_tip = new web3.utils.BN(donate_tip)

      const expectedBalance = oldAuthorBalance.add(donate_tip)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
    })
   })

   describe('posts', async ()=>{
     let result, donorCount

     before( async ()=>{
       result = await food_redistribution.createDonorPost('fruit', 'Apple', 'C:\Users\LENOVO\OneDrive\Pictures\scsh.png', 40, 48, '6am', '9am',{ from: user})
       donorCount = await food_redistribution.donorCount()
     })

     it('creates post', async ()=>{
       const event = result.logs[0].args
       assert.equal(event.id.toNumber(),donorCount.toNumber(),'id is correct')
       assert.equal(event.food_type, 'fruit', 'type of food is correct')
       assert.equal(event.food_name, 'Apple','food name is correct')
       assert.equal(event.image, 'C:\Users\LENOVO\OneDrive\Pictures\scsh.png','image is correct')
       assert.equal(event.pick_up_time_from, '6am', 'starting time is correct')
       assert.equal(event.pick_up_time_to, '9am', 'end time is correct')
       assert.equal(event.donor, user, 'donor is correct')
     })
     it('lists posts', async ()=>{
       const post = await food_redistribution.donorPosts(donorCount)
       assert.equal(post.id.toNumber(),donorCount.toNumber(),'id is correct')
       assert.equal(post.food_type, 'fruit', 'type of food is correct')
       assert.equal(post.food_name, 'Apple','food name is correct')
       assert.equal(post.image, 'C:\Users\LENOVO\OneDrive\Pictures\scsh.png','image is correct')
       assert.equal(post.pick_up_time_from, '6am', 'starting time is correct')
       assert.equal(post.pick_up_time_to, '9am', 'end time is correct')
       assert.equal(post.donor, user, 'donor is correct')
     })
   })
})