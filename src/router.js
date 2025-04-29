import { createRouter, createWebHistory } from 'vue-router'
import CollectionsView from './views/CollectionsView.vue'
import DocumentsView from './views/DocumentsView.vue'

const routes = [
  { path: '/', redirect: '/collections' },
  { path: '/collections', component: CollectionsView },
  { path: '/documents', component: DocumentsView, props: (route) => ({ collectionName: route.query.collection }) }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router