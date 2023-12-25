import { Question, Questions } from "../types/question"

export const dummyQuestion: Question = {
    id: '1',
    question: 'How hot is the Sun?',
    sub1: 'The most important question',
    answer: {
        value: 'Very hot'
    },
    displayValue: 'Very Hot',
    type: 'text'
}

export const dummyQuestions: Questions = [dummyQuestion, dummyQuestion, dummyQuestion];