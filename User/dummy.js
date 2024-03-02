import prisma from './db.js';

// var res = await prisma.post.groupBy({
//     by: ['type'],
//     _sum: {
//         reportedCount: true, 
//     },
//  });

// console.log(res);
const res = await prisma.post.findMany({
    select:{
        likedBy: true,
        savedBy: true,
        viewedBy: true,
        type: true,
        tags: true,
        reportedCount: true,
    },
});

var mapper = {
    "General":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
        "TUITION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "BLOOD":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "DISCUSSION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "PRODUCT":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
    },
    "Batch":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
        "TUITION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "BLOOD":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "DISCUSSION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "PRODUCT":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
    },
    "Dept":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
        "TUITION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "BLOOD":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "DISCUSSION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "PRODUCT":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
    },
    "BatchDept":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
        "TUITION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "BLOOD":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "DISCUSSION":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
        "PRODUCT":{
            "likedBy":0,
            "savedBy":0,
            "viewedBy":0,
            "reportedCount":0,
        },
    },
    "TUITION":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
    },
    "BLOOD":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
    },
    "DISCUSSION":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
    },
    "PRODUCT":{
        "likedBy":0,
        "savedBy":0,
        "viewedBy":0,
        "reportedCount":0,
    },
}

res.map((post) => {
    mapper[post.type].likedBy += post.likedBy.length;
    mapper[post.type].savedBy += post.savedBy.length;
    mapper[post.type].viewedBy += post.viewedBy.length;
    mapper[post.type].reportedCount += post.reportedCount;
    //
    post.tags.map((tag) => {
        console.log(post.type,tag);
        mapper[post.type][tag].likedBy += post.likedBy.length;
        mapper[post.type][tag].savedBy += post.savedBy.length;
        mapper[post.type][tag].viewedBy += post.viewedBy.length;
        mapper[post.type][tag].reportedCount += post.reportedCount;

        mapper[tag].likedBy += post.likedBy.length;
        mapper[tag].savedBy += post.savedBy.length;
        mapper[tag].viewedBy += post.viewedBy.length;
        mapper[tag].reportedCount += post.reportedCount;
    });
    //
    return null;
}
);
console.log(mapper);


