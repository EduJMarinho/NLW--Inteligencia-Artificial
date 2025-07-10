const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
const model = "gemini-2.0-flash"
const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
const pergunta = `
## Especialidade
Você é um assistente de meta para o jogo ${game}
## Tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas
## Resposta
- Economize na resposta, seja direto e responda no máximo 500 caracteres
- Responda em markdown
- Não faça nenhuma saudação ou despedida, apenas responda o que o usuário está  querendo
## Exemplo de resposta
Pergunta do Usuário: Melhor Build rengar jungle
Resposta: A Build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui. \n\n exemplo de runas \n\n
--- 
Aqui está a pergunta do usuário: ${question}
`
//prompt muito longo travou a resposta, foi necessário 'enxugar'


const contents = [{
  role: "user",
  parts: [{
    text: pergunta
  }]
}]

const tools = [{
  google_search: {}
}]

//chamada API
const response = await fetch(geminiURL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
 
   body: JSON.stringify({
    contents,
    tools
  })

})
const data = await response.json()
return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault()  
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

   if(apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos')
    return
  }

askButton.disabled = true
askButton.textContent = 'Perguntando...'
askButton.classList.add('loading')

try {  
const text = await perguntarAI(question, game, apiKey)
aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
aiResponse.classList.remove('hidden')

}  catch(error) { 
  console.log('Erro', error)
} finally { 
  askButton.disabled = false
  askButton.textContent = "Perguntar"
  askButton.classList.remove('loading')
}

}
form.addEventListener('submit', enviarFormulario)