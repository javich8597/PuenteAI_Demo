import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useForumStore = create((set, get) => ({
  questions: [],
  isLoading: false,

  fetchQuestions: async () => {
    set({ isLoading: true })
    
    // Fetch questions with author profile and all nested answers with their author profiles
    let { data, error } = await supabase
      .from('questions')
      .select(`
        id,
        title,
        content,
        category,
        is_validated,
        created_at,
        profiles ( name, role, avatar ),
        answers (
          id,
          content,
          is_validated,
          created_at,
          profiles ( name, role, avatar )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching questions:", error)
      // Do not return here, let it fall through to mock data fallback
      data = []
    }

    // Map to our frontend model
    const mappedQuestions = data.map(q => ({
      id: q.id,
      author: q.profiles?.name || 'Usuario',
      title: q.title,
      content: q.content,
      category: q.category,
      timestamp: q.created_at,
      answers: q.answers ? q.answers.length : 0,
      isValidated: q.is_validated,
      answersList: (q.answers || []).map(a => ({
        id: a.id,
        author: a.profiles?.name || 'Usuario',
        role: a.profiles?.role === 'admin' ? 'Madre Tutora' : 'Usuario',
        content: a.content,
        timestamp: a.created_at,
        isValidated: a.is_validated
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }))

    // FALLBACK MOCK DATA FOR DEMO PURPOSES
    if (mappedQuestions.length === 0) {
      const now = new Date()
      mappedQuestions.push(
        {
          id: 'mock-1',
          author: 'Lucía P.',
          title: '¿Ayudas para comedor escolar en Barcelona?',
          content: 'Hola a todas. Mi hijo empieza la primaria el año que viene y me gustaría saber qué pasos hay que seguir para solicitar las becas de comedor del Consorci. ¿Alguien lo ha hecho hace poco?',
          category: 'Educación',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          answers: 2,
          isValidated: true,
          answersList: [
            {
              id: 'ans-1-1',
              author: 'Carmen (Madre Tutora)',
              role: 'Madre Tutora',
              content: '¡Hola Lucía! Las solicitudes suelen abrirse en mayo. Tienes que tramitarlo a través de la web del Consorci d\'Educació usando el idCAT Mòbil. Si quieres te paso el enlace directo al formulario.',
              timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.5).toISOString(),
              isValidated: true
            },
            {
              id: 'ans-1-2',
              author: 'Elena',
              role: 'Usuario',
              content: 'Yo lo hice el año pasado. Además del formulario online, asegúrate de tener el volante de convivencia actualizado, a mí me lo pidieron porque acabábamos de mudarnos.',
              timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
              isValidated: false
            }
          ]
        },
        {
          id: 'mock-2',
          author: 'Sarah M.',
          title: 'Duda sobre el CAP y asignación de pediatra',
          content: 'Nos acabamos de empadronar. Fui al CAP de mi barrio pero me dijeron que la pediatra que nos toca está de baja y la sustituta solo atiende por las mañanas. Por mi horario de trabajo me es imposible. ¿Puedo pedir cambio de CAP o de pediatra aunque sea fuera de mi zona?',
          category: 'Salud',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          answers: 1,
          isValidated: false,
          answersList: [
            {
              id: 'ans-2-1',
              author: 'Admin MUSA',
              role: 'Madre Tutora',
              content: 'Hola Sarah. Por ley tienes derecho a la libre elección de médico y pediatra dentro de Cataluña. Puedes solicitar el cambio presencialmente en el mostrador del CAP que prefieras o a través de La Meva Salut. Ten en cuenta que si el nuevo pediatra tiene el cupo muy lleno podrían denegarlo, pero por temas de conciliación laboral suelen aceptarlo.',
              timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 22).toISOString(),
              isValidated: true
            }
          ]
        },
        {
          id: 'mock-3',
          author: 'Fátima',
          title: 'Ropa de invierno para bebé de 6 meses',
          content: 'Hola mamás, mi bebé está creciendo súper rápido y la ropa de invierno que le compré ya no le sirve. ¿Alguien sabe de alguna red de intercambio de ropa en la zona de Sant Andreu?',
          category: 'Ayuda Comunitaria',
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          answers: 0,
          isValidated: false,
          answersList: []
        }
      )
    }

    set({ questions: mappedQuestions, isLoading: false })
  },

  addQuestion: async (title, content, category) => {
    // 1. Actualización local inmediata (Optimistic UI para demo)
    const newQuestionLocal = {
      id: 'local-' + Date.now(),
      author: 'Tú', 
      title,
      content,
      category,
      timestamp: new Date().toISOString(),
      answers: 0,
      isValidated: false,
      answersList: []
    };
    
    set((state) => ({
      questions: [newQuestionLocal, ...state.questions]
    }));

    // 2. Intento de guardado en Supabase (si falla, no rompe la UI)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('questions').insert([
        { author_id: session.user.id, title, content, category }
      ]);
    }
  },

  addAnswer: async (questionId, content) => {
    // 1. Actualización local inmediata (Optimistic UI)
    const newAnswerLocal = {
      id: 'local-ans-' + Date.now(),
      author: 'Tú',
      role: 'Usuario',
      content,
      timestamp: new Date().toISOString(),
      isValidated: false
    };

    set((state) => ({
      questions: state.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers + 1,
            answersList: [...q.answersList, newAnswerLocal]
          };
        }
        return q;
      })
    }));

    // 2. Intento de guardado en Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('answers').insert([
        { question_id: questionId, author_id: session.user.id, content }
      ]);
    }
  },
  
  subscribeToChanges: () => {
    const channel = supabase.channel('forum_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => {
        get().fetchQuestions()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, () => {
        get().fetchQuestions()
      })
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }
}))

export default useForumStore
