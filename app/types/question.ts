export interface Question {
  id: string | number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | null
  time_limit: 10 | 20 | 30 | 60
}
