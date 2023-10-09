import { ExistAchievementEntity } from '../entities';

export const ACHIEVEMENT_TESTING: ExistAchievementEntity = {
  id: 1,
  name: 'Месяцев с нами',
  description:
    'За твою первую годовщину в Команде — месяц за месяцем, шаг за шагом',
  image_name: 'testing.png',
  issued_manually: 1,
  category: 'progress',
};

export const ACHIEVEMENT_TESTING_COMPLETED: ExistAchievementEntity = {
  id: 2,
  name: 'Испытательное прошло успешно',
  description: 'Испытательный срок пройден, и это прекрасно',
  image_name: 'testing_completed.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_05_YEARS: ExistAchievementEntity = {
  id: 3,
  name: 'Полгода в Редакции',
  description: 'Вы уже шесть месяцев активно работаете в редакции',
  image_name: 'half_year.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_1_YEARS: ExistAchievementEntity = {
  id: 4,
  name: 'Год в Редакции',
  description: 'Мы вместе уже целый год, и на этом не конец',
  image_name: 'one.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_2_YEARS: ExistAchievementEntity = {
  id: 5,
  name: 'Два года в Редакции',
  description: 'Прошло два года спустя первого написанного текста',
  image_name: 'two.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_3_YEARS: ExistAchievementEntity = {
  id: 6,
  name: 'Три года в Редакции',
  description: 'Третий год вы пишите материалы, которые с интересом читают',
  image_name: 'three.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_4_YEARS: ExistAchievementEntity = {
  id: 7,
  name: 'Четыре года в Редакции',
  description:
    'Вы провели четыре года вместе с нами, теперь точно нас ничего не остановит',
  image_name: 'four.png',
  issued_manually: 1,
  category: 'progress',
};
export const ACHIEVEMENT_REDACTOR_5_YEARS: ExistAchievementEntity = {
  id: 8,
  name: 'Пять лет в Редакции',
  description: 'Это настоящая годовщина. Есть чем гордиться',
  image_name: 'five.png',
  issued_manually: 1,
  category: 'progress',
};

export const ACHIEVEMENTS = [
  ACHIEVEMENT_REDACTOR_05_YEARS,
  ACHIEVEMENT_REDACTOR_1_YEARS,
  ACHIEVEMENT_REDACTOR_2_YEARS,
  ACHIEVEMENT_REDACTOR_3_YEARS,
  ACHIEVEMENT_REDACTOR_4_YEARS,
  ACHIEVEMENT_REDACTOR_5_YEARS,
];
