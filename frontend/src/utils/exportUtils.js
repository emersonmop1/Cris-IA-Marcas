import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (content, filename = 'analise-marca') => {
  try {
    // Create a temporary div to render the content
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.padding = '40px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.color = 'black'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '12px'
    tempDiv.style.lineHeight = '1.6'
    
    // Format content for PDF
    const formattedContent = content
      .replace(/\n/g, '<br>')
      .replace(/#{1,6}\s(.+)/g, '<h2 style="color: #37E359; margin-top: 20px; margin-bottom: 10px;">$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #37E359; font-size: 24px; margin-bottom: 10px;">Análise de Marca</h1>
        <p style="color: #666; font-size: 14px;">Gerado por Cris IA Marcas</p>
      </div>
      <div>${formattedContent}</div>
    `
    
    document.body.appendChild(tempDiv)
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    // Remove temporary div
    document.body.removeChild(tempDiv)
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Erro ao exportar para PDF')
  }
}

export const exportToWord = (content, filename = 'analise-marca') => {
  try {
    // Create HTML content for Word
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Análise de Marca</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #37E359;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          h1 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #37E359;
            padding-bottom: 20px;
          }
          .subtitle {
            color: #666;
            font-size: 14px;
          }
          strong {
            font-weight: bold;
          }
          em {
            font-style: italic;
          }
          p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Análise de Marca</h1>
          <p class="subtitle">Gerado por Cris IA Marcas</p>
          <p class="subtitle">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          ${content
            .replace(/\n/g, '<br>')
            .replace(/#{1,6}\s(.+)/g, '<h2>$1</h2>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
          }
        </div>
      </body>
      </html>
    `
    
    // Create blob and download
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.doc`
    
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error exporting to Word:', error)
    throw new Error('Erro ao exportar para Word')
  }
}