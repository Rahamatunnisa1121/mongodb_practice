db.inventory.find();//to fetch all documents

db.inventory.find({}); //this too fetch all docs

db.inventory.find({qty:10}); //select * from inventory where qty=10

db.inventory.find({
    qty:{$in:[10,20]}
});
//select * from inventory where qty IN (10,20);

db.inventory.find({
    qty:{$lt:30}
});
//lt stands for less than
//gt for greater than

db.inventory.find({
    item:"canvas1",
    qty:10
});
//implicity logical AND works here by default
//where "item":"canvas1" and qty:10

db.inventory.find({
    $or: [
        {item:"canvas1"},
        {qty:{$lt:30}}
    ]
});
//where item="canvas1" or qty<20;

db.inventory.find({
    item:"canvas1",
    $or:[
        {qty:{$lt:20}},
        {item:"canvas1"}
    ]
});
//AND and OR mixture

db.inventory.find({
    "size.uom":"cm"
});
//Query on Nested Field with Dot Notation
//"field.nestedField"

db.inventory.find({
    "size.h":{$gte:10}
});
//Specify Match using Query Operator
//gte->greater than or equal
//eq->equal
//ne->not equal
//in->in
//nin->not in

db.inventory.find({
    'size.h':{$lt:15},
    'size.uom':'cm',
});
//AND operation

db.inventory.find({
    size:{h:28,w:35.3,uom:"cm"}
});
//Match an Embedded/Nested Document

db.inventory.find({
    size:{w:35.3,h:28,uom:"cm"}
});
//no match -> order must be followed

//$all equivalent to and
db.inventory.find({
    tags:{$all:[['silk','cotton']]}
});
//field : { $all : [value1, value2]}
//where the value of a field is an array that contains all the specified elements.

//this all is equivalent to following and
db.inventory.find({
    $and:[
        {tags:['silk','cotton']}
    ]
});

//again it can be writeen as
db.inventory.find({
    tags:['silk','cotton']
});

//tags: [ [ "ssl", "security" ], ... ]

db.inventory.find({
    tags: { $all:['appliance','school','book']}
});
//to query the inventory collection for documents where the value of the tags field is an array whose elements include appliance, school, and book:
//no need of any order and extra content can be present

db.inventory.find({
    tags:['application','school','book']
});
//order and content should match

//$elemMatch is used to get a document where atleast one element in the array satisfies the criteria
//used with arrays
//is used with all

db.inventory.find({
    qty:{$all:[
        {$elemMatch:{size:"M",num:{$gt:50}}},
        {$elemMatch:{num:100,color:"green"}}
    ]}
});
//$all ensures that the qty array contains elements that satisfy each condition specified in the array.

//The $all operator ensures that both conditions are satisfied within the qty array:
// There must be at least one object in qty where size: "M" and num > 50.
// There must be at least one object in qty where num: 100 and color: "green"
db.inventory.find({
    $and:[
        {qty:{$elemMatch:{size:"M",num:{$gt:50}}}},
        {qty:{$elemMatch:{num:100,color:"green"}}}
    ]
});
//same using $and syntax
db.inventory.find({
    dim_cm:{$gt:15, $lt:20}
});
//multiple conditions

//$size is to get size of array
db.inventory.find({
    tags:{$size:3}
});
//to get size 3 tags in the documents

//to set a condition for size we cannot directly use $size:{$gt:2}
db.inventory.find({
    $expr:{$gt:[{$size:"$tags"},2]}
});

//order is imp
db.inventory.find({
    "instock":{warehouse:'A',qty:5}
});
//here instock is an array of objects
//matches a doc if one of the objects in the instock array matches exactly with { warehouse: 'A', qty: 5 }.

//for nested use ' '
db.inventory.find({
    'instock.qty':{$lt:20}
});
//even if one obj in the array instock matches the doc matches

db.inventory.find({
    'instock.0.qty':{$lte:20}
});
//0th index object should match the condition, no need of the otehr ones

//if atleast one object of the array instock matches, doc matches
db.inventory.find({
    instock:{$elemMatch:{qty:5,warehouse:'A'}}
});

//By default, queries in MongoDB return all fields in matching documents. To limit the amount of data that MongoDB sends to applications, you can include a projection document to specify or restrict fields to return.

//to return only id, item,status from tge matching doc
db.inventory.find({
    status:"A"
},{item:1,status:1});
//id comes by default

db.inventory.find({
    status:"A"
},{item:1,status:1,_id:0});
//for no id field in the output

//to exclude specific fields and get the other, set the excluded fields to 0
db.inventory.find({
    status:"A"
},{status:0,instock:0});

//to return specific fields in the embedded docs -> used nesting
db.inventory.find({
    status:"A"
},{item:1,status:1,"size.uom":1});

//similarly set to 0 to supress
db.inventory.find({
    status:"A"
},{"size.uom":0});

//MONGODB DOESNOT ALLOW INCLUSION AND EXCLUSION IN THE SAME PROJECTION DOCUMENT EXCEPT FOR _ID FIELD

//project spicific part of array using $slice operator
db.inventory.find({
    status:"A"
},{item:1,status:1,"instock":{$slice:-1}});

//cannot use indexing like "instock.0":1
//must use slice
//Positive $slice Value: Returns the first n elements of the array.
//-ve $slice Value: Returns the last n elements of the array.

db.inventory.find({
    item:null
});
//to find the docs with item as null or no item field

db.inventory.find({
    item:{$ne:null}
});
//item exist and not equal to NULL

//in bson -> type is 10 for null
db.inventory.find({
    item:{$type:10}
});
//item exists and set to null

//item doesnot exist completely
db.inventory.findOne({
    item:{$exists:false}
});

//maxTimeMs in millisecs
//s\pecifies a maximum execution time for a query. 
//If the query exceeds the specified time limit, MongoDB will stop the query and return an error.
db.inventory.find({
    qty:{
        $elemMatch:{size:"M",num:{$gt:50}},
        $elemMatch:{num:100,color:"green"}
    }
}).maxTimeMS(0);
//0 ms is maxTime

//aggregate
db.inventory.aggregate([
    {$match: {item:"apple"}},
    {$group:{_id:"$item",total:{$sum:1}}}
]);

//count by 1
db.inventory.aggregate([
    {$group:{_id:"$item",total:{$sum:1}}}
]);

//sum of a field after grouping
db.inventory.aggregate([
    {$group:{_id:"$item",total:{$sum:"$quantity"}}}
]);

//readconcern -> snapshot
db.inventory.aggregate([
    {$group:{_id:"$item",total:{$sum:"$quantity"}}}
],{readConcern:{level:"snapshot"}});
//It guarantees that all data read during the operation reflects a single, unchanging state of the database, 
// //even if other write operations are occurring concurrently.

//cursor
var myCursor=db.inventory.find({
    status:"D"
});
//ways to access
//1
myCursor;
//2.while loop-> next()
while(myCursor.hasNext())
{
    print(myCursor.next())
};
//3.for json format
while(myCursor.hasNext())
{
    print(JSON.stringify(myCursor.next()))
};
//4.else use
while (myCursor.hasNext()) {
    printjson(myCursor.next());
}
//5.forEach()
myCursor.forEach(printjson);

//toArray()
var documentArray=myCursor.toArray();
//documentArray
//documentArray[0]..

//shortcut for first calling toArray() then indexing
//accessing cursor through indexes
var myDoc=myCursor.toArray()[1];

