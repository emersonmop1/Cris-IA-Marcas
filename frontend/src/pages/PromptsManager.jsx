import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, FileText, Clock } from 'lucide-react'
import { promptService } from '../services/api'

const PromptsManager = () => {
  const [prompts, setPrompts] = useState([])
  const [defaultPrompt, setDefaultPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' })

  useEffect(() => {
    loadPrompts()
    loadDefaultPrompt()
  }, [])

  const loadPrompts = async () => {
    try {
      const data = await promptService.getPrompts()
      setPrompts(data)
    } catch (error) {
      console.error('Erro ao carregar prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDefaultPrompt = async () => {
    try {
      const data = await promptService.getDefaultPrompt()
      setDefaultPrompt(data.prompt)
    } catch (error) {
      console.error('Erro ao carregar prompt padrão:', error)
    }
  }

  const handleSavePrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) {
      alert('Nome e conteúdo são obrigatórios')
      return
    }

    try {
      await promptService.savePrompt(newPrompt.name, newPrompt.content)
      setNewPrompt({ name: '', content: '' })
      setIsCreating(false)
      loadPrompts()
    } catch (error) {
      console.error('Erro ao salvar prompt:', error)
      alert('Erro ao salvar prompt')
    }
  }

  const handleDeletePrompt = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este prompt?')) return

    try {
      await promptService.deletePrompt(id)
      loadPrompts()
    } catch (error) {
      console.error('Erro ao deletar prompt:', error)
      alert('Erro ao deletar prompt')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Gerenciador de Prompts
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Crie e gerencie prompts personalizados para suas análises de marca
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Prompts Personalizados
            </h2>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Prompt</span>
            </button>
          </div>

          {isCreating && (
            <div className="card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Criar Novo Prompt
              </h3>
              
              <input
                type="text"
                placeholder="Nome do prompt"
                value={newPrompt.name}
                onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                className="input-field"
              />
              
              <textarea
                placeholder="Conteúdo do prompt"
                value={newPrompt.content}
                onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
                rows={8}
                className="textarea-field"
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSavePrompt}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewPrompt({ name: '', content: '' })
                  }}
                  className="btn-outline flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {prompts.length === 0 ? (
              <div className="card p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum prompt personalizado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Crie seu primeiro prompt para começar
                </p>
              </div>
            ) : (
              prompts.map((prompt) => (
                <div key={prompt.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {prompt.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(prompt.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingId(prompt.id)}
                        className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {editingId === prompt.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={prompt.content}
                        onChange={(e) => {
                          setPrompts(prompts.map(p => 
                            p.id === prompt.id ? { ...p, content: e.target.value } : p
                          ))
                        }}
                        rows={6}
                        className="textarea-field"
                      />
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            // Aqui você salvaria as mudanças
                            setEditingId(null)
                          }}
                          className="btn-primary flex items-center space-x-2 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setEditingId(null)
                            loadPrompts() // Recarrega para desfazer mudanças
                          }}
                          className="btn-outline flex items-center space-x-2 text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {prompt.content.substring(0, 200)}...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Prompt Padrão
          </h2>
          
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Metodologia Completa de Análise
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {defaultPrompt}
              </pre>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Dica:</strong> Este é o prompt padrão que contém a metodologia completa 
                dos 7 pilares fundamentais. Você pode criar prompts personalizados para análises 
                específicas ou usar este como base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptsManager