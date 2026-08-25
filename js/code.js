const feedProxy = 'https://api.rss2json.com/v1/api.json?rss_url=';

const formatDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const showStatus = (card, message) => {
  const news = card.querySelector('.latest-news');
  const status = card.querySelector('.news-status');
  status.textContent = message;
  news.classList.remove('has-news');
};

const loadFeed = async card => {
  const feed = card.dataset.rss;
  if (!feed) {
    showStatus(card, 'No feed configured');
    return;
  }

  try {
    const response = await fetch(`${feedProxy}${encodeURIComponent(feed)}`);
    if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
    const data = await response.json();
    const item = data.items?.[0];
    if (!item?.title || !item.link) throw new Error('Feed has no latest item');

    const status = card.querySelector('.news-status');
    const link = document.createElement('a');
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = item.title;
    const date = document.createElement('small');
    date.textContent = formatDate(item.pubDate);
    status.replaceChildren(link, date);
    status.classList.remove('news-empty');
    card.querySelector('.latest-news').classList.add('has-news');
  } catch (error) {
    showStatus(card, 'News unavailable');
  }
};

document.querySelectorAll('.org').forEach(loadFeed);