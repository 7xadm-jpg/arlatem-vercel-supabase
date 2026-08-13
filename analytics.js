(function () {
  const meta = document.querySelector('meta[name="google-analytics-id"]');
  const measurementId = String(window.__GA_MEASUREMENT_ID__ || meta?.content || '').trim();
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function loadAnalytics() {
    if (document.querySelector('script[data-arlatem-ga]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.dataset.arlatemGa = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('config', measurementId, { anonymize_ip: true });
  }

  function saveChoice(value) {
    try { localStorage.setItem('arlatem_analytics_consent', value); } catch (_) {}
  }

  function showConsent() {
    const banner = document.createElement('aside');
    banner.className = 'privacy-consent';
    banner.setAttribute('aria-label', 'Preferências de privacidade');
    banner.innerHTML = '<p>Usamos dados de navegação anônimos para melhorar o site. Você pode aceitar ou continuar sem medição.</p><div><button type="button" data-consent="deny">Continuar sem aceitar</button><button type="button" data-consent="accept">Aceitar</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (event) {
      const choice = event.target.dataset.consent;
      if (!choice) return;
      saveChoice(choice);
      if (choice === 'accept') loadAnalytics();
      banner.remove();
    });
  }

  let consent = '';
  try { consent = localStorage.getItem('arlatem_analytics_consent') || ''; } catch (_) {}
  if (consent === 'accept') loadAnalytics();
  else if (consent !== 'deny') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showConsent);
    else showConsent();
  }

  document.addEventListener('click', function (event) {
    if (consent !== 'accept' && localStorage.getItem('arlatem_analytics_consent') !== 'accept') return;
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('wa.me')) window.gtag('event', 'generate_lead', { method: 'whatsapp' });
    if (href.includes('/catalogo/')) window.gtag('event', 'view_item_list', { item_list_name: 'catalogo' });
  });
})();
