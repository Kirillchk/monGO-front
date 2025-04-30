<template>
	<div class="document-viewer">
	  <div class="header">
		<h2>Documents in {{ collectionName }}</h2>
		<div>
		  <button @click="refreshDocuments">Refresh</button>
		  <button @click="showAddDialog = true">Add Document</button>
		</div>
	  </div>
	  
	  <div v-if="loading" class="loading">Loading documents...</div>
	  <div v-else-if="error" class="error">{{ error }}</div>
	  <div v-else>
		<div v-for="(doc, index) in documents" :key="index" class="document-item">
		  <JsonEditor :value="doc" :editable="true" @update="updateDocument(index, $event)" />
		  <button @click="deleteDocument(doc)" class="danger">Delete</button>
		</div>
	  </div>
	  
	  <div v-if="showAddDialog" class="dialog-overlay">
		<div class="dialog">
		  <h3>Add New Document</h3>
		  <JsonEditor :value="newDocument" :editable="true" @update="newDocument = $event" />
		  <div class="dialog-actions">
			<button @click="addDocument">Add</button>
			<button @click="showAddDialog = false">Cancel</button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import JsonEditor from './JsonEditor.vue'
  const API = import.meta.env.VITE_GO_API
  export default {
	components: { JsonEditor },
	props: {
	  collectionName: {
		type: String,
		required: true
	  }
	},
	data() {
	  return {
		documents: [],
		loading: false,
		error: null,
		showAddDialog: false,
		newDocument: {}
	  }
	},
	watch: {
	  collectionName() {
		this.fetchDocuments()
	  }
	},
	mounted() {
	  this.fetchDocuments()
	},
	methods: {
	  async fetchDocuments() {
		if (!this.collectionName) return
		
		this.loading = true
		this.error = null
		try {
		  const response = await fetch(`${API}DB/collection?collection=${encodeURIComponent(this.collectionName)}`)
		  if (!response.ok) throw new Error('Failed to fetch documents')
		  const data = await response.text()
		  this.documents = JSON.parse(data)
		} catch (err) {
		  this.error = err.message
		} finally {
		  this.loading = false
		}
	  },
	  refreshDocuments() {
		this.fetchDocuments()
	  },
	  async addDocument() {
		try {
		  const response = await fetch(`${API}DB/document?collection=` + encodeURIComponent(this.collectionName), {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.newDocument)
		  })
		  
		  if (!response.ok) throw new Error('Failed to add document')
		  this.showAddDialog = false
		  this.newDocument = {}
		  this.fetchDocuments()
		} catch (err) {
		  alert(err.message)
		}
	  },
	  async updateDocument(index, updatedDoc) {
		try {
		  const originalDoc = this.documents[index]
		  const response = await fetch(`${API}DB/document?collection=${encodeURIComponent(this.collectionName)}`, {
			method: 'PATCH',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify([originalDoc, updatedDoc])
		  })
		  
		  if (!response.ok) throw new Error('Failed to update document')
		  this.fetchDocuments()
		} catch (err) {
		  alert(err.message)
		}
	  },
	  async deleteDocument(doc) {
		if (!confirm('Are you sure you want to delete this document?')) return
		
		try {
		  const response = await fetch(`${API}DB/document?collection=` + encodeURIComponent(this.collectionName), {
			method: 'DELETE',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(doc)
		  })
		  
		  if (!response.ok) throw new Error('Failed to delete document')
		  this.fetchDocuments()
		} catch (err) {
		  alert(err.message)
		}
	  }
	}
  }
  </script>
  
  <style scoped>
  .document-viewer {
	max-width: 1000px;
	margin: 0 auto;
  }
  
  .header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
  }
  
  .header > div {
	display: flex;
	gap: 10px;
  }
  
  .document-item {
	margin-bottom: 20px;
	padding: 15px;
	background: white;
	border-radius: 4px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .danger {
	margin-top: 10px;
	background-color: #e74c3c;
  }
  
  .dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
  }
  
  .dialog {
	background: white;
	padding: 20px;
	border-radius: 8px;
	width: 80%;
	max-width: 600px;
	max-height: 80vh;
	overflow: auto;
  }
  
  .dialog-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 20px;
  }
  </style>