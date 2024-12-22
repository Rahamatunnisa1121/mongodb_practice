//to get the medium sized pizza's names and their quantities respectively

db.orders.aggregate([//array of stages->objects
    //stage1
    {
        $match:{size:"medium"}
    },
    //grouping all medium sized pizzas by name and  cal their quantity
    {
        $group:{_id:"$name",totalQuantity:{$sum:"$quantity"}}
    }
]);

//to calculate total order value and average order quantity
db.orders.aggregate([
    {
        //ISODate object to convert the string into date object
        $match:{date:{$gte:new ISODate("2020-01-30"),$lt:new ISODate("2022-01-30")}}
        //as the date field consists of date objects, the string is being converted into date object to match the vl=alue stored
    },
    {
        $group:{
            _id:{$dateToString:{format:"%Y-%m-%d",date:"$date"}},
            //the date objects stored in date field are being retrieved and printed as strings using the dateToString aggregation operator in the sepcified format.
            //%Y-%m-%d formats a date into the YYYY-MM-DD format,
            totalOrderValue:{$sum:{$multiply:["$price","$quantity"]}},
            averageOrderQuantity:{$avg:"$quantity"}
        }
    },
    {
        $sort:{totalOrderValue:-1}
    }
]);

//nested fields -> surfaceTemperatureC: { min: null, max: null, mean: -197.2 }
db.planets.aggregate([
    {
        $project:{
            nested_field:"$surfaceTemperatureC.mean"
        }
    }
]);

//array of nested fields -> instock: [ { warehouse: "A"}, { warehouse: "C" } ]
db.products.aggregate([
    {
        $project:{
            item:1, //projects the item field
            warehouses:"$instock.warehouse"
        }
    }
]);
//warehouses: [ "A", "C" ]

//array of nested arrays -> inventory: [ {apples: ["macintosh","golden delicious",]} , {oranges: ["mandarin",]}, {apples:[..]}.... ]
db.fruits.aggregate([
    {
        $project:{
            all_apple_types:"$inventory.apples"
        }
    }
]);
// all_apple_types: [
//     ['macintosh','golden delicious'],
//     ['braeburn','honeycrisp']
// ]       

//redact field -> dynamic and hierarchical filtering
//{
//     "title": "Document 1",
//     "sensitive": true,
//     "content": "Important data"
//  }
db.collection.aggregate([
    {
        $redact:{
            $cond:{
                if:{$eq:["$sensitive",true]},
                then:"$$PRUNE", //delete
                else:"$$KEEP"
            }
        }
    }
]);

//{
//    "title": "Document 2",
//    "sections": [
//       { "name": "Public Section", "access": "public" },
//       { "name": "Private Section", "access": "private" }
//    ]
// }

db.collection.aggregate([
    {
        $redact:{
            $cond:{
                if:{$eq:["$access","public"]},
                then:"$$KEEP",
                else:"$$PRUNE"
            }
        }
    }
]);

//similarly, another expresion $$DESEND
//Retains the current document and further evaluates its sub-documents or nested fields.