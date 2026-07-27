import { z } from 'zod';

/**
 * Single Flashcard Schema
 */
export const flashcardSchema = z.object({
  question: z.string().min(1, 'Flashcard question cannot be empty.'),
  answer: z.string().min(1, 'Flashcard answer cannot be empty.'),
});

/**
 * Single Quiz Question Schema
 */
export const quizQuestionSchema = z
  .object({
    question: z.string().min(1, 'Quiz question cannot be empty.'),
    options: z
      .array(z.string().min(1, 'Quiz option cannot be empty.'))
      .min(2, 'Quiz question must have at least 2 options.'),
    correctIndex: z
      .number()
      .int('correctIndex must be an integer.')
      .min(0, 'correctIndex cannot be negative.'),
  })
  .superRefine((data, ctx) => {
    if (data.correctIndex >= data.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `correctIndex (${data.correctIndex}) is out of bounds for options array length (${data.options.length}).`,
        path: ['correctIndex'],
      });
    }
  });

/**
 * Full AI Response Schema
 */
export const aiResponseSchema = z.object({
  flashcards: z
    .array(flashcardSchema)
    .min(1, 'At least one flashcard is required.'),
  quiz: z
    .array(quizQuestionSchema)
    .min(1, 'At least one quiz question is required.'),
});

/**
 * Helper function to validate parsed JSON payload
 * @param {unknown} data 
 * @returns {{ success: true, data: z.infer<typeof aiResponseSchema> } | { success: false, error: string }}
 */
export function validateAIResponse(data) {
  const result = aiResponseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const issues = result.error?.issues || result.error?.errors || [];
    const formattedErrors = issues
      .map((err) => `${err.path.join('.') || 'root'}: ${err.message}`)
      .join(' | ');
    return {
      success: false,
      error: `Validation error: ${formattedErrors || 'Invalid response shape.'}`,
    };
  }
}
