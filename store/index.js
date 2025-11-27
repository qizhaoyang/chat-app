import Vuex from 'vuex';
import Vue from 'vue';
import author from './author.js'
import chat from './chat.js'
import prompt from './prompt.js';
Vue.use(Vuex)
export default new Vuex.Store({
	
	modules: {
		author,
    chat,
    prompt
	}
})