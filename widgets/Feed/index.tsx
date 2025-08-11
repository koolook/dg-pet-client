import { NewsCard, NewsItem } from '@widgets/NewsCard'

const news: NewsItem[] = [
  {
    title: 'Quick start',
    content:
      'Looking to quickly add Bootstrap to your project? Use jsDelivr, provided for free by the folks at jsDelivr. Using a package manager or need to download the source files? Head to the downloads page.',
    imageUrl: 'http://localhost:4000/static/turtle.webp',
  },
  {
    title: 'CSS',
    content:
      'Copy-paste the stylesheet <link> into your <head> before all other stylesheets to load our CSS.',
    imageUrl: 'http://localhost:4000/static/near-sea.webp',
  },
  {
    title: 'JS',
    content:
      'Many of our components require the use of JavaScript to function. Specifically, they require jQuery, Popper.js, and our own JavaScript plugins. Place the following <script>s near the end of your pages, right before the closing </body> tag, to enable them. jQuery must come first, then Popper.js, and then our JavaScript plugins.',
  },
  {
    title: 'Starter template',
    content:
      'Be sure to have your pages set up with the latest design and development standards. That means using an HTML5 doctype and including a viewport meta tag for proper responsive behaviors. Put it all together and your pages should look like this',
    imageUrl: 'http://localhost:4000/static/tree.webp',
  },
  {
    title: 'Important globals',
    content:
      'Bootstrap employs a handful of important global styles and settings that you’ll need to be aware of when using it, all of which are almost exclusively geared towards the normalization of cross browser styles. Let’s dive in.',
  },
  {
    title: 'HTML5 doctype',
    content:
      'Bootstrap requires the use of the HTML5 doctype. Without it, you’ll see some funky incomplete styling, but including it shouldn’t cause any considerable hiccups.',
  },
]

export const Feed = () => {
  return (
    <ul className="list-unstyled">
      {news.map((article, index) => (
        <li className="p-2" key={index}>
          <NewsCard item={article} />
        </li>
      ))}
    </ul>
  )
}
