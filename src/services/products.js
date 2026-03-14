//Basic 'add product';
//Delete, Update, Access;

//Product visibility for store access;

//Add product image / Change Product Image;
const getAllProducts = async() => {
 try{
console.log('starting async query')
const result = await pool.query('SELECT NOW()')

console.log('async query finished')
console.log('starting callback query')

pool.query('SELECT NOW()', (err, res) => {
  console.log('callback query finished')
})
 
console.log('calling end')
await pool.end()

 }catch(e){

 } finally {

 }
}