# Suggestion component for VueJS

Easy to use.

## NPM install

`npm i vue-component-suggestion`

## Usage

Add these lines in the `<head>` tag :
```
<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<script src="./node_modules/vue-component-suggestion/suggestion.js"></script>
<link rel="stylesheet" href="./node_modules/vue-component-suggestion/suggestion.css">

<script>
	document.addEventListener('DOMContentLoaded', function () {
		new Vue({ el: '#vue-app' });
	});
	
	function loadSuggestions(search, callback) {
		fetch('https://localhost/api/search' + escape(search))
		.then((response) => {
			return response.json();
		})
		.then((datas) => {
			let results = [];
			
			datas.forEach( data => {
				results.push({
					label: data.label,
					datas: data,
				});
			});
			
			callback(results);
		})
		.catch((err) => {
			callback([]);
		});
	}
	
	function chooseSuggestion(search, datas) {
		location.href = datas.link;
	}
</script>
```

And this in the `<body>` tag :
```
<div id="vue-app">
	<suggestion name="search" placeholder="Enter your search" :load-suggestion-callback="loadSuggestions" :choose-suggestion-callback="chooseSuggestion"></suggestion>
</div>
```
