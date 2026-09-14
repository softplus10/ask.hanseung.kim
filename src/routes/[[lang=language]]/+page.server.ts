import { fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import {
  Collections,
  QuestionsCategoryOptions,
  type AnswersResponse,
  type QuestionsResponse
} from '$lib/pocketbase-types';
import { getPocketBase } from '$lib/server/pocketbase';
import type { Actions, PageServerLoad } from './$types';

type AnswerExpand = {
  question?: QuestionsResponse;
};

const messages = {
  en: {
    required: 'Please enter both a title and your question.',
    titleLength: 'Keep the title to 80 characters or fewer.',
    contentLength: 'Keep your question to 1,000 characters or fewer.',
    category: 'Please choose a category.',
    success: 'Your question was sent. It will appear here once it has been answered.',
    invalid: 'Please review your question and try again.',
    unavailable: 'Your question could not be sent right now. Please try again shortly.'
  },
  ko: {
    required: '제목과 질문을 모두 적어주세요.',
    titleLength: '제목은 80자 이내로 적어주세요.',
    contentLength: '질문은 1,000자 이내로 적어주세요.',
    category: '질문 분류를 선택해주세요.',
    success: '질문을 보냈어요. 답변이 등록되면 이곳에 공개됩니다.',
    invalid: '질문 내용을 다시 확인해주세요.',
    unavailable: '지금은 질문을 보낼 수 없어요. 잠시 후 다시 시도해주세요.'
  }
} as const;

export const load: PageServerLoad = async (event) => {
  const locale: 'en' | 'ko' = event.params.lang === 'ko' ? 'ko' : 'en';

  try {
    const pb = getPocketBase(event);
    const result = await pb.collection(Collections.Answers).getList<AnswersResponse<AnswerExpand>>(1, 24, {
      sort: '-created',
      expand: 'question'
    });

    return {
      locale,
      answers: result.items
        .filter((answer) => answer.expand?.question)
        .map((answer) => ({
          id: answer.id,
          title: answer.title,
          content: answer.content,
          created: answer.created,
          question: answer.expand!.question!
        })),
      serviceReady: true
    };
  } catch (error) {
    console.error('PocketBase answer list could not be loaded.', error);
    return { locale, answers: [], serviceReady: false };
  }
};

export const actions: Actions = {
  ask: async (event) => {
    const locale = event.params.lang === 'ko' ? 'ko' : 'en';
    const text = messages[locale];
    const formData = await event.request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const values = { title, content, category };

    if (!title || !content) {
      return fail(400, { success: false, message: text.required, values });
    }

    if (title.length > 80) {
      return fail(400, { success: false, message: text.titleLength, values });
    }

    if (content.length > 1000) {
      return fail(400, { success: false, message: text.contentLength, values });
    }

    const categories = Object.values(QuestionsCategoryOptions);
    if (!categories.includes(category as (typeof categories)[number])) {
      return fail(400, { success: false, message: text.category, values });
    }

    try {
      const pb = getPocketBase(event);
      await pb.collection(Collections.Questions).create({
        title,
        content,
        category: category as (typeof categories)[number]
      });
      return { success: true, message: text.success };
    } catch (error) {
      console.error('PocketBase question could not be created.', error);

      const message =
        error instanceof ClientResponseError && error.status === 400 ? text.invalid : text.unavailable;

      return fail(502, { success: false, message, values });
    }
  }
};
