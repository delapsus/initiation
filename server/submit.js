let Person = require('./data2/person');

exports.submitApplication = function(post) {

    // First create the people if needed
    if (post.data.personId === -1) {

    }
    else {
        // update the address if need be
    }

    if (post.data.sponsor1_personId === -1) {

        let person = Person.create({data:{
            firstName: post.data.sponsor1.firstName,
            middleName: post.data.sponsor1.middleName,
            lastName: post.data.sponsor1.lastName
        }});

        console.log('test')
    }

    if (post.data.sponsor2_personId === -1) {

    }

    // then save the initiation


    return Promise.resolve({});
};
