var movie_results, backendUrl;
var alphabetRange = { a: 65, b: 90 },
	imageHost = 'http://image.tmdb.org/t/p/w185',
	months = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'],
	numOfOptions = 4;
var num_correct = 0, num_incorrect = 0;

var onceConfigIsLoaded = $.get('config/config.json',
	function(config) {
		backendUrl = config.backendUrl;
	}
);

$(document).ready( function() {
	Promise.resolve(onceConfigIsLoaded)
	.then( function() {
		var actor_query = find_query(window.location.href, 'actor');
		if( actor_query ) {
			moveToQuizScreen('?actor=' + encodeURIComponent(actor_query));
		} else {
			$('#content').load('partials/intro.html', IntroController);
		}
	});
});

$(document).ready( function() {
	$.get('partials/success-prompt.html', function(data) {
		$('html').prepend(data);
		SuccessController();
	})
});

function IntroController() {
	var option = $('.option');

	option.on('click', loadMovies);

	function loadMovies(event) {
		var query,
			classes = $(event.target).attr('class').split(' ');
		if( classes.length > 1) {
			var value = $('input.' + classes[1])[0].value;
			var new_url = replace_query(window.location.href, classes[1], value);
			if( !new_url) new_url = add_query_params(window.location.href, classes[1], value);
			window.location.href = new_url;
			// ----- DOCUMENT REFRESHES -----
		}
		option.unbind('click');
		moveToQuizScreen();
	}
}

function QuizController() {
	$.get('partials/answer.html', function(data) {
		var markup = data,
			options = $('#content #quiz #options');

		$('#done').click( moveToResultsScreen );

		for( var i = 0; i < numOfOptions; i++) {
			options = options.append(data);
		}
	})
	.then( function(response) {
		var total = movie_results.length,
			movie = movie_results[Math.floor(Math.random() * total)]
			charIndex = alphabetRange.a,
			correctAnswer = Math.floor(Math.random() * 4);

		$('#quiz #poster').attr('src', imageHost + movie.poster_path);

		$('#content #question').append('When was the film "' + movie.title + '" released?');
		$('#content .option').each( function(index, element) {
			var option = $(element);
			if( index === correctAnswer ) {
				option.append(String.fromCharCode(charIndex) + ') ' + encode_release_date(movie.release_date));
				option.click( function() {
					num_correct = num_correct + 1;
					updateSuccessPrompt();
					$('#prompt-backdrop.hidden').removeClass('hidden');
				});
			} else {
				option.append(String.fromCharCode(charIndex) + ') ' + encode_release_date(movie.release_date, randomize));
				option.click( function() {
					option.addClass('chosen');
					$('#wrong-choice.hidden').removeClass('hidden');
					num_incorrect = num_incorrect + 1;
				});
			}
			charIndex = charIndex + 1;
		});
	});
}

function ResultsController() {
	$('#results #correct span').append(num_correct);
	$('#results #incorrect span').append(num_incorrect);
	$('#back').click( returnToIntroScreen );
}

function SuccessController() {
	$('#prompt').on( 'click', '.option.cancel', moveToResultsScreen );
	$('#prompt').on( 'click', '.option.continue', continueToNextQuiz );
}

function requestMovieDBData(query) {
	var endpoint = backendUrl + '/api/movieDB' + ( query ? '/' + query : '' );
	return $.ajax({
		url: endpoint,
		type: 'GET'
	})
	.then( function( response ) {
		movie_results = response.results;
	});;
}

function returnToIntroScreen() {
	num_correct = 0, num_incorrect = 0;
	window.location.href = remove_all_queries(window.location.href);
	//$('#content').empty().load('partials/intro.html', IntroController);
}

function moveToQuizScreen(query_string) {
	movie_results = requestMovieDBData(query_string);
	$('#content').empty().append('<div style="text-align: center;">Initializing data...</div>');
	Promise.resolve(movie_results)
	.then( function() {
		$('#content').empty().load('partials/quiz.html', QuizController)
	});
}

function moveToResultsScreen() {
	$('#prompt-backdrop').addClass('hidden');
	$('#content').empty().load('partials/results.html', ResultsController);
}

function continueToNextQuiz() {
	$('#prompt-backdrop').addClass('hidden');
	$('#content').empty().load('partials/quiz.html', QuizController);
}

function updateSuccessPrompt() {
	$('#prompt #num-answers').empty().append(num_correct);
}

function randomize(date) {
	return new Date(date.getFullYear() + Math.floor(Math.random() * 8) - 4, Math.floor(Math.random() * 12));
}

function encode_release_date(isostring, preprocess) {
	var date = new Date(isostring);
	if(preprocess) date = preprocess(date);
	return months[date.getMonth()] + ' ' + date.getFullYear().toString();
}

function replace_query(url, key, value) {
	var range = find_query_info(url, key);
	if( range === null) return null;
	var new_url = url.substring(0, range.start - 1);
	new_url = new_url + '=' + value;
	new_url = new_url + url.substring(range.end);
	return new_url;
}

function remove_all_queries(url) {
	var index = url.indexOf('?');
	if( index < 0) return url;
	return url.substring(0, index);
}

function find_query(url, key) {
	var range = find_query_info(url, key);
	if( range === null) return null;
	return url.substring(range.start, range.end + 1);
}

function find_query_info(url, key) {
	var value,
		query_pos,
		query_end,
		pivot = url.indexOf('?');
	for( var pos = url.indexOf(key); pos > -1; pos = url.indexOf(key, pos + 1)) {
		query_pos = pos;
		if( url.charAt(query_pos + 1) === '=') {
			break;
		}
	}
	if( query_pos === undefined) return null;
	else if( pivot > query_pos)  return null;
	query_end = url.indexOf('&', query_pos);
	if( query_end < 0) query_end = url.length - 1;
	return {
		start: query_pos + key.length + 1,
		end: query_end
	};
}

function add_query_params(url, key, param) {
	if( url.charAt( url.length - 1) === '/') {
		url = url.substring(0, url.length - 1);
	}
	var index = url.indexOf('?');
	if( index !== -1) {
		if( url.length - 1 === index) {
			url = url.substring(0, url.length - 1);
		} else {
			url = url + '&' + key + '=' + param;
		}
	} else {
		url = url + '?' + key + '=' + param;
	}
	return url;
}