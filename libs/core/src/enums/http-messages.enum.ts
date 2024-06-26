export enum HttpMessagesEnum {
  USERS_NOT_FOUND = 'Юзер не найден',

  TASK_NOT_FOUND = 'Такая задача не найдена',
  TASK_ALREADY_IN_WORK = 'Задача уже в работе вы не можете её взять',
  TASK_USER_IS_BUSY = 'Вы уже и так взяли задачу. Не нужно перетруждаться',
  TASK_METHOD_UNAVALIBLE_FOR_STATUS = 'Этот метод недоступен для текущего статуса задачи',

  MARKET_EXISTS = 'Такой промокод уже добавлен',
  MARKET_PROMO_NOT_FOUND = 'Извините промокод не найден',

  FORBIDDEN_OBJECT = 'Вы не имеете доступа к этому объекту',
  ERROR_TOKEN = 'Токен недействителен',
  SERVICE_UNAVAILABLE = 'Сервис недоступен',
}
