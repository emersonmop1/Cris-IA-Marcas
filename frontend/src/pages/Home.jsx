import { Link } from 'react-router-dom'
import { Brain, FileText, Settings, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'Análise Inteligente',
      description: 'Utilize a potência do Claude 4.0 para análise profunda de marcas',
      color: 'text-blue-500'
    },
    {
      icon: Target,
      title: '7 Pilares Fundamentais',
      description: 'Metodologia completa com Persona, Necessidade, Mecanismo Único e mais',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Insights para TikTok',
      description: 'Estratégias específicas para criação de conteúdo viral',
      color: 'text-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Resultados Completos',
      description: 'Exporte em DOC e PDF com análise detalhada e acionável',
      color: 'text-yellow-500'
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Claude 4.0
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Análise de Marcas com
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent block">
                Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Transforme sua estratégia de marca com análises profundas e insights acionáveis. 
              Nossa plataforma utiliza metodologias avançadas para identificar oportunidades 
              e criar estratégias de conteúdo viral.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link
                to="/analysis"
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Iniciar Análise</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/prompts"
                className="btn-outline flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Settings className="w-5 h-5" />
                <span>Gerenciar Prompts</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Uma metodologia completa para análise estratégica de marcas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card p-8 text-center group hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Revolucionar sua Marca?
            </h2>
            
            <p className="text-xl text-white/90 mb-8">
              Comece agora sua análise estratégica e descubra o potencial inexplorado da sua marca
            </p>
            
            <Link
              to="/analysis"
              className="inline-flex items-center space-x-2 bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span>Começar Análise</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home