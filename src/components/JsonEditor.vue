<template>
	<div class="json-editor">
	  <textarea 
		v-if="editable" 
		v-model="jsonString" 
		@blur="updateJson"
		:class="{ 'invalid': !isValid }"
	  ></textarea>
	  <pre v-else>{{ formattedJson }}</pre>
	  <div v-if="editable && !isValid" class="error">Invalid JSON</div>
	</div>
  </template>
  
  <script>
  export default {
	props: {
	  value: {
		type: [Object, Array],
		required: true
	  },
	  editable: {
		type: Boolean,
		default: false
	  }
	},
	data() {
	  return {
		jsonString: JSON.stringify(this.value, null, 2),
		isValid: true
	  }
	},
	computed: {
	  formattedJson() {
		return JSON.stringify(this.value, null, 2)
	  }
	},
	watch: {
	  value(newVal) {
		this.jsonString = JSON.stringify(newVal, null, 2)
		this.isValid = true
	  }
	},
	methods: {
	  updateJson() {
		try {
		  const parsed = JSON.parse(this.jsonString)
		  this.isValid = true
		  this.$emit('update', parsed)
		} catch (e) {
		  this.isValid = false
		}
	  }
	}
  }
  </script>
  
  <style scoped>
  .json-editor {
	font-family: monospace;
  }
  
  textarea, pre {
	width: 100%;
	min-height: 100px;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 4px;
	font-family: monospace;
	white-space: pre;
	overflow-x: auto;
  }
  
  textarea.invalid {
	border-color: #e74c3c;
  }
  
  .error {
	color: #e74c3c;
	font-size: 0.8em;
	margin-top: 5px;
  }
  </style>