<script lang="ts">
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();

  const translations = {
    en: {
      pageTitle: 'Ask me anything — Hanseung Kim',
      description: 'Ask a question without leaving your name, and read questions that have been answered.',
      homeLabel: 'Home',
      answersNav: 'Browse answers',
      heroFirst: 'Ask me',
      heroSecond: 'anything.',
      heroCopyFirst: "The question you couldn't quite ask,",
      heroCopySecond: "or anything you'd simply like to share.",
      scrollLabel: 'Jump to the question form',
      askFirst: 'Leave your',
      askSecond: 'question here.',
      privacyFirst: "We don't ask for your name or an account.",
      privacySecond: 'Your question stays private until it is answered.',
      titleLabel: 'Question title',
      titlePlaceholder: 'What are you curious about?',
      categoryLabel: 'Category',
      eseCategory: 'ESE124 related',
      otherCategory: 'Other',
      contentLabel: 'Details',
      contentLimit: 'Up to 1,000 characters',
      contentPlaceholder: 'Write freely. A little context will help me give you a better answer.',
      reviewNote: 'Please review your question once before sending.',
      submit: 'Send anonymously',
      answersTitle: 'Recent answers',
      answersNote: 'Only questions with an answer appear here.',
      emptyTitle: 'The first answer is on its way.',
      emptyBody: 'Check back soon. Answered questions will appear here.',
      errorTitle: 'Answers could not be loaded.',
      errorBody: 'Check the PocketBase connection or try again shortly.',
      footer: 'Good questions stay with us.'
    },
    ko: {
      pageTitle: '무엇이든 물어보세요 — 한승김',
      description: '이름을 남기지 않고 궁금한 것을 물어보세요. 답변된 질문도 함께 읽을 수 있습니다.',
      homeLabel: '처음으로',
      answersNav: '답변 모아보기',
      heroFirst: '무엇이든',
      heroSecond: '물어보세요.',
      heroCopyFirst: '궁금했지만 선뜻 묻지 못했던 것,',
      heroCopySecond: '가볍게 나누고 싶은 이야기까지.',
      scrollLabel: '질문 작성란으로 이동',
      askFirst: '당신의 질문을',
      askSecond: '남겨주세요.',
      privacyFirst: '질문자의 이름이나 계정은 받지 않습니다.',
      privacySecond: '답변 전까지 질문은 공개되지 않아요.',
      titleLabel: '질문 제목',
      titlePlaceholder: '어떤 것이 궁금한가요?',
      categoryLabel: '질문 분류',
      eseCategory: 'ESE124 관련',
      otherCategory: '기타',
      contentLabel: '자세한 내용',
      contentLimit: '최대 1,000자',
      contentPlaceholder: '편하게 적어주세요. 맥락을 자세히 알려주면 더 좋은 답을 드릴 수 있어요.',
      reviewNote: '보내기 전에 한 번만 더 내용을 확인해주세요.',
      submit: '익명으로 보내기',
      answersTitle: '최근 답변',
      answersNote: '답변을 마친 질문만 이곳에 나타납니다.',
      emptyTitle: '첫 답변을 준비하고 있어요.',
      emptyBody: '조금만 기다려주세요. 답변이 등록되면 이곳에서 읽을 수 있습니다.',
      errorTitle: '답변을 불러오지 못했어요.',
      errorBody: 'PocketBase 연결 설정을 확인하거나 잠시 후 다시 방문해주세요.',
      footer: '좋은 질문은 오래 남습니다.'
    }
  } as const;

  let copy = $derived(translations[data.locale]);

  function formatDate(value: string) {
    const date = new Date(value.replace(' ', 'T'));
    const locale = data.locale === 'ko' ? 'ko-KR' : 'en-US';
    return Number.isNaN(date.getTime())
      ? value.slice(0, 10)
      : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }

  function formatCategory(category?: string) {
    return category === 'ESE124 Related' ? copy.eseCategory : copy.otherCategory;
  }
</script>

<svelte:head>
  <title>{copy.pageTitle}</title>
  <meta name="description" content={copy.description} />
  <link rel="alternate" hreflang="en" href="/" />
  <link rel="alternate" hreflang="ko" href="/ko" />
</svelte:head>

