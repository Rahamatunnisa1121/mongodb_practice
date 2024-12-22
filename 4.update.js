//Update: Modifies specific fields in a document without replacing the entire document.

//to update one document
//The $set operator in MongoDB is versatile and can both add new fields and update existing fields in a document
db.inventory.updateOne({
    item:"paper"
},{
    $set:{"size.uom":"cm",status:"p"},
    $currentDate:{lastModified:true}
    //uses the $currentDate operator to update the value of the lastModified field to the current date
});
//If lastModified field does not exist, $currentDate will create the field.


//Atomicity
// If this update is executed, both fields (status and size.uom) will be updated together.
// If the update fails midway (e.g., due to a crash), neither field will be updated, ensuring consistency.

//to updateMany
db.inventory.updateMany({
    // item:"paper"
    qty:{$lt:50}
},{
    $set:{'size.uom':"in",status:'p'},
    $currentDate:{lastModified:true}
});

//if we want to remove specific fields of the document
//to remove the fields, the set value provided for unset operator to either "" or null

db.inventory.updateMany({
    qty:{$lt:50}
},{
    $unset:{'lastModified':""}
});
//same for updateOne and for multiple fields in the $unset

//Atomicity in UpdateMany()
//When a single write operation (e.g. db.collection.updateMany()) modifies multiple documents, 
//the modification of each document is atomic, but the operation as a whole is not atomic.
//Each document modified is treated as an independent atomic operation.

//we can use transactions to overcome this issue


//findAndModify -> deprecated now
db.inventory.findAndModify({
    query:{status:"P"},
    update:{$set:{status:"Processed"}},
    new:true //return new document
});
//to find and update one document(first matched doc) 
//to update multiple use updateMany() simply
//Modification->update

db.inventory.findAndModify({
    query:{status:"A"},
    remove:true
});
//to remove the matched doc
//modification->remove


db.collection.findOneAndUpdate({ 
    employeeId: 123 
},{ 
    $set: { status: 'inactive' } 
},{ 
    returnDocument: 'after' 
});
//if the third doc returnDocument is set to after, the updated or the replaced doc after the modification is returned
//if it is set to before, or id not set(default), the document before the updation or replacement is returned.

//using aggregations [] -> for collection of objects -> set, replaceRoot, etc
db.students.updateOne({
    test1:95
},[
    {$set:{test3:98,modified:"$$NOW"}}
]);
//operation must use the aggregation pipeline [...] because we are using system varibale $$NOW, and to dynamically compute its value
// system variable $$NOW is for the current datetime

db.students.updateMany({//targets all docs in student
},[
    {$replaceRoot:{
        newRoot:{
            $mergeObjects:[
                {quiz1:0,quiz2:0,test1:0,test2:0},
                "$$ROOT"
            ]
        }
    }},
    {$set:{modified:"$$NOW"}}
]);
//The $$ROOT system variable represents the entire document as it exists at that stage of the pipeline.
//$mergeObjects -> Combines multiple objects into one. Later objects override fields from earlier objects if there are conflicts.
//$replaceRoot, $set, these are aggregation pipeline stages
//newRoot is user-defined field or key, so no prefix

db.students.updateMany({
},[
    {$set:{average:{$trunc:[{$avg:"$tests"},0]},modified:"$$NOW"}},
    {$set:{grade:{$switch:{
        branches:[
            {case:{$gte:["average",90]}, then:"A"},
            {case:{$gte:["average",80]}, then:"B"},
            {case:{$gte:["average",70]}, then:"C"},
            {case:{$gte:["average",60]}, then:"D"},
            {case:{$gte:["average",50]}, then:"E"}
        ],
        default:"F"
    }}}}
]);

db.students.updateMany({
},[
    {$set:{average:{$trunc:[{$avg:"$tests"},0]},modified:"$$NOW"}},
    {$set:{grade:{$switch:{
        branches:[
            {case:{$and:[{$ne:["average",null]},{$gte:["average",90]}]},then:"A"},
            {case:{$and:[{$ne:["average",null]},{$gte:["average",80]}]},then:"B"},
            {case:{$and:[{$ne:["average",null]},{$gte:["average",70]}]},then:"C"},
            {case:{$and:[{$ne:["average",null]},{$gte:["average",60]}]},then:"D"},
            {case:{$and:[{$ne:["average",null]},{$gte:["average",50]}]},then:"E"},
        ],
        default:"F"
    }}}}
]);
//$trunc in MongoDB is an aggregation operator that truncates a number to its integer part or to a specified number of decimal places.

db.students.updateOne({
    quizzes:[5]
},[{
    $set:{quizzes:{$concatArrays:["$quizzes",[8,6]]}}
}]);
//$concatArrays aggregation operator to append elements to the existing quizzes array in the document

db.temperatures.updateMany({
},[
    {$addFields:{"tempF":{
        $map:{
            input:"$tempsC",
            as:"celsiusTemp",
            in:{$add:[{$multiply:["$$celsiusTemp",9/5]},32]}
        }
    }}}
]);
//$addFileds to explicitly add the fields in the document while updating
//$set to both add or update