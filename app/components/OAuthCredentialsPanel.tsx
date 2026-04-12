"use client";

import { useState } from "react";
import { generateOAuthClientAction } from "@/lib/server/oauth-client-actions";

type OAuthClient = {
  client_id: string;
  redirect_uris: string[];
  created_at: string;
  last_used_at?: string;
};

export function OAuthCredentialsPanel() {
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [newCredentials, setNewCredentials] = useState<OAuthClient | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateClient() {
    setLoading(true);
    const result = await generateOAuthClientAction("My MCP Client");
    setLoading(false);
    
    if (result.ok) {
      setNewCredentials(result.client);
      setClient(result.client);
    } else {
      alert(result.error);
    }
  }

  return (
    <section>
      <h2>OAuth Client Credentials</h2>
      <p>
        Use these credentials to configure Claude Web or other OAuth clients
        for MCP server access.
      </p>

      {!client && !newCredentials && (
        <button onClick={generateClient} disabled={loading}>
          {loading ? "Generating..." : "Generate OAuth Credentials"}
        </button>
      )}

      {newCredentials && (
        <div className="credentials-display">
          <div className="alert alert-info">
            <strong>OAuth Client Created!</strong> Use this Client ID to configure
            Claude Web. No secret needed (PKCE authentication).
          </div>
          
          <div className="credential-field">
            <label>Client ID</label>
            <code>{newCredentials.client_id}</code>
            <button onClick={() => navigator.clipboard.writeText(newCredentials.client_id)}>
              Copy Client ID
            </button>
          </div>

          <div className="credential-field">
            <label>Allowed Redirect URIs</label>
            <ul>
              {newCredentials.redirect_uris.map((uri: string) => (
                <li key={uri}><code>{uri}</code></li>
              ))}
            </ul>
            <p className="help-text">
              Pre-configured for Claude Web. PKCE (code challenge) provides security
              without needing a client secret.
            </p>
          </div>
        </div>
      )}

      {client && !newCredentials && (
        <div className="existing-client">
          <p>Client ID: <code>{client.client_id}</code></p>
          <p>Created: {new Date(client.created_at).toLocaleString()}</p>
          {client.last_used_at && (
            <p>Last used: {new Date(client.last_used_at).toLocaleString()}</p>
          )}
        </div>
      )}
    </section>
  );
}
