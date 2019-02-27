'use strict';

$(function () {
	const discs_value = $('.discs_value');
	const tower = $('.tower');
	const timer_parent = $('.timer-block');
	const btn_start = $('.btn-start');
	const win_popup = $('.win-popup');
	const btn_new_game = $('.btn_new_game');
	let defaultColor;
	let btn_pause;
	let btn_reset;
	let setInt;
	let prop = true;
	let click = true;
	const minutes_elem = timer_parent.find('.minutes');
	const seconds_elem = timer_parent.find('.seconds');

	btn_start.click(init);
	btn_new_game.click(newGame);

	function newGame() {
		win_popup.hide();
		tower.empty();
		discs_value.prop('disabled', false);
		btn_start.prop('disabled', false);
		btn_pause.hide().prop('disabled', false);
		btn_pause.removeClass('btn_timer_pause');
		prop = true;
		click = true;
		clearInterval(setInt);
		minutes_elem.html('00:');
		seconds_elem.html('00');
		timerStopCall();
		resetGame();
		btn_reset.hide();
	}

	$( document ).ready(function jsonColorsArray() {
		$.getJSON( "json/colors.json", function(data) {
			defaultColor = data;
			console.log(defaultColor);
		});
	});

	function init() {
		valid();
		structureBuild();
		elemState();
		timer();
		drag();
		drop();
		timerStopCall();
		resetGame();
	}

	function drag() {
		tower.children().draggable({
			containment: '.towers-wrapper',
			cancel: '.disc:not(:first-child)',
			revert: true,
		});
	}

	function drop() {
		const tower_length = tower.first().children().length;
		tower.droppable({
			accept: '.disc',
			drop: function (event, ui) {
				if ($(this).children().length > 0) {
					if ($(ui.draggable).width() > $(this).children('div:eq(0)').width()) {
						return false;
					}
				}
				$(ui.draggable).remove();
				const elem_width = $(ui.draggable).width();
				const elem_color = $(ui.draggable).css('background');
				const drag_elem = $('<div class="disc"></div>');
				drag_elem.width(elem_width);
				drag_elem.css('background', elem_color);
				drag_elem.draggable({
					containment: '.towers-wrapper',
					cancel: '.disc:not(:first-child)',
					revert: true,
				});
				$(this).prepend(drag_elem);
				if (tower.last().children().length === tower_length) {
					tower.children().draggable('disable');
					prop = false;
					btn_pause.prop('disabled', true);
					popupWin();
				}
			}
		});
	}

	function popupWin() {
		win_popup.show().animate({opacity:1});
	}

	function timer() {
		const limit = 59;
		const value_start = 0;
		let seconds_value = 0;
		let minutes_value = 0;
		setInt = setInterval(function () {
			if (prop === true) {
				seconds_value++;
				if (seconds_value < 10) {
					seconds_elem.html('0' + seconds_value);
				}
				if (seconds_value >= 10) {
					seconds_elem.html(seconds_value);
				}
				if (seconds_value > limit) {
					seconds_value = value_start;
					minutes_value += 1;
					minutes_elem.html('0' + minutes_value + ':');
					seconds_elem.html('0' + seconds_value);
					if (minutes_value >= 10) {
						minutes_elem.html(minutes_value + ':');
					}
				}
			}
		}, 1000);
	}

	function timerState() {
		btn_pause.toggleClass('btn_timer_pause');
		if (click) {
			prop = false;
			tower.children().draggable('disable');
			click = false;
		}
		else {
			prop = true;
			tower.children().draggable('enable');
			click = true;
		}
	}

	function timerStopCall() {
		btn_pause.click(timerState);
	}

	function resetGame() {
		btn_reset.click(newGame);
	}

	function elemState() {
		discs_value.prop('disabled', true);
		btn_start.prop('disabled', true);
	}

	function valid() {
		if (discs_value.val() > 6) {
			discs_value.val(6);
		} else if (discs_value.val() < 2) {
			discs_value.val(2);
		}
	}

	function structureBuild() {
		for (let i = 1; i <= discs_value.val(); i++) {
			const color = defaultColor[i];
			tower.first().append('<div class="disc" style="width: ' + i * 40 + 'px; background: ' + color + '"></div>');
			$(this).prop('disabled', true);
			btn_pause = $('.btn_pause');
			btn_pause.show();
			btn_reset = $('.btn_reset');
			btn_reset.show();
		}
	}

});