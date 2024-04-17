import getRankedBooks from './API/pyAPI';

getRankedBooks('410000', ['1', '2', '3',"4","5","6"]).then(console.log).catch(console.error) // Promise { <pending> }