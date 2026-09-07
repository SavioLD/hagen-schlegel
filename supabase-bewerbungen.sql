-- =====================================================================
-- Hagen & Schlegel Karriereseite: Storage-Bucket für den optionalen
-- Lebenslauf-Upload.
-- ---------------------------------------------------------------------
-- Es wird derselbe Ländle-Digital-Upload-Bucket "bewerbungen" genutzt wie
-- bei anderen Karriereseiten (Projekt kxqdybjkcrowqdcpvlqa). Dieser Bucket
-- existiert i. d. R. bereits – dann muss hier nichts ausgeführt werden.
-- Nur bei einem NEUEN Supabase-Projekt einmalig im SQL-Editor ausführen.
--
-- Sicherheit:
--   • Der Bucket ist "public", aber die Pfade enthalten eine zufällige
--     UUID – Dateien sind nur mit dem exakten Link abrufbar. Auflisten des
--     Buckets ist anonym NICHT möglich.
--   • Anon darf ausschließlich hochladen (insert) – kein Überschreiben,
--     kein Löschen, kein Listing.
--   • Max. 10 MB, nur PDF / Word / JPG / PNG / WebP.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bewerbungen', 'bewerbungen', true, 10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anon darf nur neue Dateien in diesen einen Bucket legen.
drop policy if exists "bewerbungen_upload_anon" on storage.objects;
create policy "bewerbungen_upload_anon" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'bewerbungen');
