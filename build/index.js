function IntroController(){function e(e){var t=$(e.target).attr("class").split(" ");if(t.length>1){var r=$("input."+t[1])[0].value,o=replace_query(window.location.href,t[1],r);o||(o=add_query_params(window.location.href,t[1],r)),window.location.href=o}n.unbind("click"),moveToQuizScreen()}var n=$(".option");n.on("click",e)}function QuizController(){$.get("partials/answer.html",function(e){var n=$("#content #quiz #options");$("#done").click(moveToResultsScreen);for(var t=0;t<numOfOptions;t++)n=n.append(e)}).then(function(e){var n=movie_results.length,t=movie_results[Math.floor(Math.random()*n)];charIndex=alphabetRange.a,correctAnswer=Math.floor(4*Math.random()),$("#quiz #poster").attr("src",imageHost+t.poster_path),$("#content #question").append('When was the film "'+t.title+'" released?'),$("#content .option").each(function(e,n){var r=$(n);e===correctAnswer?(r.append(String.fromCharCode(charIndex)+") "+encode_release_date(t.release_date)),r.click(function(){num_correct+=1,updateSuccessPrompt(),$("#prompt-backdrop.hidden").removeClass("hidden")})):(r.append(String.fromCharCode(charIndex)+") "+encode_release_date(t.release_date,randomize)),r.click(function(){r.addClass("chosen"),$("#wrong-choice.hidden").removeClass("hidden"),num_incorrect+=1})),charIndex+=1})})}function ResultsController(){$("#results #correct span").append(num_correct),$("#results #incorrect span").append(num_incorrect),$("#back").click(returnToIntroScreen)}function SuccessController(){$("#prompt").on("click",".option.cancel",moveToResultsScreen),$("#prompt").on("click",".option.continue",continueToNextQuiz)}function requestMovieDBData(e){var n=backendUrl+"/api/movieDB"+(e?"/"+e:"");return $.ajax({url:n,type:"GET"}).then(function(e){movie_results=e.results})}function returnToIntroScreen(){num_correct=0,num_incorrect=0,window.location.href=remove_all_queries(window.location.href)}function moveToQuizScreen(e){movie_results=requestMovieDBData(e),$("#content").empty().append('<div style="text-align: center;">Initializing data...</div>'),Promise.resolve(movie_results).then(function(){$("#content").empty().load("partials/quiz.html",QuizController)})}function moveToResultsScreen(){$("#prompt-backdrop").addClass("hidden"),$("#content").empty().load("partials/results.html",ResultsController)}function continueToNextQuiz(){$("#prompt-backdrop").addClass("hidden"),$("#content").empty().load("partials/quiz.html",QuizController)}function updateSuccessPrompt(){$("#prompt #num-answers").empty().append(num_correct)}function randomize(e){return new Date(e.getFullYear()+Math.floor(8*Math.random())-4,Math.floor(12*Math.random()))}function encode_release_date(e,n){var t=new Date(e);return n&&(t=n(t)),months[t.getMonth()]+" "+t.getFullYear().toString()}function replace_query(e,n,t){var r=find_query_info(e,n);if(null===r)return null;var o=e.substring(0,r.start-1);return o=o+"="+t,o+=e.substring(r.end)}function remove_all_queries(e){var n=e.indexOf("?");return n<0?e:e.substring(0,n)}function find_query(e,n){var t=find_query_info(e,n);return null===t?null:e.substring(t.start,t.end+1)}function find_query_info(e,n){for(var t,r,o=e.indexOf("?"),a=e.indexOf(n);a>-1&&(t=a,"="!==e.charAt(t+1));a=e.indexOf(n,a+1));return void 0===t?null:o>t?null:(r=e.indexOf("&",t),r<0&&(r=e.length-1),{start:t+n.length+1,end:r})}function add_query_params(e,n,t){"/"===e.charAt(e.length-1)&&(e=e.substring(0,e.length-1));var r=e.indexOf("?");return e=r!==-1?e.length-1===r?e.substring(0,e.length-1):e+"&"+n+"="+t:e+"?"+n+"="+t}var movie_results,backendUrl,alphabetRange={a:65,b:90},imageHost="http://image.tmdb.org/t/p/w185",months=["January","February","March","April","May","June","July","August","September","October","November","December"],numOfOptions=4,num_correct=0,num_incorrect=0,onceConfigIsLoaded=$.get("config/config.json",function(e){backendUrl=e.backendUrl});$(document).ready(function(){Promise.resolve(onceConfigIsLoaded).then(function(){var e=find_query(window.location.href,"actor");e?moveToQuizScreen("?actor="+encodeURIComponent(e)):$("#content").load("partials/intro.html",IntroController)})}),$(document).ready(function(){$.get("partials/success-prompt.html",function(e){$("html").prepend(e),SuccessController()})});