define(['lodash', 'can', 'can/control/', 'can/event/',
	'can/construct/proxy/', 'can/construct/super/'],
	function (_, can, Control)
	{
		// private classes and functions
		var ExampleRandomFeed = Control.extend(
			{
				defaults: {
					feedUrl: '',
					refreshInterval: 5000,
					itemsCount: 5
				}
			},
			{
				data: {
					posts: []
				},
			init: function () {
				this._super();
				this.data = new can.Map(this.data);
				this.render();
				if (this.options.feedUrl) {
					this.start();
				}
			},

			render: function () {
				//this.element.find('.example-random-feed__posts').append(template(this.data, this.getHelpers()));
			},

			start: function () {
				this.updateFeedProgress = false;

				this.updateFeed();
				setInterval(this.proxy(function () {
					if (!this.updateFeedProgress) {
						this.updateFeed();
						this.updateFeedProgress = true;
					}
				}), this.options.refreshInterval);
			},

			updateFeed: function () {
				$.ajax({
					url: this.options.feedUrl,
					contentType: 'json'
				}).done(this.proxy(function (data) {
					if (data && data !== null && data.posts) {
						this.data.attr('posts', _.sample(data.posts, this.options.itemsCount));

					}
					else {
						console.log('ExampleRandomFeed: empty data');
					}
					this.updateFeedProgress = false;
				})).fail(function (xhr, status) {
					console.log('ExampleRandomFeed: ' + status);
					this.updateFeedProgress = false;
				});
			},

			getHelpers: function () {
				return {
					renderRandomStuff: function () {
						return 'Every stuff is important!';
					}
				};
			}
		});

		return function (id, opts) {
			return new ExampleRandomFeed(id, opts);
		}
	}
);
