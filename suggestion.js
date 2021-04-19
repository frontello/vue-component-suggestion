'use strict';

const suggestion = {
	template: `
	<div v-bind:class="[suggestions.length > 0 ? [suggestionContainerClass, suggestionActivatedClass] : suggestionContainerClass]">
		<input :type="type" :name="name" :placeholder="placeholder" :autocomplete="autocomplete" v-model="search" v-on:keyup="keyboardHandle" v-on:search="keyboardHandle" v-focus>
		<ul v-if="suggestions">
			<li v-for="suggestion in suggestions" v-bind:class="{ selected: suggestion.selected }" v-on:click="chooseSuggestion(suggestion)">{{ suggestion.label }}</li>
		</ul>
	</div>
	`,
	components: {},
	emits: [
		'loadSuggestion',
		'chooseSuggestion'
	],
	props: {
		type: {
			type: String,
			default: 'search'
		},
		name: {
			type: String,
			default: 'search'
		},
		placeholder: {
			type: String,
			default: 'Enter your search'
		},
		autocomplete: {
			type: String,
			default: 'off'
		},
		value: {
			type: String,
			default: ''
		},
		loadSuggestionFromTheNumberOfCharacters: {
			type: Number,
			default: 3
		},
		loadSuggestionTimout: {
			type: Number,
			default: 100
		},
		suggestionContainerClass: {
			type: String,
			default: 'vue-suggestion'
		},
		suggestionActivatedClass: {
			type: String,
			default: 'activated'
		},
		suggestionSelectedClass: {
			type: String,
			default: 'selected'
		},
		keyboardHandleEnabeled: {
			type: Boolean,
			default: true
		},
		mouseHandleEnabeled: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			search: '',
			currentSuggestion: null,
			suggestions: [],
			loadTimeout: null
		}
	},
	directives: {
		focus: {
			inserted: function (el) {
				el.focus();
			}
		}
	},
	created () {
		window.addEventListener('wheel', this.mouseHandle);
	},
	mounted() {
		this.search = this.value;
	},
	destroyed () {
		window.removeEventListener('wheel', this.mouseHandle);
	},
	methods: {
		setCurrentSuggestion: function (suggestion = null) {
			this.currentSuggestion = suggestion;
		},
		getSuggestionList: function () {
			clearTimeout(this.loadTimeout);
	
			this.loadTimeout = setTimeout( () => {
				this.$emit('loadSuggestion', this.search, (suggestions) => {
					suggestions.forEach( suggestion => {
						if (undefined === suggestion.selected) {
							suggestion.selected = false;
						}
						if (undefined === suggestion.label) {
							suggestion.label = '';
						}
						if (undefined === suggestion.datas) {
							suggestion.datas = {};
						}
					});
					
					this.suggestions = suggestions;
					this.setCurrentSuggestion();
				});
			}, this.loadSuggestionTimout);
		},
		closeSuggestionList: function () {
			this.suggestions = [];
			this.setCurrentSuggestion();
		},
		chooseSuggestion: function (suggestion) {
			this.setCurrentSuggestion(suggestion);
			this.closeSuggestionList();
			this.$emit('chooseSuggestion', suggestion.label, suggestion.datas);
		},
		suggestionListNavigation: function(direction) {
			if (this.currentSuggestion) {
				this.currentSuggestion.selected = false;
			}
			
			let currentIndex = this.suggestions.indexOf(this.currentSuggestion);
			let firstSuggestionIndex = 0;
			let lastSuggestionIndex = this.suggestions.length - 1;
			
			switch (direction) {
				case 'prev':
					if (null === this.currentSuggestion || firstSuggestionIndex === currentIndex) {
						currentIndex = lastSuggestionIndex;
					} else {
						currentIndex--;
					}
				break;
				case 'next':
					if (null === this.currentSuggestion || lastSuggestionIndex === currentIndex) {
						currentIndex = firstSuggestionIndex;
					} else {
						currentIndex++;
					}
				break;
			}
			
			this.setCurrentSuggestion(this.suggestions[ currentIndex ]);
			this.selectSuggestion(this.currentSuggestion);
		},
		selectSuggestion: function(suggestion) {
			suggestion.selected = true;
			this.search = suggestion.label;
		},
		keyboardHandle: function (event) {
			if (!this.keyboardHandleEnabeled) return;
			
			switch (event.which) {
				case 38: // arrow up
					this.suggestionListNavigation('prev');
					return false;
				break;
				case 40: // arrow down
					if (this.suggestions.length > 0) {
						this.suggestionListNavigation('next');
					} else {
						this.closeSuggestionList();
					}
					return false;
				break;
				case 13: // enter
					if (this.suggestions.length > 0) {
						this.chooseSuggestion(this.currentSuggestion);
					} else {
						this.closeSuggestionList();
					}
					return false;
				break;
				case 27: // escape
					this.closeSuggestionList();
					return false;
				break;
				default: // text
					if (this.search.length >= this.loadSuggestionFromTheNumberOfCharacters) {
						this.getSuggestionList();
					} else {
						this.closeSuggestionList();
					}
				break;
			}
		},
		mouseHandle: function(event) {
			if (!this.mouseHandleEnabeled) return;
			
			if (this.suggestions.length > 0) {
				if (event.deltaY < 0) { // scroll up
					this.suggestionListNavigation('next');
				} else if (event.deltaY > 0) { // scroll down
					this.suggestionListNavigation('prev');
				}
			}
		},
	}
}

export { suggestion };
