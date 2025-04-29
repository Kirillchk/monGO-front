<template>
	<div class="collections-view">
	  <CollectionList />
	</div>
  </template>
  
  <script>
  import CollectionList from '../components/CollectionList.vue'
  
  export default {
	components: { CollectionList }
  }
  </script>
  
  <style scoped>
  .collections-view {
	padding: 20px;
  }
  </style>