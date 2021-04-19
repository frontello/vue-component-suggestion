# Suggestion component for VueJS 3

Easy to use.

## NPM install

`npm i vue-component-suggestion`

## Usage

Add these lines in the `<head>` tag :
```
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
<link rel="stylesheet" href="./node_modules/vue-component-suggestion/suggestion.css">

<script type="module">
	import {suggestion} from './node_modules/vue-component-suggestion/suggestion.js';
	
	document.addEventListener('DOMContentLoaded', function () {
		
		const app = Vue.createApp({
			components: {
				'suggestion': suggestion
			},
			methods: {
				loadSuggestions(search, callback) {
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
				},
				chooseSuggestion(search, datas) {
					location.href = datas.link;
				}
			}
		});
		app.mount('#vue-app');
	});
</script>
```

And this in the `<body>` tag :
```
<div id="vue-app">
	<suggestion name="search" placeholder="Enter your search" @load-suggestion="loadSuggestions" @choose-suggestion="chooseSuggestion"></suggestion>
</div>
```
