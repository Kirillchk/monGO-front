<template>
	<div class="collection-list">
	  <div class="header">
		<h2>Collections</h2>
		<button @click="refreshCollections">Refresh</button>
		<button @click="showAddModal = true">Add collection</button>
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
  
	  <!-- Add Collection Modal -->
	  <div v-if="showAddModal" class="modal">
		<div class="modal-content">
		  <h3>Create New Collection</h3>
		  <input 
			v-model="newCollectionName" 
			@keyup.enter="createCollection"
			placeholder="Collection name"
			ref="collectionNameInput"
		  />
		  <div v-if="addError" class="error-text">{{ addError }}</div>
		  <div class="modal-actions">
			<button @click="showAddModal = false">Cancel</button>
			<button @click="createCollection" class="primary">Create</button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  const API = import.meta.env.VITE_GO_API
  export default {
	data() {
	  return {
		collections: [],
		loading: false,
		error: null,
		showAddModal: false,
		newCollectionName: '',
		addError: null
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
		  const response = await fetch(`${API}/DB/collections`)
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
		  const response = await fetch(`${API}/DB/collection?collection=${encodeURIComponent(collectionName)}`, {
			method: 'DELETE'
		  })
		  
		  if (!response.ok) throw new Error('Failed to delete collection')
		  this.fetchCollections()
		} catch (err) {
		  alert(err.message)
		}
	  },
	  async createCollection() {
		if (!this.newCollectionName.trim()) {
		  this.addError = "Collection name cannot be empty"
		  return
		}
  
		try {
		  const response = await fetch(`${API}/DB/collection?collection=${this.newCollectionName.trim()}`, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			  collection: this.newCollectionName.trim()
			})
		  })
  
		  if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || 'Failed to create collection')
		  }
  
		  // Success - close modal and refresh
		  this.showAddModal = false
		  this.newCollectionName = ''
		  this.addError = null
		  this.fetchCollections()
		} catch (err) {
		  this.addError = err.message
		}
	  }
	},
	watch: {
	  showAddModal(newVal) {
		if (newVal) {
		  this.$nextTick(() => {
			this.$refs.collectionNameInput?.focus()
		  })
		} else {
		  this.newCollectionName = ''
		  this.addError = null
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
  
  /* Modal styles */
  .modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
  }
  
  .modal-content {
	background: white;
	padding: 20px;
	border-radius: 8px;
	width: 400px;
	max-width: 90%;
  }
  
  .modal-content h3 {
	margin-top: 0;
  }
  
  .modal-content input {
	width: 100%;
	padding: 8px;
	margin: 10px 0;
	box-sizing: border-box;
  }
  
  .modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 15px;
  }
  
  .primary {
	background-color: #3498db;
	color: white;
  }
  
  .error-text {
	color: #e74c3c;
	font-size: 0.9em;
	margin-top: 5px;
  }
  </style>