// =====================================================================
//  SHADOW OF DEATH WEBSITE - SETTINGS
//  This is the only file you need to edit. See "SETUP GUIDE.html".
// =====================================================================
window.SOD_CONFIG = {
  // From Supabase: Project Settings > API (or "Connect").
  // Leave both empty to run the site in DEMO MODE (fake data saved in
  // your own browser only - good for trying things out).
  supabaseUrl: 'https://wqwgkyttvgxizbjwvjrb.supabase.co',
  supabaseAnonKey: 'sb_publishable_p1zRPQ7TLPsuqWabEB5c8w_sVW51rr7',   // the PUBLIC "anon" key only. NEVER the service_role key.

  siteName: 'Shadow of Death',
  // The Play buttons download this file: the small auto-updating launcher
  // that fetches its own Java (a copy of Launcher\Shadow of Death (No Java).exe).
  downloadUrl: 'download/Shadow-of-Death.exe',
  downloadName: 'Shadow of Death.exe',
  discordUrl: '',        // e.g. 'https://discord.gg/xxxx' (leave empty to hide)
};
