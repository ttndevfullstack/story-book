const moment = require('moment');

module.exports = {
    // FORMAT DATE
    formatDate: function (date, format) {
        return moment(date).utc().format(format);
    },
    // TRUNCATE STRING FROM TAGS
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' ';
          new_str = str.substr(0, len);
          new_str = str.substr(0, new_str.lastIndexOf(' '));
          new_str = new_str.length > 0 ? new_str : str.substr(0, len);
          return new_str + '...';
        }
        return str;
    },
    // STRIP STRING
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    // ADD EDIT ICON
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser.id.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
          } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
          }
        } else {
          return '';
        }
    },
    //SELECT STATUS
    select: function (selected, options) {
      return options
        .fn(this)
        .replace(
          new RegExp(' value="' + selected + '"'),
          '$& selected="selected"'
        )
        .replace(
          new RegExp('>' + selected + '</option>'),
          ' selected="selected"$&'
        )
    },
};