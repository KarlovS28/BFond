import { db, childrenTable, storiesTable } from "@workspace/db";
import { getSettings } from "./settings";

export async function seedIfEmpty(): Promise<void> {
  await getSettings();

  const existingChildren = await db.select().from(childrenTable).limit(1);
  if (existingChildren.length === 0) {
    await db.insert(childrenTable).values([
      {
        name: "Алиса",
        surname: "Морозова",
        age: 5,
        diagnosis: "ДЦП, спастический тетрапарез",
        story:
          "Алиса родилась раньше срока. Её улыбка способна растопить любое сердце. Сейчас Алисе нужен курс реабилитации в специализированном центре, чтобы она смогла сделать первые самостоятельные шаги. Каждое занятие — это маленькая победа, которой ждёт вся семья.",
        photoUrl:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80",
        targetSum: 320000,
        collectedSum: 145000,
        isActive: true,
        isUrgent: true,
      },
      {
        name: "Тимур",
        surname: "Каримов",
        age: 8,
        diagnosis: "Острый лимфобластный лейкоз",
        story:
          "Тимур обожает футбол и мечтает стать вратарём. Сейчас он проходит сложное лечение, и семье срочно нужна помощь с покупкой дорогостоящего препарата, который не входит в перечень ОМС. Врачи дают хорошие шансы при условии своевременной терапии.",
        photoUrl:
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=900&q=80",
        targetSum: 580000,
        collectedSum: 312000,
        isActive: true,
        isUrgent: true,
      },
      {
        name: "Ева",
        surname: "Ковалёва",
        age: 3,
        diagnosis: "Врождённый порок сердца",
        story:
          "Маленькой Еве предстоит операция в федеральном кардиоцентре. Семья из небольшого посёлка делает всё возможное, но средств на проезд, проживание родителей и реабилитацию катастрофически не хватает. Давайте поможем Еве вернуться домой здоровой.",
        photoUrl:
          "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=900&q=80",
        targetSum: 215000,
        collectedSum: 87500,
        isActive: true,
        isUrgent: false,
      },
    ]);
  }

  const existingStories = await db.select().from(storiesTable).limit(1);
  if (existingStories.length === 0) {
    await db.insert(storiesTable).values([
      {
        title: "Маша снова улыбается",
        description:
          "Благодаря 1247 неравнодушным сердцам мы собрали средства на операцию для Маши. Сегодня она ходит в школу и занимается танцами.",
        photoUrl:
          "https://images.unsplash.com/photo-1490735891913-40897cdfcb9f?w=1100&q=80",
      },
      {
        title: "Серёжа — наш маленький супергерой",
        description:
          "Курс химиотерапии позади. Серёжа с мамой каждый месяц приезжает к нам в гости с пирогом и рассказами о новых рисунках.",
        photoUrl:
          "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1100&q=80",
      },
      {
        title: "Аня делает первые шаги",
        description:
          "Реабилитация стала для семьи Ани новым началом. Спустя год тренировок Аня сделала свои первые самостоятельные шаги.",
        photoUrl:
          "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1100&q=80",
      },
    ]);
  }
}
