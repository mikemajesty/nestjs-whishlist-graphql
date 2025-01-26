import { ApiBadRequestException } from './exceptions/http';

export class CollectionUtil {
  static groupBy = <T>(
    collection: unknown[] = [],
    key: string,
  ): { [key: string]: T[] } => {
    if (!key.length) {
      throw new ApiBadRequestException();
    }

    return collection.reduce((prev: any, next: any) => {
      prev[next[key]] = prev[next[key]] ?? [];
      prev[next[key]].push(next);
      return prev;
    }, {}) as { [key: string]: [] };
  };
}
