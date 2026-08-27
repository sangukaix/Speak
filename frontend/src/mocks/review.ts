import type { ReviewItem } from '@/features/lessons/types';

export const reviewItems: ReviewItem[] = [
  {
    id: 'review-1',
    kind: '표현',
    lessonTitle: '회의에서 의견 꺼내기',
    original: 'I have one opinion.',
    improved: "I'd like to add one thing.",
    reason: '회의에서는 opinion을 바로 선언하기보다, 덧붙일 내용이 있다고 예고하면 더 협력적으로 들려요.',
    confidenceLabel: '표현 사용 근거 · 높음',
  },
  {
    id: 'review-2',
    kind: '문법',
    lessonTitle: '카페에서 대화 이어가기',
    original: 'I come here sometimes time.',
    improved: 'I come here every now and then.',
    reason: 'sometimes 자체에 빈도 의미가 있어 time을 덧붙이지 않아요. 예시 문장은 자연스러운 대안이에요.',
    confidenceLabel: '문법 규칙 근거 · 높음',
  },
  {
    id: 'review-3',
    kind: '발음',
    lessonTitle: '호텔에 정중히 요청하기',
    original: 'Could someone take a look?',
    improved: 'could‿someone / take‿a look',
    reason: '실제 분석이 아닌 연결 발음 연습 예시예요. 음성 기능이 연결되면 내 발화 구간을 함께 보여줄 예정입니다.',
    confidenceLabel: '데모 학습 제안 · 측정 아님',
  },
];
