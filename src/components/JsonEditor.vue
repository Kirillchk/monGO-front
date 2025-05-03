<template>
	<div class="json-editor">
	  <div v-if="editable" class="editable-grid">
		<div class="grid-header">
		  <span class="key-header">Key</span>
		  <span class="value-header">Value</span>
		</div>
		<div v-for="(item, index) in flattenedData" :key="index" class="grid-row">
		  <input
			type="text"
			v-model="item.key"
			class="key-input"
			@blur="handleKeyChange(index, $event)"
		  />
		  <input
			type="text"
			v-model="item.value"
			class="value-input"
			@blur="updateJson"
		  />
		</div>
		<button @click="addNewField" class="add-btn">+</button>
		<div v-if="!isValid" class="error">Invalid JSON structure</div>
	  </div>
	  <div v-else class="readonly-grid">
		<div class="grid-header">
		  <span class="key-header">Key</span>
		  <span class="value-header">Value</span>
		</div>
		<div v-for="(value, key) in flattenedData" :key="key" class="grid-row">
		  <span class="key-display">{{ key }}</span>
		  <span class="value-display">{{ value }}</span>
		</div>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
	value: {
	  type: [Object, Array],
	  required: true
	},
	editable: {
	  type: Boolean,
	  default: false
	}
  })
  
  const emit = defineEmits(['update'])
  
  const flattenedData = ref([])
  const originalData = ref({})
  const isValid = ref(true)
  
  const flattenObject = (obj, prefix = '') => {
	const result = []
	for (const key in obj) {
	  if (obj.hasOwnProperty(key)) {
		const newKey = prefix ? `${prefix}.${key}` : key
		if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
		  result.push(...flattenObject(obj[key], newKey))
		} else {
		  result.push({
			key: newKey,
			value: typeof obj[key] === 'string' ? obj[key] : JSON.stringify(obj[key])
		  })
		}
	  }
	}
	return result
  }
  
  const unflattenObject = () => {
	const result = {}
	for (const item of flattenedData.value) {
	  const keys = item.key.split('.')
	  let current = result
	  for (let i = 0; i < keys.length; i++) {
		const part = keys[i]
		if (i === keys.length - 1) {
		  try {
			current[part] = JSON.parse(item.value)
		  } catch {
			current[part] = item.value
		  }
		} else {
		  current[part] = current[part] || {}
		  current = current[part]
		}
	  }
	}
	return result
  }
  
  const updateJson = () => {
	try {
	  const updatedData = unflattenObject()
	  const changes = {}
	  
	  for (const item of flattenedData.value) {
		const originalValue = getNestedValue(originalData.value, item.key)
		const newValue = getNestedValue(updatedData, item.key)
		
		if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
		  setNestedValue(changes, item.key, newValue)
		}
	  }
	  
	  const updatePayload = [
		originalData.value,
		{ "$set": changes }
	  ]
	  
	  isValid.value = true
	  emit('update', updatePayload)
	} catch (e) {
	  console.error(e)
	  isValid.value = false
	}
  }
  
  const getNestedValue = (obj, path) => {
	return path.split('.').reduce((o, p) => o?.[p], obj)
  }
  
  const setNestedValue = (obj, path, value) => {
	const parts = path.split('.')
	const last = parts.pop()
	let current = obj
	
	for (const part of parts) {
	  current[part] = current[part] || {}
	  current = current[part]
	}
	
	current[last] = value
  }
  
  const addNewField = () => {
	flattenedData.value.push({
	  key: `newField${flattenedData.value.length + 1}`,
	  value: ''
	})
  }
  
  const handleKeyChange = (index, event) => {
	const newKey = event.target.value
	flattenedData.value[index].key = newKey
	updateJson()
  }
  
  watch(() => props.value, (newVal) => {
	originalData.value = JSON.parse(JSON.stringify(newVal))
	flattenedData.value = flattenObject(newVal)
  }, { immediate: true })
  </script>
  
  <style scoped>
  .json-editor {
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .editable-grid, .readonly-grid {
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: 8px;
	align-items: center;
  }
  
  .grid-header {
	grid-column: 1 / -1;
	display: grid;
	grid-template-columns: 1fr 2fr;
	font-weight: bold;
	padding: 8px;
	background-color: #f5f5f5;
	border-radius: 4px;
  }
  
  .grid-row {
	display: contents;
  }
  
  .key-input, .value-input {
	padding: 8px;
	border: 1px solid #ddd;
	border-radius: 4px;
	height: 40px;
  }
  
  .key-input {
	font-weight: bold;
  }
  
  .key-display, .value-display {
	padding: 8px;
	border: 1px solid transparent;
	word-break: break-all;
  }
  
  .key-display {
	font-weight: bold;
  }
  
  .add-btn {
	grid-column: 1;
	width: 24px;
	height: 24px;
	padding: 0;
	background: #2196F3;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
  }
  
  .add-btn:hover {
	background: #0b7dda;
  }
  
  .error {
	grid-column: 1 / -1;
	color: #e74c3c;
	font-size: 0.8em;
	margin-top: 5px;
  }
  </style>