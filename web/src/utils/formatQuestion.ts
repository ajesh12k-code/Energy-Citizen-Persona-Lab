export interface FormattedQuestion {
  statement: string;
  instruction: string;
  lowAnchor?: string;
  highAnchor?: string;
  isNumericScale: boolean;
}

export function formatSurveyQuestion(id: string, rawText: string): FormattedQuestion {
  const [statementPart, contextPart = ''] = rawText.split(' - ');

  if (id.startsWith('c11__')) {
    return {
      statement: statementPart.trim(),
      instruction: 'How complex do you find this?',
      lowAnchor: '1 = Not very complex',
      highAnchor: '7 = Extremely complex',
      isNumericScale: true,
    };
  }

  if (id.startsWith('c14__') || id.startsWith('c15__') || id.startsWith('c45__')) {
    return {
      statement: `“${statementPart.trim()}”`,
      instruction: 'To what extent do you disagree or agree with this statement?',
      lowAnchor: '1 = Strongly disagree',
      highAnchor: '7 = Strongly agree',
      isNumericScale: true,
    };
  }

  return {
    statement: statementPart.trim(),
    instruction: contextPart.replace(/\.\.\.$/, '').trim(),
    isNumericScale: false,
  };
}
