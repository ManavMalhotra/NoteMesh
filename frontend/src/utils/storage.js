import { openDB } from "idb";

const dbPromise = openDB("Notemesh", 1, {
  upgrade(db) {
    db.createObjectStore("sharedContent");
  },
});

export async function storeSharedContent(title, text, url) {
  const db = await dbPromise;
  await db.put("sharedContent", { title, text, url }, "latestShared");
}

export async function retrieveSharedContent() {
  const db = await dbPromise;
  return db.get("sharedContent", "latestShared");
}
