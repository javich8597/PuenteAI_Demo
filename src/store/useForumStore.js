import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useForumStore = create((set, get) => ({
  questions: [],
  isLoading: false,

  fetchQuestions: async () => {
    set({ isLoading: true })
    
    // Fetch questions with author profile and all nested answers with their author profiles
    const { data, error } = await supabase
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
      set({ isLoading: false })
      return
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
