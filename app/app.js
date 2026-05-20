// Farm Accounting - App Entry Point
// Full assembly in Task 20
const Vue = require('nativescript-vue');
Vue.registerElement('TabView', () => require('@nativescript/core').TabView);
Vue.registerElement('TabViewItem', () => require('@nativescript/core').TabViewItem);

new Vue({
  template: '<page><actionbar title="Farm Accounting" /><label text="Loading..." /></page>'
}).$start();
