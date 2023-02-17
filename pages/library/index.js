import dynamic from 'next/dynamic';
import fetch from '../../utils/fetcher';
import axios from '../../utils/http';
import { Container } from '../../components/layout';
import { loadPinnedTweet } from '../../lib/load-pinned-tweet';
import { loadNewsletter } from '../../lib/load-newsletter';
import { loadSpecialTagHot } from '../../lib/load-special-tag-hot';
import { loadSpecialTagNew } from '../../lib/load-special-tag-new';

const Sidebar = dynamic(() => import('../../components/sidebar'));
const Tabs = dynamic(() => import('../../components/dashboard/tabs'));

export async function getStaticProps() {
  const newContent = await loadSpecialTagNew();
  const trendingContent = await loadSpecialTagHot();
  const tweets = await loadPinnedTweet();

  const latestNewsletter = await loadNewsletter();

  const response = await axios.get(`/content/topContent`);

  return {
    props: {
      newContent,
      trendingContent,
      tweets,
      latestNewsletter: latestNewsletter[0],
      topContent: response?.data?.data
    },
    revalidate: 60
  };
}

export default function Library({
  newContent,
  trendingContent,
  tweets,
  latestNewsletter,
  topContent
}) {
  const metaTags = {
    title: 'BNBChainDev - Library',
    description:
      "Learn to Develop using BNBChain. Tutorials, SDK's, Frameworks, Developer Tools, Security, Scaffolds, and Projects implementations",
    url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/library`,
    shouldIndex: true
  };

  return (
    <Container metaTags={metaTags}>
      <div className="main-content-wrapper flex justify-center  gap-6  px-2  md:pl-0">
        {/* <main className="max-w-2xl"> */}
        <main className="">
          <Tabs newContent={newContent} trendingContent={trendingContent} />
        </main>

        <aside className="hidden max-w-sm xl:block">
          <Sidebar tweets={tweets} latestNewsletter={latestNewsletter} topContent={topContent} />
        </aside>
      </div>
    </Container>
  );
}
