//Replace:Completely overwrites the existing document with a new one, except for the _id field.

//To replace the entire content of a document except for the _id field, 
//pass an entirely new document as the second argument to db.collection.replaceOne().
//The replacement cannot include update operators expressions.
//In the replacement document, you can omit the _id field since the _id field is immutable
//if you do include the _id field, it must have the same value as the current value.

db.inventory.replaceOne({
    item:"canvas"
},{
    item:"canva",
    instock:[{warehouse:"A",qty:60},{warehouse:"B",qty:100}]
    //an array of objects
});
//the item:canvas, if found will be replaced

db.inventory.replaceOne({ 
    item: "canvas" 
},{ 
    item: "canva", 
    instock: [{ warehouse: "A", qty: 60 }, { warehouse: "B", qty: 100 }] /*an array of objects*/
},{
    upsert:true
});
//when upset(update+insert)is set to true in the third parameter, 
//If a matching document exists, it will be replaced with the new document.(update)
//If no matching document exists, a new document will be inserted using the provided data.(insert)

db.inventory.replaceOne({ 
    item: "canvas" 
},{ 
    item: "canva", 
    instock: [{ warehouse: "A", qty: 60 }, { warehouse: "B", qty: 100 }] /*an array of objects*/
},{
    w: "majority", 
    wtimeout: 100
});

//w: Specifies the level of acknowledgment required.
//"majority" ensures the operation is acknowledged by a majority of nodes in the replica set.

//wtimeout: Sets a timeout (in milliseconds) for the write concern. 
// If the specified acknowledgment is not received within this time, the operation fails with a timeout error.

//findOneAndReplace
db.collection.findOneAndReplace({ 
    employeeId: 123 
},{
    name: 'John Doe', 
    status: 'inactive' 
});