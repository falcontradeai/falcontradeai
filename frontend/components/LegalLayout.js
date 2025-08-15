import Head from 'next/head';

export default function LegalLayout({ children, title, description }) {
  const pageTitle = title ? `${title} | FalconTrade` : 'FalconTrade';
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <article className="prose dark:prose-invert">{children}</article>
    </>
  );
}
