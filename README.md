# ask.hanseung.kim

SvelteKit과 Cloudflare Workers로 만든 익명 질문 페이지입니다. 데이터는 PocketBase의 `questions`, `answers` 컬렉션을 사용하며 타입은 `pb_schema.json`에서 생성합니다. 질문은 `ESE124 Related`와 `ETC` 분류를 지원합니다. 기본 페이지(`/`)는 영어이며 한국어 페이지는 `/ko`에서 제공합니다.

## 로컬 실행

```sh
npm install
cp .env.example .env
# .env의 POCKETBASE_URL 수정
npm run typegen
npm run dev
```

PocketBase 관리자 화면의 **Settings → Import collections**에서 `pb_schema.json`을 가져올 수 있습니다. 현재 규칙에 따라 익명 사용자는 질문을 만들 수 있고, 답변이 연결된 질문과 답변만 공개 조회됩니다. 답변 작성은 PocketBase 관리자 화면에서 합니다.

## Cloudflare Workers 배포

```sh
npx wrangler secret put POCKETBASE_URL
npm run deploy
```

`POCKETBASE_URL`의 PocketBase 서버는 Cloudflare Worker에서 접근할 수 있어야 합니다. 스키마를 수정한 뒤에는 `npm run typegen`을 다시 실행하고 생성된 타입 파일도 함께 반영합니다.
