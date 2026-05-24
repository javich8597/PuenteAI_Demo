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
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('questions')
      .insert([
        { 
          author_id: session.user.id,
          title, 
          content, 
          category 
        }
      ])
      
    if (!error) {
      get().fetchQuestions()
    } else {
      console.error("Error adding question:", error)
    }
  },

  addAnswer: async (questionId, content) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error } = await supabase
      .from('answers')
      .insert([
        {
          question_id: questionId,
          author_id: session.user.id,
          content
        }
      ])

    if (!error) {
      get().fetchQuestions()
    } else {
      console.error("Error adding answer:", error)
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
