import en from '../../messages/en.json';
import pt from '../../messages/pt.json';

describe('Translation Parity', () => {
  function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.keys(obj).reduce((res: string[], el) => {
      const val = obj[el];
      if (Array.isArray(val)) {
        return res;
      }
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        return [...res, ...getAllKeys(val as Record<string, unknown>, `${prefix}${el}.`)];
      }
      return [...res, `${prefix}${el}`];
    }, []);
  }

  it('GivenEnAndPtJsonFiles_WhenKeysFlattened_ThenEveryEnKeyExistsInPt', () => {
    const enKeys = getAllKeys(en);
    const ptKeys = getAllKeys(pt);

    enKeys.forEach((key) => {
      expect(ptKeys).toContain(key);
    });
  });

  it('GivenEnAndPtJsonFiles_WhenKeysFlattened_ThenEveryPtKeyExistsInEn', () => {
    const enKeys = getAllKeys(en);
    const ptKeys = getAllKeys(pt);

    ptKeys.forEach((key) => {
      expect(enKeys).toContain(key);
    });
  });
});
