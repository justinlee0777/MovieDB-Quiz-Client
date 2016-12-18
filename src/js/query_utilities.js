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