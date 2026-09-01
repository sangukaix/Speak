import type { Lesson } from '@/features/lessons/types';

export const lessons: Lesson[] = [
  {
    id: 'share-an-idea',
    category: '업무',
    title: '회의에서 의견 꺼내기',
    description: '상대의 말을 존중하면서 내 의견을 또렷하게 시작해요.',
    durationMinutes: 7,
    level: '중급',
    objectives: ['의견을 부드럽게 시작하기', '이유를 한 문장으로 덧붙이기', '동료에게 생각을 되묻기'],
    keyPhrases: [
      { english: "I'd like to add one thing.", korean: '한 가지 덧붙이고 싶어요.' },
      { english: 'From my perspective, ...', korean: '제 관점에서는 …' },
      { english: 'What do you think?', korean: '어떻게 생각하세요?' },
    ],
    dialogue: [
      {
        id: 'meeting-1',
        context: '팀원이 새 캠페인 일정을 설명했습니다. 이제 의견을 보탤 차례예요.',
        tutorPrompt: 'The launch is planned for next Friday. Does anyone want to add anything?',
        options: [
          {
            id: 'meeting-1-a',
            text: "I'd like to add one thing. We may need more time for testing.",
            coachNote: '의견을 예고한 뒤 이유까지 자연스럽게 이어졌어요.',
          },
          {
            id: 'meeting-1-b',
            text: 'From my perspective, an extra week would help us test the flow.',
            coachNote: '개인 관점임을 밝혀 반대 의견도 부드럽게 전달했어요.',
          },
        ],
      },
      {
        id: 'meeting-2',
        context: '팀원이 왜 시간이 더 필요한지 물었습니다.',
        tutorPrompt: 'What would you like to test before launch?',
        options: [
          {
            id: 'meeting-2-a',
            text: "I'd like to test the sign-up flow on mobile devices.",
            coachNote: '검증 대상을 구체적으로 말해 의견의 설득력이 높아졌어요.',
          },
          {
            id: 'meeting-2-b',
            text: 'The payment flow is my main concern right now.',
            coachNote: 'main concern으로 우선순위를 짧고 선명하게 표현했어요.',
          },
        ],
      },
      {
        id: 'meeting-3',
        context: '의견을 마무리하고 팀의 생각을 확인해 보세요.',
        tutorPrompt: 'That makes sense. How should we decide?',
        options: [
          {
            id: 'meeting-3-a',
            text: 'We could review the test results on Wednesday. What do you think?',
            coachNote: '다음 행동을 제안하고 상대의 의견까지 열어 두었어요.',
          },
          {
            id: 'meeting-3-b',
            text: 'How about a quick check-in after the first test?',
            coachNote: 'How about으로 부담 없이 구체적인 후속 행동을 제안했어요.',
          },
        ],
      },
    ],
  },
  {
    id: 'coffee-small-talk',
    category: '일상',
    title: '카페에서 대화 이어가기',
    description: '짧은 대답에서 멈추지 않고 질문 하나를 더 이어가요.',
    durationMinutes: 5,
    level: '초중급',
    objectives: ['경험을 짧게 설명하기', '후속 질문으로 대화 이어가기', '자연스러운 반응 표현하기'],
    keyPhrases: [
      { english: 'I come here every now and then.', korean: '가끔 여기 와요.' },
      { english: 'How about you?', korean: '당신은 어때요?' },
      { english: 'That sounds nice.', korean: '좋게 들리네요.' },
    ],
    dialogue: [
      {
        id: 'coffee-1',
        context: '옆자리 사람이 이 카페에 자주 오는지 물었습니다.',
        tutorPrompt: 'Do you come here often?',
        options: [
          { id: 'coffee-1-a', text: 'Every now and then. How about you?', coachNote: '짧게 답하고 같은 질문을 돌려 대화를 열었어요.' },
          { id: 'coffee-1-b', text: "It's my second time. I really like the coffee here.", coachNote: '횟수와 이유를 함께 말해 다음 질문의 소재를 만들었어요.' },
        ],
      },
      {
        id: 'coffee-2',
        context: '상대가 이곳에서 주로 일한다고 말했습니다.',
        tutorPrompt: 'I usually work here in the afternoon.',
        options: [
          { id: 'coffee-2-a', text: 'That sounds nice. What kind of work do you do?', coachNote: '반응과 후속 질문을 연결해 관심을 표현했어요.' },
          { id: 'coffee-2-b', text: 'Nice. Is it usually this quiet?', coachNote: '상황과 연결된 질문이라 자연스럽게 이어져요.' },
        ],
      },
    ],
  },
  {
    id: 'hotel-request',
    category: '여행',
    title: '호텔에 정중히 요청하기',
    description: '문제가 생겼을 때 필요한 조치를 차분하고 구체적으로 요청해요.',
    durationMinutes: 6,
    level: '초중급',
    objectives: ['문제를 구체적으로 설명하기', '정중하게 해결 방법 요청하기', '가능한 시간을 확인하기'],
    keyPhrases: [
      { english: 'There seems to be a problem with ...', korean: '…에 문제가 있는 것 같아요.' },
      { english: 'Could someone take a look?', korean: '누군가 확인해 주실 수 있나요?' },
      { english: 'When would that be possible?', korean: '언제 가능할까요?' },
    ],
    dialogue: [
      {
        id: 'hotel-1',
        context: '객실 에어컨이 작동하지 않아 프런트에 전화했습니다.',
        tutorPrompt: 'Front desk. How can I help you?',
        options: [
          { id: 'hotel-1-a', text: 'There seems to be a problem with the air conditioner.', coachNote: '단정적으로 비난하지 않고 문제를 명확히 설명했어요.' },
          { id: 'hotel-1-b', text: "The air conditioner isn't turning on. Could someone take a look?", coachNote: '상태와 원하는 해결 방법을 한 번에 전달했어요.' },
        ],
      },
      {
        id: 'hotel-2',
        context: '직원이 엔지니어를 보내겠다고 답했습니다.',
        tutorPrompt: 'I can send someone up to your room.',
        options: [
          { id: 'hotel-2-a', text: 'Thank you. When would that be possible?', coachNote: '감사를 표현한 뒤 예상 시간을 정중하게 확인했어요.' },
          { id: 'hotel-2-b', text: 'That would be great. I will be in the room for the next hour.', coachNote: '가능한 시간을 알려 조율하기 쉽게 만들었어요.' },
        ],
      },
    ],
  },
];

export const featuredLesson = lessons[0];

export function findLessonById(lessonId: string | undefined) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonById(lessonId: string | undefined) {
  return findLessonById(lessonId) ?? featuredLesson;
}
