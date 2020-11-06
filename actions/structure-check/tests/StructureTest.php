<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
final class StructureTest extends TestCase
{
	const REL_THEME_LOCATION = '../../test-theme';

	function isChildTheme(): bool {
		$css_contents = file_get_contents( self::REL_THEME_LOCATION . '/style.css');

		return preg_match( '/[ \t\/*#]*Template:/i', $css_contents ) === 1;
	}

	public function testsThatStyleIsPresent(): void
	{
		$this->assertFileExists( self::REL_THEME_LOCATION . '/style.css', '::error:: We require you have a style.css file.' );
	}

	public function testsThatIndexIsPresent(): void
	{
		if( self::isChildTheme() ) {
			$this->markTestSkipped('Index.php is not required for a child theme.');
		}

		$this->assertFileExists( self::REL_THEME_LOCATION . '/index.php', '::error::We require you have an index.php file.' );
	}

	public function testsThatScreenshotIsPresent(): void
	{
		$hasPNG = file_exists( self::REL_THEME_LOCATION . '/screenshot.png' );
		$hasJPG = file_exists( self::REL_THEME_LOCATION . '/screenshot.jpg' ) || file_exists( self::REL_THEME_LOCATION . '/screenshot.jpeg' );

		$this->assertTrue( $hasPNG || $hasJPG, '::error::We require you have a screenshot.png or screenshot.jpg file.' );
	}
}
