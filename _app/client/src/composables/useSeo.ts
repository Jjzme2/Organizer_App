import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getMetaConfig, generateMetaTags } from '../config/seo'

export function useSeo() {
  const route = useRoute()
  const currentMetaTags = ref<HTMLElement[]>([])

  const updateMetaTags = (pageName: string) => {
    // Remove existing meta tags
    currentMetaTags.value.forEach(tag => {
      if (tag.parentNode) {
        tag.parentNode.removeChild(tag)
      }
    })
    currentMetaTags.value = []

    // Get meta config for current page
    const metaConfig = getMetaConfig(pageName)
    const tags = generateMetaTags(metaConfig)

    // Create and append new meta tags
    const head = document.head
    tags.forEach(tagInfo => {
      const tag = document.createElement('meta')
      
      // Set attributes based on whether it's a property or name
      if ('property' in tagInfo) {
        tag.setAttribute('property', tagInfo.property)
      } else {
        tag.setAttribute('name', tagInfo.name)
      }
      
      tag.setAttribute('content', tagInfo.content)
      head.appendChild(tag)
      currentMetaTags.value.push(tag)
    })

    // Update document title
    document.title = metaConfig.title
  }

  // Watch for route changes
  watch(
    () => route.name,
    (newRouteName) => {
      if (newRouteName) {
        updateMetaTags(newRouteName.toString())
      }
    },
    { immediate: true }
  )

  return {
    updateMetaTags
  }
}
