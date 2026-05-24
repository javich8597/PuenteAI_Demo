import { create } from 'zustand'

const mockQuestions = [
  {
    id: 'q1',
    author: 'Usuario Anónimo',
    title: '¿Cómo empadronar a mi hijo recién nacido si me falta un papel del hospital?',
    content: 'Fui al ayuntamiento y me dijeron que necesito el alta del hospital pero no la encuentro. ¿Hay alguna alternativa?',
    category: 'Trámites',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    answers: 3,
    isValidated: true,
    answersList: [
      {
        id: 'a1',
        author: 'María C.',
        role: 'Madre Tutora',
        content: 'Puedes pedir un duplicado directamente en el mostrador del hospital donde diste a luz con tu DNI/NIE.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isValidated: true
      }
    ]
  },
  {
    id: 'q2',
    author: 'Lucía G.',
    title: '¿Dónde puedo encontrar ropa de invierno talla 4 años gratis o muy barata?',
    content: 'Este año mi niña ha crecido muchísimo y no nos llega para comprar abrigo nuevo.',
    category: 'Ayuda Material',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    answers: 0,
    isValidated: false,
    answersList: []
  }
]

const useForumStore = create((set, get) => ({
  questions: mockQuestions,

  addQuestion: (title, content, category) => {
    const newQuestion = {
      id: `q${Date.now()}`,
      author: 'Tú',
      title,
      content,
      category,
      timestamp: new Date().toISOString(),
      answers: 0,
      isValidated: false,
      answersList: []
    }
    set(state => ({
      questions: [newQuestion, ...state.questions]
    }))
  },

  addAnswer: (questionId, content) => {
    const newAnswer = {
      id: `a${Date.now()}`,
      author: 'Tú',
      role: 'Usuario',
      content,
      timestamp: new Date().toISOString(),
      isValidated: false
    }
    set(state => ({
      questions: state.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              answers: q.answers + 1,
              answersList: [...q.answersList, newAnswer] 
            } 
          : q
      )
    }))
  }
}))

export default useForumStore
