export function extractErrorMessage(err: any, fallback = 'Something went wrong. Please try again.'): string {
  const errorBody = err?.error;

  if (!errorBody) return fallback;

  if (typeof errorBody === 'string') return errorBody;

  if (errorBody.errors && typeof errorBody.errors === 'object') {
    const messages = Object.values(errorBody.errors)
      .flat()
      .filter((m): m is string => typeof m === 'string');
    if (messages.length > 0) return messages.join(' ');
  }

  if (typeof errorBody.detail === 'string') return errorBody.detail;
  if (typeof errorBody.title === 'string') return errorBody.title;

  return fallback;
}