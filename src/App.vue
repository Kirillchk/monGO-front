<template>
	<div class="app-container">
	  <Sidebar />
	  <main class="main-content">
		<router-view />
	  </main>
	</div>
  </template>
  
  <script>
  import Sidebar from './components/Sidebar.vue'
  
  export default {
	components: { Sidebar }
  }
  </script>
  
  <style>
  @import './styles.css';
  </style>