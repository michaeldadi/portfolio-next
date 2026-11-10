import { validateFields, type ContactField } from '../lib/contact';

function wireTabs<T extends HTMLElement>(tabs: T[], select: (tab: T) => void) {
  for (const tab of tabs) {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = tabs.indexOf(tab);
      const target =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      const next = tabs[target];
      if (next) {
        select(next);
        next.focus();
      }
    });
  }
}
function selectTab(tabs: HTMLElement[], active: HTMLElement) {
  for (const tab of tabs) {
    const selected = tab === active;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
}

const heroTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hero-mode]'));
const heroPanel = document.querySelector<HTMLElement>('#hero-copy');
function renderHero(mobile: boolean) {
  const heading = document.querySelector<HTMLElement>('[data-aid="hero-title"]');
  const summary = document.querySelector<HTMLElement>('[data-hero-summary]');
  const cta = document.querySelector<HTMLAnchorElement>('[data-hero-cta]');
  if (heading)
    heading.innerHTML = mobile
      ? 'Mobile products.<br>Built end to end.'
      : 'Founding engineer.<br>Ships the whole stack.';
  if (summary)
    summary.textContent = mobile
      ? 'React Native and Expo products, from the first screen through release and production reliability. Video visits, delivery pipelines, and the details that make an app work.'
      : 'Senior software engineer with 5+ years building production web and mobile products in TypeScript, Next.js, React Native and AWS. Architecture through delivery, then the on-call afterwards.';
  if (cta) {
    cta.href = mobile ? '#work-zealthy-mobile' : '#work';
    cta.textContent = mobile ? 'See mobile work' : 'See selected work';
  }
}
function reserveHeroSpace() {
  if (!heroPanel) return;
  const mobile = heroTabs.some(
    (tab) => tab.dataset.heroMode === 'mobile' && tab.getAttribute('aria-selected') === 'true',
  );
  heroPanel.style.minHeight = '0px';
  renderHero(false);
  const fullHeight = heroPanel.getBoundingClientRect().height;
  renderHero(true);
  const mobileHeight = heroPanel.getBoundingClientRect().height;
  renderHero(mobile);
  heroPanel.style.minHeight = `${Math.max(fullHeight, mobileHeight)}px`;
}
wireTabs(heroTabs, (tab) => {
  selectTab(heroTabs, tab);
  renderHero(tab.dataset.heroMode === 'mobile');
  heroPanel?.setAttribute('aria-labelledby', tab.id);
});
if (heroPanel) {
  void document.fonts.ready.then(reserveHeroSpace);
  let width = window.innerWidth;
  let frame = 0;
  window.addEventListener('resize', () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(reserveHeroSpace);
  });
}

const toolTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-tool-tab]'));
wireTabs(toolTabs, (tab) => {
  selectTab(toolTabs, tab);
  for (const panel of document.querySelectorAll<HTMLElement>('.tool-panel'))
    panel.hidden = panel.id !== `tooling-${tab.dataset.toolTab}`;
});

for (const menu of document.querySelectorAll<HTMLDetailsElement>('.mobile-menu')) {
  const summary = menu.querySelector('summary');
  menu.addEventListener('toggle', () =>
    summary?.setAttribute(
      'aria-label',
      menu.open ? 'Close navigation menu' : 'Open navigation menu',
    ),
  );
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary?.focus();
    }
  });
  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      menu.open = false;
    }),
  );
  document.addEventListener('click', (event) => {
    if (menu.open && event.target instanceof Node && !menu.contains(event.target))
      menu.open = false;
  });
}

if (
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  'IntersectionObserver' in window
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: 'translate(12px, 12px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' },
          );
          observer.unobserve(entry.target);
        }
    },
    { threshold: 0.05 },
  );
  document.querySelectorAll('.rv').forEach((element) => observer.observe(element));
}

