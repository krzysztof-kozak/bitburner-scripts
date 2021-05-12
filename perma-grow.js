export async function main(ns) {
  const {
    args: [target = 'joesguns'],
    grow,
    sleep,
  } = ns;

  while (true) {
    await sleep(Math.floor(Math.random() * (30 - 16) + 16) * 1000);
    await grow(target);
  }
}
