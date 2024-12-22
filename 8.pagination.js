db.products.find().skip(1);
//first doc is skipped -> remaining all are returned

db.products.find().limit(1);
//only one is returned -> first one

//skip and limit are used in pagination

//let us consider page size is 10 

//page 1 -> 1 to 10 docs
db.inventory.find().skip(0).limit(10);

//page 2 -> 11 to 20 docs
db.inventory.find().skip(10).limit(10);

//page 3 -> 21 to 30 docs
db.inventory.find().skip(20).limit(10);

//hence, the formula for skip and limit is
//skip( (page number - 1)*page size )
//limit(page size)