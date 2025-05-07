<template>
	<div class="document-creator">
	  <div class="field-grid compact">
		<div v-for="(item, index) in fields" :key="index" class="grid-row">
		  <input
			type="text"
			v-model="item.key"
			class="key-input compact"
			placeholder="Field name"
		  />
		  <input
			type="text"
			v-model="item.value"
			class="value-input compact"
			placeholder="Value"
			@blur="emitDocument"
		  />
		  <button 
			@click="removeField(index)"
			class="remove-btn compact"
			title="Remove field"
		  >
			×
		  </button>
		</div>
		<button @click="addNewField" class="add-btn compact">+ Add Field</button>
		<div v-if="validationError" class="error">{{ validationError }}</div>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const emit = defineEmits(['update'])
  
  const fields = ref([{ key: '', value: '' }])
  const validationError = ref('')
  
  const addNewField = () => {
	fields.value.push({ key: '', value: '' })
  }
  
  const removeField = (index) => {
	if (fields.value.length > 1) {
	  fields.value.splice(index, 1)
	  emitDocument()
	}
  }
  
  const buildDocument = () => {
	const doc = {}
	validationError.value = ''
	
	for (const field of fields.value) {
	  if (!field.key && field.value) {
		validationError.value = 'Field name cannot be empty when value is provided'
		return null
	  }
	  
	  if (field.key) {
		try {
		  // Try to parse JSON values (like numbers, booleans, arrays)
		  doc[field.key] = field.value ? JSON.parse(field.value) : null
		} catch {
		  // If not valid JSON, use as string
		  doc[field.key] = field.value || null
		}
	  }
	}
	
	return doc
  }
  
  const emitDocument = () => {
	const doc = buildDocument()
	if (doc) {
	  emit('update', doc)
	}
  }
  
  watch(fields, () => {
	emitDocument()
  }, { deep: true })
  </script>
  
  <style scoped>
  .document-creator {
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	font-size: 0.9em;
  }
  
  .field-grid {
	display: flex;
	flex-direction: column;
	gap: 4px;
  }
  
  .field-grid.compact {
	gap: 2px;
  }
  
  .grid-row {
	display: flex;
	gap: 4px;
	align-items: center;
  }
  
  .key-input, .value-input {
	padding: 4px 6px;
	border: 1px solid #ddd;
	border-radius: 3px;
	font-size: 0.85em;
  }
  
  .key-input.compact, .value-input.compact {
	padding: 3px 5px;
	font-size: 0.8em;
  }
  
  .key-input {
	flex: 1;
	min-width: 100px;
  }
  
  .value-input {
	flex: 2;
	min-width: 150px;
  }
  
  .add-btn {
	width: 100%;
	padding: 4px;
	background: #4CAF50;
	color: white;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	font-size: 0.9em;
	margin-top: 4px;
  }
  
  .add-btn.compact {
	padding: 3px;
	font-size: 0.8em;
	margin-top: 2px;
  }
  
  .add-btn:hover {
	background: #3e8e41;
  }
  
  .remove-btn {
	padding: 0 6px;
	background: #f44336;
	color: white;
	border: none;
	border-radius: 3px;
	cursor: pointer;
	font-size: 1em;
  }
  
  .remove-btn.compact {
	padding: 0 5px;
	font-size: 0.9em;
  }
  
  .remove-btn:hover {
	background: #d32f2f;
  }
  
  .error {
	color: #e74c3c;
	font-size: 0.75em;
	margin-top: 2px;
  }
  </style>