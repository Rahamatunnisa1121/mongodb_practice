db.products.find().sort({quantity:1});
//docs are sorted in A.O
//if quantity field is not found ->  then they eill be not sorted
//if some docs have quantity field, some dont , then the docs with no quantity field are placed first then the docs with quantity field are sorted in ao

db.products.find().sort({quantity:-1});
//-1 for d.o

db.students.find().sort({ grade: -1, name: 1 }); 
// Sort by grade (descending) and name (ascending)
//Primary Sort: Documents are first sorted by the grade field in descending order (-1).
//Secondary Sort: If two or more documents have the same grade value, they are further sorted by the name field in ascending order (1).

db.orders.find().sort({ "customer.age": 1 });
// Sort by customer's age in ascending order
//embedded or nested docs with ""

db.products.find().sort({ price: -1 }).limit(5) ;
// Top 5 expensive products

db.products.find().sort({ price: 1 }).skip(2);
// Skip first 2 products sorted by price

db.logs.find().sort({ $natural: -1 }); // Most recent logs first
//$natural refers to the order of documents as they appear on disk.

db.students.find().sort({ grade: -1 }).skip(2).limit(3);
// Skip 2 documents: Start from the 3rd document.
// Limit to 3 documents: Return the next 3 documents.