interface Turnstile {
  render(element: string, options: Record<string, unknown>): string;
  reset(widget: string): void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
const form = document.querySelector<HTMLFormElement>('#contact-form');
if (form) {
  const formElement = form;
  const status = document.querySelector<HTMLElement>('#contact-status')!;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  submit.disabled = false;
  const fallback = form.querySelector<HTMLElement>('[data-contact-fallback]');
  if (fallback) fallback.hidden = true;
  let submissionId = crypto.randomUUID();
  let token = '';
  let widget: string | undefined;
  let loading: Promise<void> | undefined;
  let sending = false;

  function announce(message: string, state: 'error' | 'success' | 'pending') {
    status.textContent = message;
    status.dataset.state = state;
  }
  function loadVerification() {
    const sitekey = formElement.dataset.sitekey;
    if (!sitekey || loading) return loading;
    loading = new Promise<void>((resolve, reject) => {
      function render() {
        if (!window.turnstile) {
          reject(new Error('Verification unavailable'));
          return;
        }
        widget = window.turnstile.render('#contact-verification', {
          sitekey,
          action: 'portfolio_contact',
          theme: 'light',
          callback: (value: string) => {
            token = value;
          },
          'expired-callback': () => {
            token = '';
          },
          'error-callback': () => {
            token = '';
            announce(
              'Verification could not load. Please try again, or connect on LinkedIn below.',
              'error',
            );
          },
        });
        resolve();
      }
      if (window.turnstile) {
        render();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = render;
      script.onerror = () => {
        loading = undefined;
        script.remove();
        reject(new Error('Verification unavailable'));
      };
      document.head.append(script);
    }).catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
    return loading;
  }
  function safeLoad() {
    loadVerification()?.catch(() =>
      announce(
        'Verification could not load. Please try again, or connect on LinkedIn below.',
        'error',
      ),
    );
  }
  form.addEventListener('focusin', safeLoad, { once: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          safeLoad();
          observer.disconnect();
        }
      },
      { rootMargin: '350px' },
    );
    observer.observe(form);
  }
  form.addEventListener('input', () => {
    if (!sending) submissionId = crypto.randomUUID();
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    const data = Object.fromEntries(new FormData(formElement));
    const validation = validateFields(data);
    for (const field of ['name', 'email', 'message'] as ContactField[]) {
      const input = formElement.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      const error = document.getElementById(`${field}-error`)!;
      input.setAttribute('aria-invalid', String(Boolean(validation.fields[field])));
      error.textContent = validation.fields[field] ?? '';
    }
    if (!validation.valid) {
      (formElement.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      announce('Check the highlighted fields.', 'error');
      return;
    }
    if (!formElement.dataset.sitekey) {
      announce('The contact form is not connected yet. Please connect on LinkedIn below.', 'error');
      return;
    }
    try {
      await loadVerification();
    } catch {
      announce(
        'Verification is unavailable. Please try again, or connect on LinkedIn below.',
        'error',
      );
      return;
    }
    if (!token) {
      announce('Please complete the spam verification, then send your message.', 'error');
      return;
    }
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Sending…';
    const fields = Array.from(
      formElement.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea'),
    );
    fields.forEach((field) => {
      field.disabled = true;
    });
    formElement.setAttribute('aria-busy', 'true');
    announce('Sending your message…', 'pending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validation.value, turnstileToken: token, submissionId }),
        signal: AbortSignal.timeout(30000),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fields?: Partial<Record<ContactField, string>>;
      };
      if (response.status === 202 && result.ok) {
        formElement.reset();
        submissionId = crypto.randomUUID();
        announce('Your message has been submitted. Thanks for getting in touch.', 'success');
        status.focus();
      } else if (response.status === 429)
        announce('Too many attempts. Please wait a minute and try again.', 'error');
      else if (response.status === 403)
        announce(
          'Verification expired or could not be confirmed. Please verify again and retry.',
          'error',
        );
      else if (response.status === 409) {
        submissionId = crypto.randomUUID();
        announce('This submission needs a fresh attempt. Please verify again and resend.', 'error');
      } else if (response.status === 422 && result.fields) {
        for (const [field, message] of Object.entries(result.fields)) {
          if (!['name', 'email', 'message'].includes(field)) continue;
          document.getElementById(`${field}-error`)!.textContent = message ?? '';
          (formElement.elements.namedItem(field) as HTMLInputElement).setAttribute(
            'aria-invalid',
            'true',
          );
        }
        (formElement.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
        announce('Check the highlighted fields.', 'error');
      } else
        announce(
          'Your message could not be confirmed. Your text is still here; please retry or connect on LinkedIn below.',
          'error',
        );
    } catch {
      announce(
        'Your message could not be confirmed. Your text is still here; retrying the same message is safe.',
        'error',
      );
    } finally {
      sending = false;
      token = '';
      if (widget) window.turnstile?.reset(widget);
      fields.forEach((field) => {
        field.disabled = false;
      });
      submit.disabled = false;
      submit.textContent = 'Send message';
      formElement.removeAttribute('aria-busy');
    }
  });
}
