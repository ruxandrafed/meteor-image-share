Images = new Mongo.Collection("images");

// set up security on Images collection
Images.allow({
  insert: function(userId, doc) {
    console.log("testing security on image insert");
    if (Meteor.user()) {
      // console.log(doc);
      // force the image to be owned by the user
      doc.createdBy = userId;
      // if (userId != doc.createdBy) {
      //   return false;
      // } else {
        // return true;
      // }
      return true;
    } else {
      return false;
    }
  },
  remove: function(userId, doc) {
    return true;
  }
})


// if (Meteor.isClient) {
// }

// if (Meteor.isServer) {
// }
