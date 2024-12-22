db.inventory.deleteMany({});
//to delete all the documents from the collection

db.inventory.deleteMany({ status : "A" });
//based on a condition, deletes all matched docs

db.inventory.deleteOne({status:"P"});
//to delete the first matched doc

//  remove
//Removes multiple documents by default unless explicitly limited using { justOne: true }.
//Does not return detailed information about the operation.

db.inventory.remove({
    status:"C"
},{
    justOne:true
});

//remove is deprecated now

//findOneAndDelete -> to retrieve and delete in single operation
db.inventory.deleteOne({ 
    qty:100
});
//If you want to delete a single document and retrieve it before deletion:
//This will delete one document and return the deleted document.
//If no document matches the filter, it returns null.

// employees> db.inventory.findOneAndDelete({qty:100});

// {
//   _id: ObjectId('673fe1a751a5c9853f0d8195'),
//   item: 'paper',
//   qty: 100,
//   size: { h: 8.5, w: 11, uom: 'in' },
//   status: 'p',
//   lastModified: ISODate('2024-11-22T02:00:03.553Z')
// }