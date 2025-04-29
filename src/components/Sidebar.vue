<template>
	<aside class="sidebar">
	  <h2>MongoDB Admin</h2>
	  <nav>
		<router-link to="/collections">Collections</router-link>
	  </nav>
	</aside>
  </template>
  
  <script>
  export default {
	name: 'Sidebar'
  }
  </script>
  
  <style scoped>
  .sidebar {
	width: var(--sidebar-width);
	background-color: white;
	height: 100vh;
	position: fixed;
	padding: 20px;
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar h2 {
	margin-bottom: 30px;
	color: var(--primary-color);
  }
  
  .sidebar nav {
	display: flex;
	flex-direction: column;
	gap: 10px;
  }
  
  .sidebar a {
	text-decoration: none;
	color: var(--secondary-color);
	padding: 8px 12px;
	border-radius: 4px;
	transition: background-color 0.3s;
  }
  
  .sidebar a:hover {
	background-color: #e1e5eb;
  }
  
  .router-link-active {
	background-color: var(--primary-color);
	color: white !important;
  }
  </style>