Images = new Mongo.Collection("images");

if (Meteor.isClient) {

  $(window).scroll(function(event) {
    console.log(new Date());
  })

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  Template.images.helpers({
    // images: Images.find({}, {sort: {createdOn: -1, rating:-1}}),
    images: function() {
      if (Session.get("userFilter")) {
        return Images.find({createdBy: Session.get("userFilter")}, {sort: {createdOn: -1, rating:-1}});
      } else {
        return Images.find({}, {sort: {createdOn: -1, rating:-1}});
      }
    },
    filtering_images: function() {
      if (Session.get("userFilter")) {
        return true;
      } else {
        return false;
      }
    },
    getFilterUser: function(user_id) {
      if (Session.get("userFilter")) {
        var user = Meteor.users.findOne({_id: Session.get("userFilter")});
        return user.username;
      }
    },
    getUser: function(user_id) {
      var user = Meteor.users.findOne({_id: user_id});
      if (user) {
        return user.username;
      }
      return "anonymous";
    }
  });

  Template.body.helpers({ username: function() {
    if (Meteor.user()) {
      let username = Meteor.user().username;
      return username;
    } else {
      return "guest";
    }
  } });

  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css('width', '100px');
    },
    'click .js-del-image': function(event) {
      var image_id = this._id;
      $("#"+image_id).hide('slow', function() {
        Images.remove({_id: image_id});
      })
    },
    'click .js-rate-image': function(event) {
      var rating = $(event.currentTarget).data("userrating");
      var image_id = this.id;
      Images.update({_id: image_id}, {$set: {rating: rating}});
    },
    'click .js-show-image-form': function(event) {
      $("#image_add_form").modal('show');
    },
    'click .js-set-image-filter': function(event) {
      Session.set("userFilter", this.createdBy);
    },
    'click .js-unset-image-filter': function(event) {
      Session.set("userFilter", undefined);
    }
  })
  Template.image_add_form.events({
    'submit .js-add-image': function(event) {
      var img_src, img_alt, createdBy;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;

      if (Meteor.user()) {
        Images.insert({
          img_src: img_src,
          img_alt: img_alt,
          createdOn: new Date(),
          createdBy: Meteor.user()._id
        });
      }

      $("#image_add_form").modal('hide');
      return false;
    }
  });
}

if (Meteor.isServer) {
  // console.log("I am the server");
}
