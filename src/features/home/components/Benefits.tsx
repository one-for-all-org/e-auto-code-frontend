import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type WhyItem = { title: string; text: string };
type ChatMock = { question: string; answerTitle: string; answerItems: string[] };

function ChatPreview({ mock }: { mock: ChatMock }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
        {mock.question}
      </div>
      <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-white px-5 py-4 text-sm shadow-surface">
        <p className="font-semibold text-foreground">{mock.answerTitle}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-stone-600">
          {mock.answerItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-stone-500">{t('home.chatNote')}</p>
      </div>
    </div>
  );
}

function WhyRow({ text, visual, reverse }: { text: WhyItem; visual: ReactNode; reverse?: boolean }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? 'order-1 lg:order-2' : ''}>
        <h3 className="text-2xl font-bold text-foreground">{text.title}</h3>
        <p className="mt-4 max-w-lg leading-relaxed text-stone-600">{text.text}</p>
      </div>
      <div className={reverse ? 'order-2 lg:order-1' : ''}>{visual}</div>
    </div>
  );
}

export function Benefits() {
  const { t } = useTranslation();
  const items = t('home.whyItems', { returnObjects: true }) as WhyItem[];
  const chats = t('home.chats', { returnObjects: true }) as ChatMock[];

  return (
    <section className="bg-stone-50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-20 px-4 sm:px-6 lg:space-y-24">
        <h2 className="text-center text-3xl font-bold text-foreground sm:text-4xl">{t('home.whyTitle')}</h2>
        <WhyRow text={items[0]} visual={<ChatPreview mock={chats[0]} />} />
        <WhyRow text={items[1]} visual={<ChatPreview mock={chats[1]} />} reverse />
      </div>
    </section>
  );
}
