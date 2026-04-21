import { routing } from '@/i18n/routing';

it.todo('GivenPtAcceptLanguageHeader_WhenRequestingRootPath_ThenRedirectsToPtPrefix');

describe('Routing Config', () => {
  it('GivenRoutingConfig_WhenChecked_ThenLocalesContainEnAndPt', () => {
    expect(routing.locales).toContain('en');
    expect(routing.locales).toContain('pt');
  });
  it('GivenRoutingConfig_WhenChecked_ThenDefaultLocaleIsEn', () => {
    expect(routing.defaultLocale).toBe('en');
  });
  it('GivenRoutingConfig_WhenChecked_ThenLocalePrefixIsAsNeeded', () => {
    expect(routing.localePrefix).toBe('as-needed');
  });
});
