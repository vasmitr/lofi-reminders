export async function isOPFSAvailable() {
  if (!navigator.storage || !navigator.storage.getDirectory) {
    return false;
  }

  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle("test.txt", { create: true });

    const writable = await fileHandle.createWritable();
    await writable.write("test");
    await writable.close();

    const file = await fileHandle.getFile();
    const text = await file.text();

    await root.removeEntry("test.txt");

    return text === "test";
  } catch (e: unknown) {
    console.log(e instanceof Error ? e.message : e);
    return false;
  }
}
