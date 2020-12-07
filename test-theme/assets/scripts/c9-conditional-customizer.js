jQuery(document).ready(function () {

	//customizer is ready
	wp.customize.bind('ready', function () {

		//set switch for c9_default_font
		wp.customize('c9_default_font', function (setting) {
			wp.customize.control('c9_heading_font', function (control) {
				var visibility = function () {
					if ('no' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_subheading_font', function (control) {
				var visibility = function () {
					if ('no' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_body_font', function (control) {
				var visibility = function () {
					if ('no' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_fadein_webfonts', function (control) {
				var visibility = function () {
					if ('no' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
		}); //end switch for fonts

		//set switch for c9_social icons
		wp.customize('c9_show_social', function (setting) {
			wp.customize.control('c9_twitter', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_facebook', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_instagram', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_pinterest', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_spotify', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_youtube', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_yelp', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_subreddit', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_linkedin', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_github', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
			wp.customize.control('c9_soundcloud', function (control) {
				var visibility = function () {
					if ('hide' !== setting.get()) {
						control.container.slideDown(180);
					} else {
						control.container.slideUp(180);
					}
				};
				visibility();
				setting.bind(visibility);
			});
		}); //end switch for social icons in footer

	});
});
