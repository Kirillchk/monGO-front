<template>
	<div class="json-editor">
	  <div v-if="editable" class="editable-grid compact">
		<div v-for="(item, index) in flattenedData" :key="index" class="grid-row">
		  <input
			type="text"
			v-model="item.key"
			class="key-input compact"
			@blur="handleKeyChange(index, $event)"
			placeholder="Key"
		  />
		  <input
			type="text"
			v-model="item.value"
			class="value-input compact"
			@blur="updateJson"
			placeholder="Value"
		  />
		</div>
		<button @click="addNewField" class="add-btn compact">+</button>
		<div v-if="!isValid" class="error">Invalid JSON</div>
	  </div>
	  <div v-else class="readonly-grid compact">
		<div v-for="(item, index) in flattenedData" :key="index" class="grid-row">
		  <span class="key-display compact">{{ item.key }}</span>
		  <span class="value-display compact">{{ item.value }}</span>
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
	  key: '',
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
	font-size: 0.9em;
  }
  
  .editable-grid, .readonly-grid {
	display: flex;
	flex-direction: column;
	gap: 4px;
  }
  
  .editable-grid.compact, .readonly-grid.compact {
	gap: 2px;
  }
  
  .grid-row {
	display: flex;
	gap: 4px;
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
	min-width: 80px;
  }
  
  .value-input {
	flex: 2;
	min-width: 120px;
  }
  
  .key-display, .value-display {
	padding: 4px;
	word-break: break-all;
	font-size: 0.85em;
  }
  
  .key-display.compact, .value-display.compact {
	padding: 3px;
	font-size: 0.8em;
  }
  
  .key-display {
	flex: 1;
	font-weight: bold;
  }
  
  .value-display {
	flex: 2;
  }
  
  .add-btn {
	width: 100%;
	padding: 4px;
	background: #2196F3;
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
	background: #0b7dda;
  }
  
  .error {
	color: #e74c3c;
	font-size: 0.75em;
	margin-top: 2px;
  }
  </style>