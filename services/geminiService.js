
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType } from '../types.js';
import { QUESTIONS_PER_ROUND } from '../constants.js';

const questionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: [QuestionType.FILL_IN_THE_BLANK, QuestionType.WRITE_SENTENCE], description: "The type of question." },
            sentence: { type: Type.STRING, description: "For 'fill-in-the-blank', the sentence with '___' as a placeholder." },
            prompt: { type: Type.STRING, description: "For 'write-sentence', a prompt providing a scenario for the user to write about (e.g., 'Describe a friend who makes you laugh.')." },
            correctAnswer: { type: Type.STRING, enum: ['who', 'which', 'that'], description: "The correct word for the blank or the target word for sentence writing." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array containing 'who', 'which', and 'that'." },
            explanation: { type: Type.STRING, description: "A brief explanation of the grammatical rule." },
        },
        required: ["type", "correctAnswer", "options", "explanation"]
    },
};

const getDifficultyPrompt = (difficulty) => {
    switch (difficulty) {
        case 'easy':
            return "Focus on simple sentences with clear subjects. 'who' for people, 'that' for things/animals. Avoid complex clauses.";
        case 'medium':
            return "Introduce more complex sentences. Include non-restrictive clauses using 'which' (with a comma). Sentences can be longer.";
        case 'hard':
            return "Create nuanced sentences where the choice is subtle. Use restrictive and non-restrictive clauses, and include cases where 'that' is preferred over 'which' for essential information.";
    }
}

export const generateQuestionsForGame = async (apiKey, difficulty) => {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
        You are an English grammar expert creating questions for a learning game for 10-13 year olds.
        The game teaches the correct usage of the relative pronouns 'who', 'that', and 'which'.
        
        Generate ${QUESTIONS_PER_ROUND} questions for the '${difficulty}' difficulty level. 
        ${getDifficultyPrompt(difficulty)}
        
        Include a mix of '${QuestionType.FILL_IN_THE_BLANK}' and '${QuestionType.WRITE_SENTENCE}' types.
        For '${QuestionType.FILL_IN_THE_BLANK}', provide a 'sentence' with '___'.
        For '${QuestionType.WRITE_SENTENCE}', provide an engaging 'prompt' that gives the user a scenario to write about. For example, instead of just "Write a sentence using 'who'", the prompt could be "Describe a character from your favorite book *who* is very brave." The prompt should clearly indicate which word to use. The target word should also be set in 'correctAnswer'. Do not provide a 'sentence' field for this type.
        
        Ensure the 'options' array always contains 'who', 'which', and 'that', ideally in a shuffled order.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
                temperature: 1.0,
            },
        });

        const jsonText = response.text.trim();
        const generatedQuestions = JSON.parse(jsonText);
        
        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
            throw new Error("API returned an invalid format.");
        }
        
        return generatedQuestions;
    } catch (error) {
        console.error("Error generating questions:", error);
        throw new Error("Failed to fetch questions from Gemini API.");
    }
};

const validationSchema = {
    type: Type.OBJECT,
    properties: {
        isValid: { type: Type.BOOLEAN, description: "Whether the sentence is grammatically correct and uses the word appropriately." },
        feedback: { type: Type.STRING, description: "A concise explanation for why the sentence is correct or incorrect." },
    },
    required: ["isValid", "feedback"],
};


export const validateSentenceWithAI = async (apiKey, sentence, targetWord) => {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
        As an English grammar expert, evaluate the following sentence from a 12-year-old student.
        The student was asked to write a sentence correctly using the word "${targetWord}".

        Sentence: "${sentence}"

        Analyze two things:
        1. Is the sentence grammatically correct overall?
        2. Is the word "${targetWord}" used correctly according to its grammatical rules (e.g., 'who' for people, 'which' for non-restrictive clauses about things, 'that' for restrictive clauses about things)?

        Provide your evaluation in JSON format.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: validationSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;

    } catch (error) {
         console.error("Error validating sentence:", error);
        return { isValid: false, feedback: "Sorry, I couldn't check your sentence right now. Please try again." };
    }
}