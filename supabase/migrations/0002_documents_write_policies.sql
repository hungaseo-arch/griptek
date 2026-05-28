-- Allow the anon role to update and delete documents, enabling the in-app
-- 수정(update) / 삭제(delete) actions. Same caveat as 0001: open policies are
-- fine for an internal tool but should be tightened with auth if exposed.

create policy "anon update documents"
  on public.documents for update to anon using (true) with check (true);

create policy "anon delete documents"
  on public.documents for delete to anon using (true);
