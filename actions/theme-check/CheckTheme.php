<?php

class WPORG_CheckTheme {

	public $themeHelper;

	/**
	 * Sends a theme through Theme Check.
	 *
	 * @return bool Whether the theme passed the checks.
	 */
	public function check_theme() {

		if ( ! defined( 'THEME_CHECK_FOLDER' ) ) {
			exit( 'Missing "THEME_CHECK_FOLDER" from config.' );
		}

		// Load the theme checking code.
		if ( ! function_exists( 'run_themechecks_against_theme' ) ) {
			include_once WP_PLUGIN_DIR . '/' . THEME_CHECK_FOLDER . '/checkbase.php';
		}

		// Run the checks.
		$slug   = 'test-theme';
		$theme  = new WP_Theme( $slug, __DIR__ );
		$result = run_themechecks_against_theme( $theme, $slug );

		return $result;
	}

	/**
	 * Formats the error and removes html.
	 *
	 * @param string $message The message.
	 * @return string Message after string replacements.
	 */
	public function clean_message( $message ) {
		$cleaned = str_replace( array( '<span class="tc-lead tc-required">', '</span>', "<span class='tc-lead tc-required'>", '<span class="tc-lead tc-recommended">', "<span class='tc-lead tc-recommended'>" ), '', $message );
		$cleaned = str_replace( array( '<strong>', '</strong>' ), '`', $cleaned );
		$cleaned = preg_replace( '!<a href="([^"]+)".+</a>!i', '$1', $cleaned );
		$cleaned = html_entity_decode( strip_tags( $cleaned ) );
		return $cleaned;
	}

	/**
	 * Loops through all the errors and passes them to cleaning function.
	 *
	 * @param array $messages List of messages.
	 * @return array Same messages, cleaned.
	 */
	public function clean_messages( $messages ) {
		$cleaned_messages = array();

		foreach ( $messages as $message ) {
			array_push( $cleaned_messages, $this->clean_message( $message ) );
		}

		return $cleaned_messages;
	}

	/**
	 * Appends an array of strings to the log file
	 */
	public function save_to_log( $type, $strings )  {
		$fileName = './logs/theme-check-'. $type .'.txt';
		file_put_contents( $fileName, implode( "\n", $strings ), FILE_APPEND );
	}

	/**
	 * Formats array of string errors and saves them to log file
	 */
	public function output_to_log_file( $type, $list ) {
		$eol = PHP_EOL;
		$strings = [];

		foreach ( $list as $key => $val ) {
			$implode = implode( $eol . $eol, $val );
			$str = '[ ' . esc_attr( $key ) . ' ] '. $eol . $implode . $eol . $eol;

			array_push( $strings, $str );
		}

		$this->save_to_log( $type, $strings );
	}

	/**
	 * Determines if the start string matches
	 */
	public function starts_with( $haystack, $needle ) {
		return substr_compare( $haystack, $needle, 0, strlen( $needle ) ) === 0;
	}

	/**
	 * If the array doesn't exist, create the array and add the item to it.
	 *
	 * @param array  $arr Associate array to add to.
	 * @param string $key Key.
	 * @return string $item_to_add Item added to the array.
	 */
	public function add_to_array( &$arr, $key, $item_to_add ) {
		if ( ! array_key_exists( $key, $arr ) ) {
			$arr[ $key ] = array();
		}

		array_push( $arr[ $key ], $item_to_add );

		return true;
	}

	/**
	 * This function looks at the global themechecks array for errors, formats and prints them
	 */
	public function display_results() {
		global $themechecks; // global that exists in the theme-check plugin


		$error_list = array();
		$warning_list = array();

		foreach ( $themechecks as $check ) {
			if ( $check instanceof themecheck ) {
				$error = $check->getError();
				$test_id = get_class( $check );

				if ( count( $error ) > 0 ) {
					$messages = $this->clean_messages( $error );

					foreach ( $messages as $clean_message ) {

						// All strings that contain REQUIRED are considered errors
						if ( $this->starts_with( $clean_message, 'REQUIRED:' ) ) {
							$this->add_to_array( $error_list, $test_id, $clean_message );

							// All string that contain RECOMMENDED or INFO are considered warnings
						} else if ( $this->starts_with( $clean_message, 'RECOMMENDED:' ) || $this->starts_with( $clean_message, 'INFO:' ) ) {
							$this->add_to_array( $warning_list, $test_id, $clean_message );
						}
					}
				}
			}
		}

		if( count( $error_list ) > 0) {
			$this->output_to_log_file( 'errors', $error_list );
		}

		echo PHP_EOL;
		echo PHP_EOL;

		if( count( $warning_list ) > 0) {
			$this->output_to_log_file( 'warnings', $warning_list );
		}
	}

	/**
	 * Get set up to run tests on the uploaded theme.
	 */
	public function __construct() {
		include './helpers/ThemeHelper.php';

		$this->themeHelper = new ThemeHelper();

	}

	/**
	 * Run prepare theme and run theme-check
	 */
	public function run_check() {
		$this->check_theme();

		$this->display_results();
	}

}

// run the test
$w = new WPORG_CheckTheme();

$w->run_check();


