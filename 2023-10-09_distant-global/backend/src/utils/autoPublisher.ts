import News from "../models/news";

export function autoPublisher() {
  return setInterval(
    async () => {
      try {
        const news = await News.find({ published: false }).sort({
          publishedAt: 1,
        });

        const now = new Date();

        for (const doc of news) {
          if (now.getTime() >= new Date(doc.publishedAt).getTime()) {
            await doc.updateOne({ published: true, publishedAt: now });
          } else {
            break;
          }
        }
      } catch (err) {
        console.error(`Ошибка при автоматической публикации: ${err}`);
      }
    },
    1 * 60 * 1000,
  );
}
