<template>
	<div class="collection-list">
	  <div class="header">
		<h2>Collections</h2>
		<button @click="refreshCollections">Refresh</button>
	  </div>
	  
	  <div v-if="loading" class="loading">Loading collections...</div>
	  <div v-else-if="error" class="error">{{ error }}</div>
	  <div v-else>
		<div v-for="collection in collections" :key="collection" class="collection-item">
		  <span>{{ collection }}</span>
		  <div class="actions">
			<button @click="viewCollection(collection)">View</button>
			<button @click="deleteCollection(collection)" class="danger">Delete</button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		collections: [],
		loading: false,
		error: null
	  }
	},
	mounted() {
	  this.fetchCollections()
	},
	methods: {
	  async fetchCollections() {
		this.loading = true
		this.error = null
		try {
		  const response = await fetch('http://localhost:8080/DB/collections')
		  if (!response.ok) throw new Error('Failed to fetch collections')
		  this.collections = await response.json()
		} catch (err) {
		  this.error = err.message
		} finally {
		  this.loading = false
		}
	  },
	  refreshCollections() {
		this.fetchCollections()
	  },
	  viewCollection(collectionName) {
		this.$router.push({ path: '/documents', query: { collection: collectionName } })
	  },
	  async deleteCollection(collectionName) {
		if (!confirm(`Are you sure you want to delete collection "${collectionName}"?`)) return
		
		try {
		  const response = await fetch(`http://localhost:8080/DB/collection?collection=${encodeURIComponent(collectionName)}`, {
			method: 'DELETE'
		  })
		  
		  if (!response.ok) throw new Error('Failed to delete collection')
		  this.fetchCollections()
		} catch (err) {
		  alert(err.message)
		}
	  }
	}
  }
  </script>
  
  <style scoped>
  .collection-list {
	max-width: 800px;
	margin: 0 auto;
  }
  
  .header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
  }
  
  .collection-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px;
	background: white;
	border-radius: 4px;
	margin-bottom: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .actions {
	display: flex;
	gap: 8px;
  }
  
  .danger {
	background-color: #e74c3c;
  }
  
  .loading, .error {
	padding: 20px;
	text-align: center;
  }
  
  .error {
	color: #e74c3c;
  }
  </style>