<div class="page-shell">
  <header class="site-header">
    <a class="brand" href={data.locale === 'ko' ? '/ko' : '/'} aria-label={copy.homeLabel}>
      <span class="brand-mark">?</span>
      <span>ASK.HANSEUNG.KIM</span>
    </a>
    <div class="header-actions">
      <nav class="locale-switch" aria-label="Language">
        <a href="/" aria-current={data.locale === 'en' ? 'page' : undefined}>EN</a>
        <span>/</span>
        <a href="/ko" aria-current={data.locale === 'ko' ? 'page' : undefined}>KO</a>
      </nav>
      <a class="nav-link" href="#answers">{copy.answersNav} <span aria-hidden="true">↘</span></a>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div class="eyebrow"><span></span> ANONYMOUS Q&amp;A</div>
      <h1 id="hero-title">{copy.heroFirst}<br /><em>{copy.heroSecond}</em></h1>
      <p class="hero-copy">{copy.heroCopyFirst}<br />{copy.heroCopySecond}</p>
      <a class="scroll-cue" href="#ask-form" aria-label={copy.scrollLabel}>↓</a>
      <div class="hero-note" aria-hidden="true">
        <span>NO NAME</span>
        <span>NO ACCOUNT</span>
        <span>JUST ASK</span>
      </div>
    </section>

    <section class="ask-section" id="ask-form" aria-labelledby="ask-title">
      <div class="section-intro">
        <p class="section-number">01 / ASK</p>
        <h2 id="ask-title">{copy.askFirst}<br />{copy.askSecond}</h2>
        <p>{copy.privacyFirst}<br />{copy.privacySecond}</p>
      </div>

      <form class="question-form" method="POST" action="?/ask">
        <label for="title">{copy.titleLabel}</label>
        <input
          id="title"
          name="title"
          type="text"
          maxlength="80"
          required
          placeholder={copy.titlePlaceholder}
          value={form?.values?.title ?? ''}
        />

        <fieldset class="category-field">
          <legend>{copy.categoryLabel}</legend>
          <div class="category-options">
            <label>
              <input
                type="radio"
                name="category"
                value="ESE124 Related"
                required
                checked={form?.values?.category === 'ESE124 Related'}
              />
              <span>{copy.eseCategory}</span>
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="ETC"
                required
                checked={!form?.values?.category || form.values.category === 'ETC'}
              />
              <span>{copy.otherCategory}</span>
            </label>
          </div>
        </fieldset>

        <div class="label-row">
          <label for="content">{copy.contentLabel}</label>
          <span>{copy.contentLimit}</span>
        </div>
        <textarea
          id="content"
          name="content"
          maxlength="1000"
          required
          placeholder={copy.contentPlaceholder}
        >{form?.values?.content ?? ''}</textarea>

        {#if form?.message}
          <p class:success={form.success} class:error={!form.success} class="form-message" role="status">
            {form.message}
          </p>
        {/if}

        <div class="form-footer">
          <p><span aria-hidden="true">✦</span> {copy.reviewNote}</p>
          <button type="submit">{copy.submit}<span aria-hidden="true">↗</span></button>
        </div>
      </form>
    </section>

    <section class="answers-section" id="answers" aria-labelledby="answers-title">
      <div class="answers-heading">
        <div>
          <p class="section-number light">02 / ANSWERS</p>
          <h2 id="answers-title">{copy.answersTitle}</h2>
        </div>
        <p>{copy.answersNote}</p>
      </div>

      {#if data.answers.length > 0}
        <div class="answer-list">
          {#each data.answers as answer, index}
            <article class="answer-card">
              <div class="card-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <time datetime={answer.created}>{formatDate(answer.created)}</time>
              </div>
              <div class="card-body">
                {#if answer.question.category}
                  <span class="category-tag">{formatCategory(answer.question.category)}</span>
                {/if}
                <div class="question">
                  <span class="bubble q">Q</span>
                  <div>
                    <h3>{answer.question.title}</h3>
                    <p>{answer.question.content}</p>
                  </div>
                </div>
                <div class="answer">
                  <span class="bubble a">A</span>
                  <div>
                    <h4>{answer.title}</h4>
                    <p>{answer.content}</p>
                  </div>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          <span aria-hidden="true">✦</span>
          <h3>{data.serviceReady ? copy.emptyTitle : copy.errorTitle}</h3>
          <p>{data.serviceReady ? copy.emptyBody : copy.errorBody}</p>
        </div>
      {/if}
    </section>
  </main>

  <footer>
    <div class="footer-mark">?</div>
    <p>{copy.footer}</p>
    <span>© {new Date().getFullYear()} HANSEUNG KIM</span>
  </footer>
</div>
