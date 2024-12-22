//db refers to the database that is in use

db.inventory.insertOne(
    {
        item:'canvas',
        qty:100,
        tags:['cotton'],
        size:{h:28, w:35.3, uom:'cm'}
    }
);

//if _id is not specified, the Node.js driver adds the _id field with an ObjectId value

async function insertData(){
    //allows asynchronous operations to be performed synchronously 
    await db.inventory.insertOne(
        {
            item:'pen',
            qty:100,
            tags:['blue','black'],
            size:{h:10,w:5,uom:'cm'}
        }
    );
};

insertData().catch(console.error);

db.inventory.insertOne(
    {
        item: 'candy',
        qty: 100,
        tags: ['food']
    }, 
    //callback function
    function(err, res) {
        if (err) throw err;
        console.log("Document inserted");
    }
);
//the callback function that handles the result of the insertion

db.inventory.insertMany(
    [
        {
            item:'canvas1',
            qty:10,
            tags:['cotton'],
        },
        {
            item:'canvas2',
            qty:20,
            tags:['copper'],
            size:{h:28, w:35.3, uom:'cm'}
        },
        {
            item:'canvas3',
            qty:30,
            tags:['silk'],
        },
        {
            item:'canvas4',
            qty:40,
            tags:['aluminium'],
            size:{h:28, w:35.3, uom:'cm'}
        },
        {
            item:'canvas5',
            qty:50,
        }
    ]
);


