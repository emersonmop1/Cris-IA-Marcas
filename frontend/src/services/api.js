import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const promptService = {
  async getPrompts() {
    const response = await api.get('/prompts')
    return response.data
  },

  async getDefaultPrompt() {
    const response = await api.get('/prompts/default')
    return response.data
  },

  async savePrompt(name, content) {
    const response = await api.post('/prompts', { name, content })
    return response.data
  },

  async deletePrompt(id) {
    const response = await api.delete(`/prompts/${id}`)
    return response.data
  }
}

export const analysisService = {
  async analyzeWithStreaming(humanPrompt, rolePrompt, file, onChunk, onComplete, onError) {
    try {
      const formData = new FormData()
      formData.append('humanPrompt', humanPrompt)
      formData.append('rolePrompt', rolePrompt)
      
      if (file) {
        formData.append('file', file)
      }

      const response = await fetch(`${API_BASE_URL}/analysis/stream`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                onError(data.error)
                return
              }
              
              if (data.done) {
                onComplete()
                return
              }
              
              if (data.content) {
                onChunk(data.content)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      onError(error.message || 'Erro na conexão')
    }
  }
}

export default api