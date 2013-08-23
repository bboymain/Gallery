(function() {
  var ImageFeed;

  ImageFeed = (function() {
    ImageFeed.prototype.images = [];

    ImageFeed.prototype.feedUrl = '';

    function ImageFeed(feed) {
      this.feedUrl = feed;
    }

    ImageFeed.prototype.parse = function(callback) {
      var _this = this;
      return $.getJSON(this.feedUrl).done(function(data) {
        _this.filterImages(data);
        return callback(_this.images);
      });
    };

    ImageFeed.prototype.filterImages = function(data) {
      var item, _i, _len, _ref, _results;
      _ref = data.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(this.images.push(item.media.m));
      }
      return _results;
    };

    return ImageFeed;

  })();

  this.Panels = {
    feedUrl: "http://api.flickr.com/services/feeds/photos_public.gne?id=37836646@N03&format=json&jsoncallback=?",
    images: [],
    init: function() {
      var _this = this;
      this.feed = new ImageFeed(this.feedUrl);
      this.feed.parse((function(images) {
        return _this.loadImages(images);
      }));
      return this.bind();
    },
    loadImages: function(images) {
      this.images = images;
      return this.loadPanels();
    },
    loadPanels: function() {
      var feedSrc, index, _i;
      for (index = _i = 1; _i <= 100; index = ++_i) {
        feedSrc = this.images[Math.floor(Math.random() * this.images.length)];
        $(".panels").append("<div class='panel' data-src='" + feedSrc + "' >\n  <div class='flipper'>\n    <div class='front' />\n    <img class='back' />\n  </div>\n</div>");
      }
      return this.loadVisibleImages();
    },
    loadVisibleImages: function() {
      var $panel, panel, _i, _len, _ref, _results,
        _this = this;
      _ref = $(".panels .panel");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        $panel = $(panel);
        _results.push((function($panel) {
          var $img, src;
          $img = $panel.find("img");
          if (_this.isOnScreen($panel)) {
            src = $panel.data('src');
            return $img.attr('src', src).on('load', function() {
              return _this.flipPanel($panel);
            });
          }
        })($panel));
      }
      return _results;
    },
    flipPanel: function($elem) {
      return $elem.toggleClass('flip');
    },
    isOnScreen: function(elem) {
      var docViewBottom, docViewTop, elemBottom, elemTop;
      docViewTop = $(window).scrollTop();
      docViewBottom = docViewTop + $(window).height();
      elemTop = $(elem).offset().top;
      elemBottom = elemTop + $(elem).height();
      return (elemBottom <= docViewBottom) && (elemTop >= docViewTop);
    },
    bind: function() {
      var _this = this;
      return $(window).scroll(function() {
        return _this.loadVisibleImages();
      });
    }
  };

  $(function() {
    return Panels.init();
  });

}).call(this);
