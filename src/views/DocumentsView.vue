<template>
	<div class="documents-view">
	  <DocumentViewer :collection-name="collectionName" />
	</div>
  </template>
  
  <script>
  import DocumentViewer from '../components/DocumentViewer.vue'
  
  export default {
	components: { DocumentViewer },
	props: {
	  collectionName: {
		type: String,
		required: true
	  }
	}
  }
  </script>
  
  <style scoped>
  .documents-view {
	padding: 20px;
  }
  </style>