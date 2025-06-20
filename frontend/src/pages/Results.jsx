import { useState } from 'react'
import { Download, FileText, Clock, Search } from 'lucide-react'

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - in a real app, this would come from a database
  const mockResults = [
    {
      id: '1',
      title: 'Análise da Marca TechStart',
      date: '2024-06-15T10:30:00Z',
      summary: 'Análise completa de startup de tecnologia focada em automação empresarial...',
      content: 'Conteúdo completo da análise...'
    },
    {
      id: '2',
      title: 'Análise da Marca EcoLife',
      date: '2024-06-14T14:15:00Z',
      summary: 'Análise de marca de produtos sustentáveis para casa e jardim...',
      content: 'Conteúdo completo da análise...'
    }
  ]

  const filteredResults = mockResults.filter(result =>
    result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleExport = (format, result) => {
    // TODO: Implementar exportação real
    alert(`Exportando "${result.title}" em formato ${format}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Histórico de Análises
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Visualize e exporte suas análises anteriores
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar análises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhuma análise encontrada'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? 'Tente buscar com termos diferentes'
                  : 'Suas análises aparecerão aqui após serem criadas'
                }
              </p>
            </div>
          ) : (
            filteredResults.map((result) => (
              <div key={result.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {result.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(result.date)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {result.summary}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleExport('PDF', result)}
                      className="btn-outline flex items-center space-x-1 text-sm"
                      title="Exportar para PDF"
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                    
                    <button
                      onClick={() => handleExport('DOC', result)}
                      className="btn-outline flex items-center space-x-1 text-sm"
                      title="Exportar para Word"
                    >
                      <Download className="w-4 h-4" />
                      <span>DOC</span>
                    </button>
                  </div>
                </div>
                
                <button className="btn-primary text-sm">
                  Ver Análise Completa
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Results