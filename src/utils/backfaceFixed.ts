// モーダル表示時に背景固定
const backfaceFixed = (fixed: boolean): void => {
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;
  document.body.style.paddingRight = fixed ? `${scrollbarWidth}px` : '';

  const scrollingElement = () => {
    const browser = window.navigator.userAgent.toLowerCase();
    if ('scrollingElement' in document) {
      return document.scrollingElement;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (browser.indexOf('webkit') > 0) return document!.body;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document!.documentElement;
  };

  const scrollY = fixed ? scrollingElement()?.scrollTop : parseInt(document.body.style.top || '0', 10);

  const styles = {
    height: '100vh',
    left: '0',
    overflow: 'hidden',
    position: 'fixed',
    top: `${scrollY ? scrollY * -1 : 0}px`,
    width: '100vw',
  };

  const keys = Object.keys(styles) as (keyof typeof styles)[];

  keys.map((key) => {
    document.body.style[key] = fixed ? styles[key] : '';
    return key;
  });

  if (!fixed) window.scrollTo(0, scrollY ? scrollY * -1 : 0);
};

export default backfaceFixed;
