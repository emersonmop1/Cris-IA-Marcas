import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Send, Loader, X, Settings, Brain, Download } from 'lucide-react'
import { promptService, analysisService } from '../services/api'
import { exportToPDF, exportToWord } from '../utils/exportUtils'

const Analysis = () => {
  const navigate = useNavigate()
  const resultRef = useRef(null)
  const [prompts, setPrompts] = useState([])
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [humanPrompt, setHumanPrompt] = useState('')
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

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
    }
  }

  const loadDefaultPrompt = async () => {
    try {
      const data = await promptService.getDefaultPrompt()
      setSelectedPrompt(data.prompt)
    } catch (error) {
      console.error('Erro ao carregar prompt padrão:', error)
    }
  }

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (allowedTypes.includes(uploadedFile.type)) {
        setFile(uploadedFile)
        setError('')
      } else {
        setError('Tipo de arquivo não suportado. Use PDF, DOC, DOCX ou TXT.')
        event.target.value = ''
      }
    }
  }

  const removeFile = () => {
    setFile(null)
    document.getElementById('fileInput').value = ''
  }

  const handlePromptChange = (promptId) => {
    if (promptId === 'custom') {
      setUseCustomPrompt(true)
      setSelectedPrompt('')
    } else if (promptId === 'default') {
      setUseCustomPrompt(false)
      loadDefaultPrompt()
    } else {
      setUseCustomPrompt(false)
      const selectedPromptData = prompts.find(p => p.id === promptId)
      if (selectedPromptData) {
        setSelectedPrompt(selectedPromptData.content)
      }
    }
  }

  const startAnalysis = async () => {
    if (!humanPrompt.trim()) {
      setError('Por favor, insira uma descrição da marca')
      return
    }

    const rolePrompt = useCustomPrompt ? customPrompt : selectedPrompt
    if (!rolePrompt.trim()) {
      setError('Por favor, selecione ou crie um prompt de sistema')
      return
    }

    setIsAnalyzing(true)
    setResult('')
    setError('')

    // Scroll to results section
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    await analysisService.analyzeWithStreaming(
      humanPrompt,
      rolePrompt,
      file,
      (chunk) => {
        setResult(prev => prev + chunk)
      },
      () => {
        setIsAnalyzing(false)
      },
      (errorMessage) => {
        setError(errorMessage)
        setIsAnalyzing(false)
      }
    )
  }

  const handleExportToPDF = async () => {
    if (!result) return
    try {
      await exportToPDF(result, 'analise-marca')
    } catch (error) {
      setError(error.message)
    }
  }

  const handleExportToWord = () => {
    if (!result) return
    try {
      exportToWord(result, 'analise-marca')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Análise de Marca
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Configure seus prompts e inicie a análise completa da sua marca
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuração do Prompt
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escolha o Prompt de Sistema
                </label>
                <select
                  onChange={(e) => handlePromptChange(e.target.value)}
                  className="input-field"
                  value={useCustomPrompt ? 'custom' : (selectedPrompt === prompts.find(p => p.content === selectedPrompt)?.content ? prompts.find(p => p.content === selectedPrompt)?.id : 'default')}
                >
                  <option value="default">Prompt Padrão (Metodologia Completa)</option>
                  {prompts.map(prompt => (
                    <option key={prompt.id} value={prompt.id}>
                      {prompt.name}
                    </option>
                  ))}
                  <option value="custom">Criar Prompt Personalizado</option>
                </select>
              </div>

              {useCustomPrompt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prompt Personalizado
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Digite seu prompt personalizado aqui..."
                    rows={6}
                    className="textarea-field"
                  />
                </div>
              )}

              {!useCustomPrompt && selectedPrompt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview do Prompt Selecionado
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedPrompt.substring(0, 200)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Descrição da Marca
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload de Arquivo (Opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary dark:hover:border-primary transition-colors">
                  {file ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-700 dark:text-green-300">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Arraste um arquivo ou clique para selecionar
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PDF, DOC, DOCX ou TXT (máx. 10MB)
                      </p>
                      <input
                        id="fileInput"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.txt"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição da Marca
                </label>
                <textarea
                  value={humanPrompt}
                  onChange={(e) => setHumanPrompt(e.target.value)}
                  placeholder="Descreva sua marca, produto ou serviço aqui. Inclua informações sobre o público-alvo, proposta de valor, diferenciais, etc."
                  rows={8}
                  className="textarea-field"
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analisando...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Iniciar Análise</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div ref={resultRef} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Resultado da Análise
              </h3>
              
              {result && !isAnalyzing && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleExportToPDF}
                    className="btn-outline flex items-center space-x-1 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleExportToWord}
                    className="btn-outline flex items-center space-x-1 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOC</span>
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-96 max-h-96 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {isAnalyzing && !result && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Iniciando análise com Claude...
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                    {result}
                    {isAnalyzing && <span className="typing-animation"></span>}
                  </pre>
                </div>
              )}

              {!result && !isAnalyzing && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Configure seus prompts e clique em "Iniciar Análise"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis