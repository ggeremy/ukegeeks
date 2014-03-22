/**
 * Resizes an overlay to fill the window (this is a 1.0, so "fill" is relative -- it gets much bigger)
 * @class resize
 * @namespace ugsEditorPlus
 */
ugsEditorPlus.resize = (function(){
	/**
	 * attach public members to this object
	 * @property _public
	 * @type JsonObject
	 */
	var _public = {};

	var $dlg = null;
	var $aceLayer = null;
	var $help = null;
	var editor = null;

	var FADE_SPEED = 550;
	var SLIDE_SPEED = 400;

	/**
	 * Hold the current state of the dialog, we'll store this on the element in "data-sized" attribute
	 * @attribute isBig
	 * @type {Boolean}
	 */
	var isBig = false;

	var isHelpOpen = false;

	/**
	 * Initializer: preps handles and sets state varables.
	 * @method setup
	 * @private
	 * @return {void}
	 */
	var setup = function(dlgElement){
		$dlg = $(dlgElement);
		$("body").append('<div id="aceHeader"><button class="aceSideBtn" title="Show options &amp; help"><span></span><span></span><span></span></button><strong>Edit Song</strong><a href="#exit-fullscreen">Exit fullscreen</a></div><div id="aceEditor"></div><div id="aceHelp"></div>');

		$aceLayer = $('#aceEditor');
		$aceLayer.fadeOut(1);

		$help = $('#aceHelp');

		$('#aceHeader a').click(function(e) {
			e.preventDefault();
			hideAce();
		});
		$('#aceHeader button').click(onShowHelpClicked);
	};

	var onShowHelpClicked = function(e) {
		e.preventDefault();
		showHelp(!isHelpOpen);
	};

	var showHelp = function(isShow) {
		isHelpOpen = isShow;

		if (isShow) {
			$help.animate({
				left: 0
			}, SLIDE_SPEED);
			$aceLayer.animate({
				left: '350px'
			}, SLIDE_SPEED);
		}
		else {
			$help.animate({
				left: '-350px'
			}, SLIDE_SPEED);
			$aceLayer.animate({
				left: 0
			}, SLIDE_SPEED);
		}
	};

	var showAce = function() {
		isBig = true;

		$('html').addClass('aceEditorActive');
		$('.overlay').fadeOut(300);

		if (editor === null) {
			LazyLoad.js('/js/ace/ace.js', function() {
				editor = ace.edit("aceEditor");
				editor.setTheme("ace/theme/idle_fingers");
				editor.getSession().setMode("ace/mode/chordpro");
				editor.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true
				});
				editor.completers = [ugsAce.chordCompleter];
				copySongToAce();

				$help.html(ugsAce.helpHtml);

			});
		}
		else {
			copySongToAce();
		}

	};

	var copySongToAce = function() {
		$aceLayer.fadeIn(FADE_SPEED);
		editor.setValue($('#chordProSource').val());
		editor.gotoLine(1);
		$help.fadeIn(1);
	};

	/**
	 * Restores overlay to original position(-ish -- not finished)
	 * @method hideAce
	 * @private
	 * @return {void}
	 */
	var hideAce = function() {
		isBig = false;

		$dlg.show();
		$aceLayer.fadeOut(FADE_SPEED);
		$help.fadeOut(FADE_SPEED);
		if (editor !== null) {
			$('#chordProSource').val(editor.getValue());
		}

		$('html').removeClass('aceEditorActive');
		showHelp(false);
	};

	/**
	 * Resizes passed in DOM element, toggling between fullscreen and "standard" size.
	 * @method toggle
	 * @param  {DOM-element} dlgElement handle to Overlay/dialog being resized
	 * @return {void}
	 */
	_public.toggle = function(dlgElement){
		if ($dlg === null) {
		setup(dlgElement);
		}

		if (isBig){
			hideAce();
		}
		else{
			showAce();
		}
		return false;
	};


	// ---------------------------------------
	// return public interface "JSON handle"
	// ---------------------------------------
	return _public;

}());