var tumblrTile;

tumblrTile || (function() {

    tumblrTile = {
        configNs       : "tumblr-tile",
        saveConfig     : saveConfig,
        loadConfig     : loadConfig,
        draw           : draw,
        getTumblrPhotos: getTumblrPhotos,
        config         : undefined,
    };

    function saveConfig(hash) {
        localStorage[this.configNs] = JSON.stringify(hash);
    }

    function loadConfig() {
        var configStr = localStorage[this.configNs];
        var config    = configStr ? JSON.parse(configStr) : {};

        var defaultConfig = {
			apiKey : 'Ckj5qmv4fWharnnIbeLZ8HfH5QIJRgqEZr74ZNFBs0BwxuNqVz',
            hostname : "ayaka-sasaki.tumblr.com",
            baseWidth: 273,
            margin   : 10
        };

        this.config = $.extend(defaultConfig, config);
    }

    function draw() {
        var self = this;

        self.loadConfig();

        if ( ! self.config.apiKey ) {
            console.log("not exists api key");
            return 1;
        }

        var param = {
            limit : 20,
            offset: 0,
        };

        var isAccessTumblr = false;

		var items = new Array;
		var i = 0;

        self.getTumblrPhotos(param, function(div) {

			items[i] = div;
			i++;

        }).then(function() {

            param.offset += param.limit;

			items = shuffle(items);

			for(i = 0 ; i <= items.length ; i++){
				$("#container").append($(items[i]));
			}

			$('.item').each(function(){
				$('img',this).css({
					'width':self.config.baseWidth,
					'height':$('img',this).attr('height') * (self.config.baseWidth / $('img',this).attr('width'))
				});

				$(this).css({
					'margin':(self.config.margin / 2),
					'width':self.config.baseWidth,
					'box-shadow':'1px 1px 3px rgba(0,0,0,.1)'
				});
			});

			$('#container').css({
				'margin-top':(self.config.margin / 2),
				'margin-bottom':(self.config.margin / 2)
			});

            $("#container").masonry({
                itemSelector: ".item",
                columnWidth: self.config.baseWidth + self.config.margin + 2,
                isFitWidth: true,
                isAnimated: true
            });
        }).then(function() {
            $(window).scroll(function() {
                if ( isAccessTumblr == false && $(window).scrollTop() + $(window).height() >= $(document).height() ) {

                    isAccessTumblr = true;
                    var items = "";

                    self.getTumblrPhotos(param, function(div) {
                       items += div;

                    }).then(function() {

                        param.offset += param.limit;

                        var $items = $(items);

						if($items.length !== 0){
							for(i = 0 ; i < $items.length ; i++){
								$($items.get(i)).css({
									'margin':(self.config.margin / 2),
									'width':self.config.baseWidth,
									'box-shadow':'1px 1px 3px rgba(0,0,0,.1)'
								});

								var $img = $($items.get(i).childNodes);

								$img.css({
									'width':self.config.baseWidth,
									'height':$img.attr('height') * (self.config.baseWidth / $img.attr('width'))
								});
							}
						}

                        $("#container").append($items).masonry( 'appended', $items, false );
                    }).then(function() {
                        isAccessTumblr = false;
                    });
                }
            });
        });

    }

    function getTumblrPhotos(param, func) {
        var self = this;
        var d = $.Deferred();
        param.api_key = self.config.apiKey;

        $.getJSON(
            "https://api.tumblr.com/v2/blog/" + self.config.hostname + "/posts/photo",
            param,
            function(json) {

                json.response.posts.forEach(function(val, index, array) {
                    if ( ! val.photos ) {
                        return 1;
                    }
                    var j    = 0;
                    var diffSizes = val.photos[0].alt_sizes.map(function(alt_size) {
                        return {
                            diffWidth: Math.abs(alt_size.width - self.config.baseWidth),
                            index    : j++,
                        };
                    })

                    diffSizes.sort(function(a, b) {
                        if ( a.diffWidth > b.diffWidth ) {
                            return 1;
                        }
                        else if ( a.diffWidth < b.diffWidth ) {
                            return -1;
                        }
                        return 0;
                    });

                    var altSize = val.photos[0].alt_sizes[diffSizes[0].index]
                    var div = '<div class="item"><img src="' + altSize.url+ '" width="' + altSize.width + '" height="' + altSize.height + '" /></div>';
                    //var div = '<div class="item"><img src="' + altSize.url+ '" /></div>';
                    func(div);
                });

                d.resolve();
            }
        );

        return d;
    }

	//シャッフル関数
	var shuffle = function(a){
		for(var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
		return a;
	};
})();
