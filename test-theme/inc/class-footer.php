<?php
if ( ! class_exists( 'c9FooterHelpers' ) ) {
	/**
	 * WP_Bootstrap_Navwalker class.
	 *
	 * @extends Walker_Nav_Menu
	 */
	class c9FooterHelpers {

		public static function build_c9_social() {
			$social_links   = array();
			// $social_options = get_theme_mod( 'c9_show_social' ) !== 'hide' ? get_theme_mod( 'c9_show_social' ) : false;
			$social_options = get_theme_mod( 'c9_show_social', 'show');
			if ( $social_options != 'hide' ) {
				$social_options_selected = array(
					'c9_twitter' 		=> get_theme_mod('c9_twitter', ''),
					'c9_facebook' 		=> get_theme_mod('c9_facebook', ''),
					'c9_instagram' 		=> get_theme_mod('c9_instagram', ''),
					'c9_pinterest' 		=> get_theme_mod('c9_pinterest', ''),
					'c9_spotify' 		=> get_theme_mod('c9_spotify', ''),
					'c9_youtube' 		=> get_theme_mod('c9_youtube', ''),
					'c9_yelp' 			=> get_theme_mod('c9_yelp', ''),
					'c9_subreddit' 		=> get_theme_mod('c9_subreddit', ''),
					'c9_linkedin' 		=> get_theme_mod('c9_linkedin', ''),
					'c9_github' 		=> get_theme_mod('c9_github', ''),
					'c9_soundcloud' 	=> get_theme_mod('c9_soundcloud', ''),
				);
				foreach ( $social_options_selected as $opt_key => $opt_value ) {
					$link_builder = 'build_' . $opt_key . '_link';
					if ( '' !== $opt_key && '' !== $opt_value ) {
						if ( filter_var( $opt_value, FILTER_VALIDATE_URL ) ) {
							$social_links[ $opt_key ] = self::$link_builder( sanitize_text_field( esc_url($opt_value) ), 'url' );
						} else {
							$social_links[ $opt_key ] = self::$link_builder( sanitize_text_field( esc_attr($opt_value) ), 'username' );
						}
					}
				}
				return $social_links;
			} else {
				return false;
			}
		}

		public static function build_c9_twitter_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-twitter"></i></a>';
			} else {
				$link = '<a href="//twitter.com/' . $input . '" target="_blank"><i class="fab fa-twitter"></i></a>';
			}
			return $link;
		}

		public static function build_c9_facebook_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-facebook"></i></a>';
			} else {
				$link = '<a href="//facebook.com/' . $input . '" target="_blank"><i class="fab fa-facebook"></i></a>';
			}
			return $link;
		}

		public static function build_c9_instagram_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-instagram"></i></a>';
			} else {
				$link = '<a href="//instagram.com/' . $input . '" target="_blank"><i class="fab fa-instagram"></i></a>';
			}
			return $link;
		}

		public static function build_c9_pinterest_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-pinterest"></i></a>';
			} else {
				$link = '<a href="//pinterest.com/' . $input . '" target="_blank"><i class="fab fa-pinterest"></i></a>';
			}
			return $link;
		}

		public static function build_c9_spotify_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-spotify"></i></a>';
			} else {
				$link = '<a href="//open.spotify.com/' . $input . '" target="_blank"><i class="fab fa-spotify"></i></a>';
			}
			return $link;
		}

		public static function build_c9_youtube_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-youtube"></i></a>';
			} else {
				$link = '<a href="//youtube.com/' . $input . '" target="_blank"><i class="fab fa-youtube"></i></a>';
			}
			return $link;
		}

		public static function build_c9_flickr_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-flickr"></i></a';
			} else {
				$link = '<a href="//flickr.com/' . $input . '" target="_blank"><i class="fab fa-flickr"></i></a>';
			}
			return $link;
		}

		public static function build_c9_tumblr_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-tumblr"></i></a>';
			} else {
				$link = '<a href="//' . $input . '.tumblr.com" target="_blank"><i class="fab fa-tumblr"></i></a>';
			}
			return $link;
		}

		public static function build_c9_yelp_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-yelp"></i></a>';
			} else {
				$link = '<a href="//yelp.com/biz/' . $input . '" target="_blank"><i class="fab fa-yelp"></i></a>';
			}
			return $link;
		}

		public static function build_c9_subreddit_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-reddit"></i></a>';
			} else {
				$link = '<a href="//reddit.com/r/' . $input . '" target="_blank"><i class="fab fa-reddit"></i></a>';
			}
			return $link;
		}

		public static function build_c9_linkedin_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-linkedin"></i></a>';
			} else {
				$link = '<a href="//linkedin.com/in/' . $input . '" target="_blank"><i class="fab fa-linkedin"></i></a>';
			}
			return $link;
		}

		public static function build_c9_github_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-github"></i></a>';
			} else {
				$link = '<a href="//github.com/' . $input . '" target="_blank"><i class="fab fa-github"></i></a>';
			}
			return $link;
		}

		public static function build_c9_soundcloud_link( $input, $type ) {
			if ( 'url' === $type ) {
				$link = '<a href="' . $input . '" target="_blank"><i class="fab fa-soundcloud"></i></a>';
			} else {
				$link = '<a href="//soundcloud.com/' . $input . '" target="_blank"><i class="fab fa-soundcloud"></i></a>';
			}
			return $link;
		}
	}
}
