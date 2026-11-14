-- Estrutura FUTURA para e-mails SynthWAVE. Aplicar só após revisão de privacidade.
-- Separada da antiga tabela para mensagens WhatsApp; consentimentos NÃO são transferidos.
CREATE TABLE IF NOT EXISTS synthwave_email_subscriptions (
 id INTEGER PRIMARY KEY,
 email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 consent_version TEXT NOT NULL,
 state TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (state IN ('pending_confirmation','confirmed','unsubscribed')),
 consent_at TEXT NOT NULL,
 confirmation_token_hash TEXT,
 confirmation_expires_at TEXT,
 confirmed_at TEXT,
 unsubscribed_at TEXT,
 source TEXT NOT NULL DEFAULT 'synthwave.fm',
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sw_email_sub_state ON synthwave_email_subscriptions(state);
CREATE TABLE IF NOT EXISTS synthwave_email_events (
 event_id TEXT PRIMARY KEY,
 subscription_id INTEGER NOT NULL,
 event_type TEXT NOT NULL,
 created_at TEXT NOT NULL,
 provider_message_id TEXT,
 FOREIGN KEY(subscription_id) REFERENCES synthwave_email_subscriptions(id)
);
CREATE INDEX IF NOT EXISTS idx_sw_email_events_subscription ON synthwave_email_events(subscription_id);
-- Fila persistente futura deve ter unique key (inscrito, tipo, campanha),
-- confirmações por token aleatório com hash, retries limitados e supressão de descadastros.
