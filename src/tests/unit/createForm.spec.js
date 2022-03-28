import { shallowMount } from '@vue/test-utils'
import CreateForm from '@/components/CreateForm.vue'

describe('CreateForm.vue', () => {
  // Now mount the component and you have the wrapper
  const wrapper = shallowMount(CreateForm)
  
  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<h4 class="text-secondary">Details</h4>')
  })

  // it's also easy to check for the existence of elements
  it('has a error class', () => {
    expect(wrapper.find('.error').exists()).toBe(false)
  })
})