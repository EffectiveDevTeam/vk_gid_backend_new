export const getHumanyTime = (unixtime: number) => {
  let date: string,
    time: string,
    year: string | number,
    month: string,
    day: string | number,
    hours: string,
    minutes: string,
    datetime: string;
  if (unixtime !== null) {
    unixtime = unixtime * 1e3;
    const dateObject = new Date(unixtime);
    month = monthsConvert(dateObject.getMonth());
    year = dateObject.getFullYear();
    day = dateObject.getDate();
    date = day + ' ' + month + ' ' + year;
    hours = normalizeTime(dateObject.getHours());
    minutes = normalizeTime(dateObject.getMinutes());
    time = hours + ':' + minutes;
    datetime = date + ' ' + time;
  }
  return { date, time, year, month, day, hours, minutes, datetime };
};
export const normalizeTime = (time: number) => {
  if (time < 10) {
    return '0' + time;
  } else {
    return '' + time;
  }
};
export const monthsConvert = (index: number) => {
  const mounts = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  return mounts[index];
};
